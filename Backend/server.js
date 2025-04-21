const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/expenses', async (req, res) => {
    const accountId = req.query.account_id;
  
    if (!accountId) {
      return res.status(400).json({ error: "Missing account_id" });
    }

  try {
    const [rows] = await db.query(`
      SELECT 
        e.account_id,
        e.expense_title,
        e.expense_amount,
        e.expense_date_time,
        CONCAT(u.first_name, ' ', u.last_name) AS partnerName,
        sm.split_amount AS partnerShare,
        (e.expense_amount - sm.split_amount) AS youShare,
        ROUND((sm.split_amount / e.expense_amount) * 100, 2) AS partnerPercentage
      FROM Expense e
      JOIN SplitHistory sh ON e.expense_id = sh.expense_id
      JOIN SplitMember sm ON sh.split_id = sm.split_id
      JOIN UserAccount u ON sm.account_id = u.account_id
      WHERE e.account_id = ?
    `, [accountId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching expenses");
  }
});

app.get("/api/requests", async (req, res) => {
    const accountId = req.query.account_id;
  
    if (!accountId) {
      return res.status(400).json({ error: "Missing account_id" });
    }
    
    try {
      const [rows] = await db.query(`
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
  

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
