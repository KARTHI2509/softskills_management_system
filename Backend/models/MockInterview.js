/*
------------------------------------------------
File: MockInterview.js
Purpose: Manages mock interview records queries.
Responsibilities: Logs submissions, evaluations, and AI parsed response JSON packages.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Logs a student mock interview request or video upload.
  */
  createInterview: async (studentId, recordingUrl) => {
    const res = await db.query(
      `INSERT INTO mock_interviews (student_id, recording_url, status)
       VALUES ($1, $2, 'PENDING')
       RETURNING *`,
      [studentId, recordingUrl]
    );
    return res.rows[0];
  },

  /*
  Submits faculty and AI feedback and score.
  */
  submitEvaluation: async (interviewId, score, feedback, aiFeedback) => {
    const res = await db.query(
      `UPDATE mock_interviews
       SET score = $1, feedback = $2, ai_feedback = $3, status = 'COMPLETED'
       WHERE interview_id = $4
       RETURNING *`,
      [score, feedback, JSON.stringify(aiFeedback), interviewId]
    );
    return res.rows[0];
  },

  /*
  Fetches full interview history list for a student.
  */
  findByStudentId: async (studentId) => {
    const res = await db.query(
      'SELECT * FROM mock_interviews WHERE student_id = $1 ORDER BY date DESC',
      [studentId]
    );
    return res.rows;
  }
};
