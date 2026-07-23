-- ------------------------------------------------
-- File: schema_v4_live_interview.sql
-- Purpose: Schema migration for 1-on-1 Live Interview Sessions and WebRTC Signaling.
-- ------------------------------------------------

CREATE TABLE IF NOT EXISTS live_interview_sessions (
    session_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    student_id          UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title               VARCHAR(255) DEFAULT 'Live 1-on-1 Mock Interview',
    category            VARCHAR(100) DEFAULT 'General',
    scheduled_at        TIMESTAMP WITH TIME ZONE NOT NULL,
    status              VARCHAR(30) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED')),
    communication_score INT DEFAULT 0,
    technical_score     INT DEFAULT 0,
    confidence_score    INT DEFAULT 0,
    overall_score       INT DEFAULT 0,
    faculty_feedback    TEXT,
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_lis_faculty ON live_interview_sessions(faculty_id);
CREATE INDEX IF NOT EXISTS idx_lis_student ON live_interview_sessions(student_id);

CREATE TABLE IF NOT EXISTS webrtc_signals (
    signal_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id  UUID NOT NULL REFERENCES live_interview_sessions(session_id) ON DELETE CASCADE,
    sender_id   UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    signal_type VARCHAR(50) NOT NULL,
    payload     JSONB NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webrtc_session_receiver ON webrtc_signals(session_id, receiver_id);
