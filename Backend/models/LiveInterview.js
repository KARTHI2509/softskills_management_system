/*
------------------------------------------------
File: LiveInterview.js
Purpose: Database model for live 1-on-1 WebRTC mock interview sessions.
Responsibilities: Manages scheduled slots, live evaluations, and WebRTC signal exchanges.
Dependencies: ../config/db
------------------------------------------------
*/

const db = require('../config/db');

class LiveInterview {
  static async createSession({ facultyId, studentId, title, category, scheduledAt }) {
    const query = `
      INSERT INTO live_interview_sessions 
        (faculty_id, student_id, title, category, scheduled_at, status)
      VALUES ($1, $2, $3, $4, $5, 'SCHEDULED')
      RETURNING *
    `;
    const result = await db.query(query, [
      facultyId, 
      studentId, 
      title || 'Live 1-on-1 Mock Interview', 
      category || 'General', 
      scheduledAt
    ]);
    return result.rows[0];
  }

  static async getSessionById(sessionId) {
    const query = `
      SELECT 
        s.*,
        f.name as faculty_name, f.email as faculty_email,
        u.name as student_name, u.email as student_email
      FROM live_interview_sessions s
      JOIN users f ON s.faculty_id = f.user_id
      JOIN users u ON s.student_id = u.user_id
      WHERE s.session_id = $1
    `;
    const result = await db.query(query, [sessionId]);
    return result.rows[0];
  }

  static async getStudentSessions(studentId) {
    const query = `
      SELECT 
        s.*,
        f.name as faculty_name, f.department as faculty_department
      FROM live_interview_sessions s
      JOIN users f ON s.faculty_id = f.user_id
      WHERE s.student_id = $1
      ORDER BY s.scheduled_at ASC
    `;
    const result = await db.query(query, [studentId]);
    return result.rows;
  }

  static async getFacultySessions(facultyId) {
    const query = `
      SELECT 
        s.*,
        u.name as student_name, u.email as student_email
      FROM live_interview_sessions s
      JOIN users u ON s.student_id = u.user_id
      WHERE s.faculty_id = $1
      ORDER BY s.scheduled_at ASC
    `;
    const result = await db.query(query, [facultyId]);
    return result.rows;
  }

  static async updateStatus(sessionId, status) {
    const query = `
      UPDATE live_interview_sessions
      SET status = $1
      WHERE session_id = $2
      RETURNING *
    `;
    const result = await db.query(query, [status, sessionId]);
    return result.rows[0];
  }

  static async submitEvaluation(sessionId, { commScore, techScore, confScore, feedback }) {
    const comm = parseInt(commScore || 0);
    const tech = parseInt(techScore || 0);
    const conf = parseInt(confScore || 0);
    const overall = Math.round((comm + tech + conf) / 3);

    const query = `
      UPDATE live_interview_sessions
      SET 
        communication_score = $1,
        technical_score = $2,
        confidence_score = $3,
        overall_score = $4,
        faculty_feedback = $5,
        status = 'COMPLETED'
      WHERE session_id = $6
      RETURNING *
    `;
    const result = await db.query(query, [comm, tech, conf, overall, feedback, sessionId]);
    return result.rows[0];
  }

  // WebRTC Signal Exchange
  static async saveSignal({ sessionId, senderId, receiverId, signalType, payload }) {
    const query = `
      INSERT INTO webrtc_signals (session_id, sender_id, receiver_id, signal_type, payload)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [sessionId, senderId, receiverId, signalType, payload]);
    return result.rows[0];
  }

  static async fetchAndClearSignals({ sessionId, receiverId }) {
    const selectQuery = `
      SELECT * FROM webrtc_signals
      WHERE session_id = $1 AND receiver_id = $2
      ORDER BY created_at ASC
    `;
    const result = await db.query(selectQuery, [sessionId, receiverId]);
    const signals = result.rows;

    if (signals.length > 0) {
      const deleteQuery = `
        DELETE FROM webrtc_signals
        WHERE session_id = $1 AND receiver_id = $2
      `;
      await db.query(deleteQuery, [sessionId, receiverId]);
    }

    return signals;
  }
}

module.exports = LiveInterview;
