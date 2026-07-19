/*
------------------------------------------------
File: GroupDiscussion.js
Purpose: Manages Group Discussion database queries.
Responsibilities: Logs discussion events, topics list, and registers participant scores.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Creates a group discussion session event.
  */
  createGD: async (topic, facultyId) => {
    const res = await db.query(
      `INSERT INTO group_discussions (topic, faculty_id) VALUES ($1, $2) RETURNING *`,
      [topic, facultyId]
    );
    return res.rows[0];
  },

  /*
  Saves a student score for a discussion.
  */
  scoreParticipant: async (studentId, gdId, score, feedback) => {
    const res = await db.query(
      `INSERT INTO gd_scores (student_id, gd_id, score, feedback)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, gd_id) 
       DO UPDATE SET score = EXCLUDED.score, feedback = EXCLUDED.feedback
       RETURNING *`,
      [studentId, gdId, score, feedback]
    );
    return res.rows[0];
  },

  /*
  Lists discussions.
  */
  findAll: async () => {
    const res = await db.query(
      `SELECT gd.gd_id, gd.topic, gd.date, u.name as evaluator
       FROM group_discussions gd
       LEFT JOIN users u ON gd.faculty_id = u.user_id
       ORDER BY gd.date DESC`
    );
    return res.rows;
  }
};
