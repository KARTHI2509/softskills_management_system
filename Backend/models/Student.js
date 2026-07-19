/*
------------------------------------------------
File: Student.js
Purpose: Manages student profile metrics database queries.
Responsibilities: Student dashboard summaries, attendance rates, scoring, and registration details.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Creates student details link record.
  */
  createStudent: async (studentId, rollNo, year, cgpa) => {
    const res = await db.query(
      `INSERT INTO students (student_id, roll_no, year, cgpa, placement_score)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING *`,
      [studentId, rollNo, year, cgpa]
    );
    return res.rows[0];
  },

  /*
  Fetches full student dashboard credentials and metrics details.
  */
  getDashboardStats: async (studentId) => {
    const profileRes = await db.query(
      `SELECT u.name, u.email, u.department, s.roll_no, s.year, s.cgpa, s.placement_score
       FROM users u
       JOIN students s ON u.user_id = s.student_id
       WHERE u.user_id = $1`,
      [studentId]
    );

    const attendanceRes = await db.query(
      `SELECT 
         COUNT(*) as total, 
         SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present
       FROM attendance WHERE student_id = $1`,
      [studentId]
    );

    const attendRow = attendanceRes.rows[0];
    const total = parseInt(attendRow.total) || 0;
    const present = parseInt(attendRow.present) || 0;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : '100.0';

    return {
      profile: profileRes.rows[0] || null,
      placementScore: profileRes.rows[0]?.placement_score || 0,
      attendance: parseFloat(attendancePercentage)
    };
  },

  /*
  Updates placement scoring of student.
  */
  updatePlacementScore: async (studentId, score) => {
    await db.query(
      'UPDATE students SET placement_score = $1 WHERE student_id = $2',
      [score, studentId]
    );
  }
};
