/*
------------------------------------------------
File: initDb.js
Purpose: Database initialization script.
Responsibilities: Reads schema.sql and runs all queries to build tables.
Dependencies: fs, path, db.js
------------------------------------------------
*/

const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initializeDatabase() {
  console.log('Initializing database tables...');
  try {
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Run the schema query string against PostgreSQL
    await db.query(sql);
    console.log('Database tables and indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    process.exit(1);
  }
}

initializeDatabase();
