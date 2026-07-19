/*
------------------------------------------------
File: db.js
Purpose: PostgreSQL database client config.
Responsibilities: Initializes the pg connection Pool and exports query methods.
Dependencies: pg, dotenv
------------------------------------------------
*/

const { Pool } = require('pg');
require('dotenv').config();

// Initialize the pg connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected database client error:', err);
});

module.exports = {
  /*
  Query helper function.
  Params: text (SQL query), params (variables array).
  Returns: Pool query promise.
  */
  query: (text, params) => pool.query(text, params),
  pool
};
