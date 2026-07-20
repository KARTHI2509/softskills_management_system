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

async function runSeeder() {
  console.log('Seeding process started...');
  try {
    // 1. Verify connection
    await db.query('SELECT NOW()');
    console.log('Database connected successfully.');

    // 2. Clear old data in order of dependency
    console.log('Cleaning existing tables...');
    await db.query('DELETE FROM attendance');
    await db.query('DELETE FROM gd_scores');
    await db.query('DELETE FROM group_discussions');
    await db.query('DELETE FROM mock_interviews');
    await db.query('DELETE FROM student_answers');
    await db.query('DELETE FROM questions');
    await db.query('DELETE FROM resumes');
    await db.query('DELETE FROM notifications');
    await db.query('DELETE FROM activities');
    await db.query('DELETE FROM students');
    await db.query('DELETE FROM faculties');
    await db.query('DELETE FROM users');

    // 3. Hash default password
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password123', salt);

    // 4. Insert Admin Account
    const adminRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
      ['Global Administrator', 'admin@college.edu', defaultPasswordHash, 'ADMIN', 'CSE']
    );
    console.log('Admin seeded:', adminRes.rows[0].user_id);

    // 5. Insert Placement Officer Account
    const placementRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
      ['Placement Officer Ramesh', 'placement@college.edu', defaultPasswordHash, 'PLACEMENT_OFFICER', 'TPO']
    );
    console.log('Placement Officer seeded:', placementRes.rows[0].user_id);

    // 6. Insert Faculty Account (Professor Srinivas)
    const facultyUserRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
      ['Trainer Srinivas', 'faculty@college.edu', defaultPasswordHash, 'FACULTY', 'CSE']
    );
    const facultyId = facultyUserRes.rows[0].user_id;
    await db.query(
      `INSERT INTO faculties (faculty_id, specialization) VALUES ($1, $2)`,
      [facultyId, 'Mock Interview HR & Communication Coach']
    );
    console.log('Faculty seeded successfully:', facultyId);

    // 7. Insert Student Account (Krishna)
    const studentUserRes = await db.query(
      `INSERT INTO users (name, email, password_hash, role, department) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING user_id`,
      ['Krishna', 'student@college.edu', defaultPasswordHash, 'STUDENT', 'CSE']
    );
    const studentId = studentUserRes.rows[0].user_id;
    await db.query(
      `INSERT INTO students (student_id, roll_no, year, cgpa, placement_score) 
       VALUES ($1, $2, $3, $4, $5)`,
      [studentId, '23601A5327', 4, 8.25, 81]
    );
    console.log('Student details seeded successfully:', studentId);

    // 8. Seed Attendance (PRESENT on past dates to yield 100%)
    const attendanceDates = ['2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19'];
    for (const date of attendanceDates) {
      await db.query(
        `INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, 'PRESENT')`,
        [studentId, date]
      );
    }
    console.log('Attendance seeded successfully.');

    // 9. Seed Activities
    const now = new Date();
    const addDays = (d, days) => {
      const copy = new Date(d);
      copy.setDate(copy.getDate() + days);
      return copy;
    };

    await db.query(
      `INSERT INTO activities (title, description, due_date, assigned_by, category)
       VALUES ($1, $2, $3, $4, $5)`,
      ['Elevator Pitch Video Upload', 'Communication Skill', addDays(now, 2), facultyId, 'COMMUNICATION']
    );

    await db.query(
      `INSERT INTO activities (title, description, due_date, assigned_by, category)
       VALUES ($1, $2, $3, $4, $5)`,
      ['Quantitative Test - Ratios', 'Aptitude | 20 Questions', addDays(now, 4), facultyId, 'APTITUDE']
    );

    await db.query(
      `INSERT INTO activities (title, description, due_date, assigned_by, category)
       VALUES ($1, $2, $3, $4, $5)`,
      ['Mock Interview - Technical', 'Software Engineering Role', addDays(now, 7), facultyId, 'MOCK_INTERVIEW']
    );
    console.log('Upcoming activities seeded successfully.');

    // 10. Seed Mock Interview Feedback (Trainer Srinivas, Mock HR Review)
    const interviewFeedbackText = 'Krishna showed strong technical content during the Mock HR Interview. Focus slightly on maintaining eye contact and refining sentences structuring during stress questions.';
    await db.query(
      `INSERT INTO mock_interviews (student_id, score, feedback, ai_feedback, status, date)
       VALUES ($1, $2, $3, $4, 'COMPLETED', '2025-05-20T10:00:00.000Z')`,
      [
        studentId, 
        85, 
        interviewFeedbackText, 
        JSON.stringify({ 
          rating: 4.5, 
          trainer_name: 'Trainer Srinivas (Mock Interview HR)',
          reviewed_date: '20 May 2025'
        })
      ]
    );
    console.log('Mock Interview review feedback seeded.');

    // 11. Seed Aptitude Tests (85 score)
    await db.query(
      `INSERT INTO aptitude_tests (student_id, score, total_questions, category, date)
       VALUES ($1, 85, 100, 'Logical Reasoning', '2026-07-14T09:00:00.000Z')`,
      [studentId]
    );
    console.log('Aptitude test scores seeded.');

    // 12. Seed GD Scores (for monthly average GD score: 75)
    const gd = await db.query(
      `INSERT INTO group_discussions (topic, faculty_id, date) 
       VALUES ('Future of AI and Automation', $1, '2026-07-12T14:00:00.000Z') RETURNING gd_id`,
      [facultyId]
    );
    await db.query(
      `INSERT INTO gd_scores (student_id, gd_id, score, feedback)
       VALUES ($1, $2, 75, 'Good posture and domain definitions. Work on pacing.')`,
      [studentId, gd.rows[0].gd_id]
    );

    // 14. Seed Verbal Question for reading passage
    const verbalQuestionId = 'e2b10a30-80de-444a-bdfc-27660ca4cd98';
    await db.query(
      `INSERT INTO questions (question_id, category, question_text, options, correct_answer)
       VALUES ($1, 'VERBAL', $2, NULL, NULL)
       ON CONFLICT (question_id) DO NOTHING`,
      [
        verbalQuestionId,
        "Effective communication depends not only on speaking clearly but also on active listening. When we listen with empathy and understanding, we create a safe space for ideas to flow. Clear intent helps in delivering messages that are decoded accurately, while digesting the information ensures better response and action. This cycle of clarity, empathy, and intent strengthens relationships and builds trust."
      ]
    );
    console.log('Verbal reading passage question seeded.');

    console.log('Database seeding successfully finished.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding critical error:', error);
    process.exit(1);
  }
}

runSeeder();
