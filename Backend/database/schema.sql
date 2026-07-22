-- ------------------------------------------------
-- File: schema.sql
-- Purpose: Defines PostgreSQL database tables and relationships.
-- Responsibilities: Creates schemas for users, students, activities, mock interviews,
--                  GD scores, aptitude tests, resumes, attendance, and notifications.
-- Dependencies: PostgreSQL 12+
-- ------------------------------------------------

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) DEFAULT '+91 98765 43210',
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN')),
    department VARCHAR(100) NOT NULL,
    otp_code VARCHAR(10),
    otp_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for User credentials check
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    year INT NOT NULL CHECK (year BETWEEN 1 AND 4),
    cgpa NUMERIC(4,2) NOT NULL CHECK (cgpa BETWEEN 0.00 AND 10.00),
    placement_score INT DEFAULT 0 CHECK (placement_score BETWEEN 0 AND 100)
);

-- Index for Student score tracking
CREATE INDEX IF NOT EXISTS idx_students_placement_score ON students(placement_score DESC);

-- 3. Faculties Table
CREATE TABLE IF NOT EXISTS faculties (
    faculty_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    specialization VARCHAR(150)
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_by UUID REFERENCES faculties(faculty_id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('COMMUNICATION', 'MOCK_INTERVIEW', 'GD', 'APTITUDE'))
);

-- 5. Mock Interviews Table
CREATE TABLE IF NOT EXISTS mock_interviews (
    interview_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    score INT CHECK (score BETWEEN 0 AND 100),
    feedback TEXT,
    ai_feedback JSONB,
    recording_url VARCHAR(512),
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED')),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for Mock Interview tracking
CREATE INDEX IF NOT EXISTS idx_mock_interviews_student ON mock_interviews(student_id);

-- 6. Group Discussions Table
CREATE TABLE IF NOT EXISTS group_discussions (
    gd_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic VARCHAR(255) NOT NULL,
    faculty_id UUID REFERENCES faculties(faculty_id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. GD Scores Table
CREATE TABLE IF NOT EXISTS gd_scores (
    score_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    gd_id UUID NOT NULL REFERENCES group_discussions(gd_id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
    feedback TEXT,
    CONSTRAINT unique_student_gd UNIQUE (student_id, gd_id)
);

-- 8. Aptitude Tests Table
CREATE TABLE IF NOT EXISTS aptitude_tests (
    test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    resume_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    file_url VARCHAR(512) NOT NULL,
    ats_score INT CHECK (ats_score BETWEEN 0 AND 100),
    ai_suggestions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT')),
    CONSTRAINT unique_student_attendance_date UNIQUE (student_id, date)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for User Notifications loading
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);

-- 12. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Student Answers Table
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

-- 14. Forum Posts Table
CREATE TABLE IF NOT EXISTS forum_posts (
    post_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES users(user_id) ON DELETE CASCADE,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Forum Comments Table
CREATE TABLE IF NOT EXISTS forum_comments (
    comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_by UUID REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    certificate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    verification_hash VARCHAR(255) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Coding Challenges Table
CREATE TABLE IF NOT EXISTS coding_challenges (
    challenge_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(30) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    test_cases JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 19. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark',
    accent_color VARCHAR(25) DEFAULT 'purple',
    font_size VARCHAR(25) DEFAULT 'medium',
    email_grade BOOLEAN DEFAULT true,
    weekly_summary BOOLEAN DEFAULT true,
    new_messages BOOLEAN DEFAULT true,
    upcoming_deadlines BOOLEAN DEFAULT true,
    marketing BOOLEAN DEFAULT false,
    notification_channel VARCHAR(25) DEFAULT 'email'
);


