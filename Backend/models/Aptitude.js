/*
------------------------------------------------
File: Aptitude.js
Purpose: Manages aptitude assessment logs.
Responsibilities: Commits scores, fetches user test logs, and builds placement readiness leaderboards.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Records a completed aptitude test scorecard.
  */
  submitTestResult: async (studentId, score, totalQuestions, category) => {
    const res = await db.query(
      `INSERT INTO aptitude_tests (student_id, score, total_questions, category)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [studentId, score, totalQuestions, category]
    );
    return res.rows[0];
  },

  /*
  Compiles student leaderboards sorted by placement scores.
  */
  getLeaderboard: async () => {
    const res = await db.query(
      `SELECT u.name, u.department, s.roll_no, s.placement_score
       FROM users u
       JOIN students s ON u.user_id = s.student_id
       ORDER BY s.placement_score DESC, s.cgpa DESC
       LIMIT 50`
    );
    return res.rows;
  }
};
