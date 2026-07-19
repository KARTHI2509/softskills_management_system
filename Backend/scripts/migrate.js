/*
------------------------------------------------
File: migrate.js
Purpose: Runs incremental database migrations.
Responsibilities: Creates the questions and student_answers tables.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

const migrationSql = `
-- Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Student Answers Table
CREATE TABLE IF NOT EXISTS student_answers (
    answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    submitted_answer TEXT NOT NULL,
    score INT CHECK (score BETWEEN 0 AND 100),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_question_answer UNIQUE (student_id, question_id)
);
`;

async function runMigration() {
  console.log('Running database migrations...');
  try {
    await db.query(migrationSql);
    console.log('Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
