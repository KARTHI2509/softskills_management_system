/*
------------------------------------------------
File: seed.js
Purpose: Database seeder script for local testing.
Responsibilities: Populates initial mock questions, administrative roles, faculty, and test students.
Dependencies: pg, bcryptjs, dotenv, db.js
------------------------------------------------
*/

const bcrypt = require('bcryptjs');
const db = require('../config/db');

/*
Main seeder execution function.
Cleans tables and adds starter rows.
*/
async function runSeeder() {
  console.log('Seeding process started...');
  try {
    // 1. Create Tables (Simulated fallback if not run via command line)
    // For seeder safety in local testing, we can check database connectivity
    await db.query('SELECT NOW()');
    console.log('Database connected successfully.');

    // 2. Hash default passwords
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password123', salt);

    // 3. Insert Admin Account
    const adminRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash 
       RETURNING user_id`,
      ['Global Administrator', 'admin@college.edu', defaultPasswordHash, 'ADMIN', 'CSE']
    );
    console.log('Admin seeded:', adminRes.rows[0]?.user_id || 'Existing');

    // 4. Insert Placement Officer Account
    const placementRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash 
       RETURNING user_id`,
      ['Placement Officer Ramesh', 'placement@college.edu', defaultPasswordHash, 'PLACEMENT_OFFICER', 'TPO']
    );
    console.log('Placement Officer seeded:', placementRes.rows[0]?.user_id || 'Existing');

    // 5. Insert Faculty Account
    const facultyUserRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash 
       RETURNING user_id`,
      ['Professor Srinivas', 'faculty@college.edu', defaultPasswordHash, 'FACULTY', 'CSE']
    );
    const facultyId = facultyUserRes.rows[0]?.user_id;
    if (facultyId) {
      await db.query(
        `INSERT INTO faculties (faculty_id, specialization) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [facultyId, 'Communication Skills & Aptitude Coaching']
      );
      console.log('Faculty seeded successfully');
    }

    // 6. Insert Student Account
    const studentUserRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash 
       RETURNING user_id`,
      ['Krishna Kumar', 'student@college.edu', defaultPasswordHash, 'STUDENT', 'CSE']
    );
    const studentId = studentUserRes.rows[0]?.user_id;
    if (studentId) {
      await db.query(
        `INSERT INTO students (student_id, roll_no, year, cgpa, placement_score) 
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
        [studentId, '2026CSE042', 4, 8.25, 82]
      );
      console.log('Student details seeded successfully');
    }

    console.log('Database seeding successfully finished.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding critical error:', error);
    process.exit(1);
  }
}

runSeeder();
