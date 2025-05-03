const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------------------------------------------------------------------------
// GET Section (Fetching existing data from the database)
// -------------------------------------------------------------------------------------------------------------------

// Get profile information given by an account id
app.get('/api/accounts', async (req, res) => {
  const accountId = req.query.account_id;
  
    if (!accountId) {
      return res.status(400).json({ error: "Missing account_id" });
    }

try {
  const [rows] = await db.query(`
    SELECT 
      u.account_id,
      u.first_name,
      u.last_name,
      u.account_balance
    FROM UserAccount u
    WHERE u.account_id = ?
    `,
    [accountId]);

  res.json(rows);
} catch (err) {
  console.error(err);
  res.status(500).send("Error fetching account data");
}
});

// Get an account id given by an email and password
app.get('/api/accounts/id', async (req, res) => {
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
  res.status(500).send("Error fetching account id");
}
});

// Get an account dark mode boolean given by an account id
app.get('/api/accounts/darkmode', async (req, res) => {
  const accountId = req.query.account_id;
  
    if (!accountId) {
      return res.status(400).json({ error: "Missing account_id" });
    }

try {
  const [rows] = await db.query(`
    SELECT 
      u.dark_mode
    FROM UserAccount u
    WHERE u.account_id = ?
    `,
    [accountId]);

  res.json(rows);
} catch (err) {
  console.error(err);
  res.status(500).send("Error fetching dark mode setting");
}
});

// Get settings information given by an account id (password not given)
app.get('/api/settings', async (req, res) => {
  const accountId = req.query.account_id;
  
    if (!accountId) {
      return res.status(400).json({ error: "Missing account_id" });
    }

try {
  const [rows] = await db.query(`
    SELECT 
      u.email,
      u.dark_mode
    FROM UserAccount u
    WHERE u.account_id = ?
    `,
    [accountId]);

  res.json(rows);
} catch (err) {
  console.error(err);
  res.status(500).send("Error fetching settings");
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
        sh.approval_status,
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

// Update a first name given by an account id
app.put('/api/accounts/firstname', async (req, res) => {
  const { account_id, first_name } = req.body;

  if (!account_id || !first_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE UserAccount
      SET first_name = ?
      WHERE account_id = ?
      `,
      [first_name, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No account with that ID found' });
    }

    res.status(200).json({ message: 'First name updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change first name' });
  }
});

// Update a first name given by an account id
app.put('/api/accounts/lastname', async (req, res) => {
  const { account_id, last_name } = req.body;

  if (!account_id || !last_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE UserAccount
      SET last_name = ?
      WHERE account_id = ?
      `,
      [last_name, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No account with that ID found' });
    }

    res.status(200).json({ message: 'Last name updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change last name' });
  }
});

// Update an account balance given by an account id
app.put('/api/accounts/balance', async (req, res) => {
  const { account_id, balance } = req.body;

  if (!account_id || !balance) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE UserAccount
      SET account_balance = ?
      WHERE account_id = ?
      `,
      [balance, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No account with that ID found' });
    }

    res.status(200).json({ message: 'Account balance updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change account balance' });
  }
});

// Update an email given by an account id
app.put('/api/accounts/email', async (req, res) => {
  const { account_id, email } = req.body;

  if (!account_id || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE UserAccount
      SET email = ?
      WHERE account_id = ?
      `,
      [email, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No account with that ID found' });
    }

    res.status(200).json({ message: 'Account email updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change account email' });
  }
});

// Update an email given by an account id
app.put('/api/accounts/password', async (req, res) => {
  const { account_id, password } = req.body;

  if (!account_id || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE UserAccount
      SET password = ?
      WHERE account_id = ?
      `,
      [password, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No account with that ID found' });
    }

    res.status(200).json({ message: 'Account password updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change account password' });
  }
});

// Update a darkmode settings given by an account id
app.put('/api/accounts/darkmode', async (req, res) => {
  const { account_id, darkmode } = req.body;

  if (!account_id || !darkmode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await db.query(
      `
      UPDATE UserAccount
      SET dark_mode = ?
      WHERE account_id = ?
      `,
      [darkmode, account_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No account with that ID found' });
    }

    res.status(200).json({ message: 'Account darkmode setting updated'});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change account darkmode setting' });
  }
});

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
    res.status(500).json({ error: 'Failed to update approval status' });
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
    res.status(500).json({ error: 'Failed to update approval status' });
  }
});

// -------------------------------------------------------------------------------------------------------------------
// DELETE Section (Deleting existing data from the database)
// -------------------------------------------------------------------------------------------------------------------

app.delete('/api/contacts', async (req, res) => {
  const accountId = req.query.account_id;
  const contactId = req.query.contact_id;

  try {
    // Check if it exists first
    const [check] = await db.query(
      `
      SELECT * FROM Contact
      WHERE account_id = ?
      AND contact_id = ?
      `,
      [accountId ,contactId]);
    if (check.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await db.query(
      `
      DELETE FROM Contact
      WHERE account_id = ?
      AND contact_id = ?
      `, 
      [accountId, contactId]);

    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;