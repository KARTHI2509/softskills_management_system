/*
------------------------------------------------
File: initDbFull.js
Purpose: Full database tables schema builder.
Responsibilities: Executes all schema migrations sequentially to build a complete database.
Dependencies: fs, path, db.js
------------------------------------------------
*/

const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function initializeDatabase() {
  console.log('[INIT DB] Initializing full database tables schema...');
  try {
    const files = [
      'schema.sql',
      'schema_v2_faculty_tasks.sql',
      'schema_v3_study_tracking.sql'
    ];

    for (const file of files) {
      console.log(`[INIT DB] Executing SQL schema: ${file}...`);
      const schemaPath = path.join(__dirname, '../database', file);
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await db.query(sql);
      console.log(`[INIT DB] Successfully executed: ${file}`);
    }

    console.log('[INIT DB] Full database tables and indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[INIT DB] Failed to initialize database tables:', error);
    process.exit(1);
  }
}

initializeDatabase();
