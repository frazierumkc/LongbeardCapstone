const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------------------------------------------------------
// GET Section (Fetching existing data from the database)
// -------------------------------------------------------------------------------------------------------------------

// Get an account id given by an email and password
app.get('/api/accounts', async (req, res) => {
  const accountEmail = req.query.email;
  const accountPassword = req.query.password;

  if (!accountEmail || !accountPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

try {
  const [rows] = await db.query(`
    SELECT 
      u.account_id
    FROM UserAccount u
    WHERE u.email = ?
    AND u.password = ?
    `,
    [accountEmail, accountPassword]);

  res.json(rows);
} catch (err) {
  console.error(err);
  res.status(500).send("Error fetching expenses");
}
});

// Get all expenses owned by one account
app.get('/api/expenses', async (req, res) => {
    const accountId = req.query.account_id;
  
    if (!accountId) {
      return res.status(400).json({ error: "Missing account_id" });
    }

  try {
    const [rows] = await db.query(`
      SELECT 
        e.account_id,
        e.expense_id,
        e.expense_title,
        e.expense_amount,
        e.expense_date_time,
        CONCAT(u.first_name, ' ', u.last_name) AS partner_name,
        sm.split_amount AS partner_share,
        (e.expense_amount - sm.split_amount) AS you_share,
        ROUND((sm.split_amount / e.expense_amount) * 100, 2) AS partner_percentage
      FROM Expense e
      JOIN SplitHistory sh ON e.expense_id = sh.expense_id
      JOIN SplitMember sm ON sh.split_id = sm.split_id
      JOIN UserAccount u ON sm.account_id = u.account_id
      WHERE e.account_id = ?
      `,
      [accountId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching expenses");
  }
});

// Get all pending requests going toward one account
app.get("/api/requests/pending", async (req, res) => {
  const accountId = req.query.account_id;

  if (!accountId) {
    return res.status(400).json({ error: "Missing account_id" });
  }
  
  try {
    const [rows] = await db.query(
      `
      SELECT
        sh.split_id,
        sh.split_date_time,
        sh.approval_status,
        e.expense_title,
        e.expense_amount,
        e.expense_date_time,
        u.first_name,
        u.last_name,
        sm.account_id,
        sm.split_amount,
        sm.member_approval_status
      FROM SplitHistory sh
      JOIN Expense e ON sh.expense_id = e.expense_id
      JOIN SplitMember sm ON sh.split_id = sm.split_id
      JOIN UserAccount u ON e.account_id = u.account_id
      WHERE sm.member_approval_status IS NULL
      AND sm.account_id = ?
      `, [accountId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching split requests");
  }
});

// Get all accepted or denied requests going toward one account
app.get("/api/requests/notpending", async (req, res) => {
  const accountId = req.query.account_id;

  if (!accountId) {
    return res.status(400).json({ error: "Missing account_id" });
  }
  
  try {
    const [rows] = await db.query(
      `
      SELECT
        sh.split_id,
        sh.split_date_time,
        sh.approval_status,
        e.expense_title,
        e.expense_amount,
        e.expense_date_time,
        u.first_name,
        u.last_name,
        sm.account_id,
        sm.split_amount,
        sm.member_approval_status
      FROM SplitHistory sh
      JOIN Expense e ON sh.expense_id = e.expense_id
      JOIN SplitMember sm ON sh.split_id = sm.split_id
      JOIN UserAccount u ON e.account_id = u.account_id
      WHERE sm.member_approval_status IS NOT NULL
      AND sm.account_id = ?
      `, [accountId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching split requests");
  }
});
  
//Get all contacts owned by one account
app.get("/api/contacts", async (req, res) => {
  const accountId = req.query.account_id;

  if (!accountId) {
    return res.status(400).json({ error: "Missing account_id" });
  }
  
  try {
    const [rows] = await db.query(
      `
      SELECT * FROM
      (
      SELECT
        c.contact_id AS account_id,
        u.first_name,
        u.last_name
      FROM Contact c
      JOIN UserAccount u ON c.contact_id = u.account_id
      WHERE c.account_id = ?
      ) AS s
      UNION
      (
      SELECT
        c.account_id,
        u.first_name,
        u.last_name
      FROM Contact c
      JOIN UserAccount u ON c.account_id = u.account_id
      WHERE c.contact_id = ?
      )
      `, [accountId, accountId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching contacts");
  }
});

// -------------------------------------------------------------------------------------------------------------------
// POST Section (Inserting new data into the database)
// -------------------------------------------------------------------------------------------------------------------

// Create a new user account
app.post('/api/accounts', async (req, res) => {
  const { first_name, last_name, password, email } = req.body;

  if (!first_name || !last_name || !password || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO UserAccount (first_name, last_name, password, email)
      VALUES (?, ?, ?, ?)
      `,
      [first_name, last_name, password, email]
    );

    const newAccountId = result.insertId;

    res.status(201).json({ message: 'New account added', account_id: newAccountId});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add split member' });
  }
});

// Create a new expense and split
app.post('/api/expenses', async (req, res) => {
  const { account_id, expense_title, expense_amount, expense_date_time } = req.body;

  if (!account_id || !expense_title || !expense_amount || !expense_date_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO Expense (account_id, expense_title, expense_amount, expense_date_time)
      VALUES (?, ?, ?, ?)
      `,
      [account_id, expense_title, expense_amount, expense_date_time]
    );

    const newExpenseId = result.insertId;

    const [result2] = await db.query(
      `
      INSERT INTO SplitHistory (split_date_time, expense_id)
      VALUES (?, ?)
      `,
      [expense_date_time, newExpenseId]
    );

    const newSplitId = result2.insertId;

    res.status(201).json({ message: 'Expense added', expense_id: newExpenseId, split_id: newSplitId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Create a new member for a given pending split
app.post('/api/splitmember', async (req, res) => {
  const { split_id, account_id, split_amount } = req.body;

  if (!split_id || !account_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO SplitMember (split_amount, account_id, split_id)
      VALUES (?, ?, ?)
      `,
      [split_amount, account_id, split_id]
    );

    res.status(201).json({ message: 'Split member added'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add split member' });
  }
});

// Create a new contact
app.post('/api/contacts', async (req, res) => {
  const { account_id, contact_id, first_name, last_name } = req.body;

  if (!account_id || !contact_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      INSERT INTO Contact (account_id, contact_id)
      SELECT ?, ?
      FROM DUAL
      WHERE EXISTS (
        SELECT 1 FROM UserAccount
        WHERE account_id = ?
        AND first_name = ?
        AND last_name = ?
      )
      AND NOT EXISTS (
        SELECT 1 FROM Contact
        WHERE account_id = ?
        AND contact_id = ?
      )
      AND NOT EXISTS (
        SELECT 1 FROM Contact
        WHERE account_id = ?
        AND contact_id = ?
      )
      `,
      [account_id, contact_id, // Elements to insert
        contact_id, first_name, last_name, // Elements to check if account exists
        account_id, contact_id, // Duplicate check
        contact_id, account_id // Duplicate check
       ]
    );

    if (result.affectedRows == 0) {
      return res.status(404).json({ message: 'Contact ID and name do not match an existing account' });
    }

    res.status(201).json({ message: 'Contact added'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// -------------------------------------------------------------------------------------------------------------------
// PUT Section (Updating existing data in the database)
// -------------------------------------------------------------------------------------------------------------------

// Update a split to be approved or denied by a given spit member
app.put('/api/splitmember', async (req, res) => {
  const { split_id, account_id, member_approval_status } = req.body;

  if (!split_id || !account_id || !member_approval_status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE SplitMember
      SET member_approval_status = ?
      WHERE split_id = ?
      AND account_id = ?
      `,
      [member_approval_status, split_id, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No such split found' });
    }

    res.status(200).json({ message: 'Request status updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Set a request as accepted or declined
app.put('/api/requests/pending', async (req, res) => {
  const { split_id, approval_status } = req.body;

  if (!split_id || !approval_status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE SplitHistory
      SET approval_status = ?
      WHERE split_id = ?
      `,
      [approval_status, split_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No request with that split ID found' });
    }

    res.status(200).json({ message: 'Request status updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
