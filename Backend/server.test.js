const request = require('supertest');
const express = require('express');
const app = require('./server');
const db = require('./db');

// Mock the db module
jest.mock('./db');

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------- GET Requests -----------------------------

  test('GET /api/accounts - should return account data', async () => {
    db.query.mockResolvedValue([[{ account_id: 1, first_name: 'John', last_name: 'Doe', account_balance: 100 }]]);
    const res = await request(app).get('/api/accounts?account_id=1');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('account_id');
  });

  test('GET /api/accounts/id - should return account id for correct credentials', async () => {
    db.query.mockResolvedValue([[{ account_id: 1 }]]);
    const res = await request(app).get('/api/accounts/id?email=test@example.com&password=1234');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('account_id');
  });

  test('GET /api/accounts/darkmode - should return dark mode setting', async () => {
    db.query.mockResolvedValue([[{ dark_mode: true }]]);
    const res = await request(app).get('/api/accounts/darkmode?account_id=1');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('dark_mode');
  });

  test('GET /api/settings - should return settings', async () => {
    db.query.mockResolvedValue([[{ email: 'test@example.com', dark_mode: true }]]);
    const res = await request(app).get('/api/settings?account_id=1');
    expect(res.statusCode).toBe(200);
    expect(res.body[0]).toHaveProperty('email');
  });

  test('GET /api/expenses - should return expenses list', async () => {
    db.query.mockResolvedValue([[{ expense_id: 1, expense_title: 'Lunch', expense_amount: 20 }]]);
    const res = await request(app).get('/api/expenses?account_id=1');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/requests/pending - should return pending requests', async () => {
    db.query.mockResolvedValue([[{ split_id: 1 }]]);
    const res = await request(app).get('/api/requests/pending?account_id=1');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/requests/notpending - should return non-pending requests', async () => {
    db.query.mockResolvedValue([[{ split_id: 1 }]]);
    const res = await request(app).get('/api/requests/notpending?account_id=1');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/contacts - should return contacts', async () => {
    db.query.mockResolvedValue([[{ account_id: 2, first_name: 'Jane', last_name: 'Smith' }]]);
    const res = await request(app).get('/api/contacts?account_id=1');
    expect(res.statusCode).toBe(200);
  });

  // ----------------------------- POST Requests -----------------------------

  test('POST /api/accounts - should create account', async () => {
    db.query.mockResolvedValue([{ insertId: 5 }]);
    const res = await request(app).post('/api/accounts').send({
      first_name: 'John', last_name: 'Doe', password: '1234', email: 'john@example.com'
    });
    expect(res.statusCode).toBe(201);
  });

  test('POST /api/expenses - should create expense', async () => {
    db.query
      .mockResolvedValueOnce([{ insertId: 10 }])
      .mockResolvedValueOnce([{ insertId: 20 }]);
    const res = await request(app).post('/api/expenses').send({
      account_id: 1, expense_title: 'Dinner', expense_amount: 50, expense_date_time: '2025-01-01T12:00:00Z'
    });
    expect(res.statusCode).toBe(201);
  });

  test('POST /api/splitmember - should add split member', async () => {
    db.query.mockResolvedValue([{}]);
    const res = await request(app).post('/api/splitmember').send({
      split_id: 1, account_id: 2, split_amount: 25
    });
    expect(res.statusCode).toBe(201);
  });

  test('POST /api/contacts - should add contact', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).post('/api/contacts').send({
      account_id: 1, contact_id: 2, first_name: 'Jane', last_name: 'Doe'
    });
    expect(res.statusCode).toBe(201);
  });

  // ----------------------------- PUT Requests -----------------------------

  test('PUT /api/accounts/firstname - should update first name', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/accounts/firstname').send({
      account_id: 1, first_name: 'John'
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/accounts/lastname - should update last name', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/accounts/lastname').send({
      account_id: 1, last_name: 'Doe'
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/accounts/balance - should update balance', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/accounts/balance').send({
      account_id: 1, balance: 1000
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/accounts/email - should update email', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/accounts/email').send({
      account_id: 1, email: 'new@example.com'
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/accounts/password - should update password', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/accounts/password').send({
      account_id: 1, password: 'newpass'
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/accounts/darkmode - should update darkmode', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/accounts/darkmode').send({
      account_id: 1, darkmode: true
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/splitmember - should update split member status', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/splitmember').send({
      split_id: 1, account_id: 2, member_approval_status: 'accepted'
    });
    expect(res.statusCode).toBe(200);
  });

  test('PUT /api/requests/pending - should update request approval status', async () => {
    db.query.mockResolvedValue([{ affectedRows: 1 }]);
    const res = await request(app).put('/api/requests/pending').send({
      split_id: 1, approval_status: 'accepted'
    });
    expect(res.statusCode).toBe(200);
  });

  // ----------------------------- DELETE Requests -----------------------------

  test('DELETE /api/contacts - should delete contact', async () => {
    db.query
      .mockResolvedValueOnce([[{ contact_id: 2 }]])  // Check existence
      .mockResolvedValueOnce([{}]); // Deletion
    const res = await request(app).delete('/api/contacts?account_id=1&contact_id=2');
    expect(res.statusCode).toBe(200);
  });

});
