/*
------------------------------------------------
File: Attendance.js
Purpose: Manages attendance records database queries.
Responsibilities: Logs student attendance, retrieves records.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Records attendance status for a student.
  */
  logAttendance: async (studentId, date, status) => {
    const res = await db.query(
      `INSERT INTO attendance (student_id, date, status)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, date) DO UPDATE SET status = EXCLUDED.status
       RETURNING *`,
      [studentId, date, status]
    );
    return res.rows[0];
  },

  /*
  Retrieves logs matching student parameters.
  */
  findByStudentId: async (studentId) => {
    const res = await db.query(
      'SELECT * FROM attendance WHERE student_id = $1 ORDER BY date DESC',
      [studentId]
    );
    return res.rows;
  }
};
