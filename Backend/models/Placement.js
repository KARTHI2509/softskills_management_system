/*
------------------------------------------------
File: Placement.js
Purpose: Handles placement analytical queries.
Responsibilities: Filters eligible candidate criteria, department metrics comparisons.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Fetches students with CGPA and Placement Scores exceeding bounds.
  Params: minCgpa (number), minScore (number).
  Returns: Array of eligible students.
  */
  getEligibleStudents: async (minCgpa = 7.0, minScore = 60) => {
    const res = await db.query(
      `SELECT u.name, u.email, u.department, s.roll_no, s.cgpa, s.placement_score
       FROM users u
       JOIN students s ON u.user_id = s.student_id
       WHERE s.cgpa >= $1 AND s.placement_score >= $2
       ORDER BY s.placement_score DESC`,
      [minCgpa, minScore]
    );
    return res.rows;
  },

  /*
  Computes average placement score, average CGPA, and count per department.
  Returns: Analytical rows grouping stats by department.
  */
  getDepartmentComparison: async () => {
    const res = await db.query(
      `SELECT u.department, 
              COUNT(s.student_id) as student_count,
              ROUND(AVG(s.cgpa), 2) as avg_cgpa,
              ROUND(AVG(s.placement_score), 2) as avg_placement_score
       FROM users u
       JOIN students s ON u.user_id = s.student_id
       GROUP BY u.department`
    );
    return res.rows;
  }
};
