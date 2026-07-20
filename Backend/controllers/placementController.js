/*
------------------------------------------------
File: placementController.js
Purpose: Manages placement officers' dashboard and statistics queries.
Responsibilities: Pulls eligible student lists, aggregates metrics by department.
Dependencies: Placement
------------------------------------------------
*/

const Placement = require('../models/Placement');

module.exports = {
  /*
  GET /api/placement/eligible
  Returns a list of students exceeding CGPA and placement score parameters.
  */
  getEligibleStudents: async (req, res, next) => {
    try {
      const minCgpa = parseFloat(req.query.minCgpa) || 7.0;
      const minScore = parseInt(req.query.minScore) || 60;
      
      const list = await Placement.getEligibleStudents(minCgpa, minScore);
      return res.status(200).json({
        success: true,
        count: list.length,
        students: list
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/placement/department-comparison
  Averages metrics grouped by engineering department.
  */
  getDepartmentComparison: async (req, res, next) => {
    try {
      const metrics = await Placement.getDepartmentComparison();
      return res.status(200).json({
        success: true,
        comparison: metrics
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/placement/analytics
  Returns summary stats for corporate preparation readiness.
  */
  getAnalytics: async (req, res, next) => {
    try {
      const db = require('../config/db');
      
      const totalRes = await db.query('SELECT COUNT(*)::int as total FROM students');
      const readyRes = await db.query('SELECT COUNT(*)::int as ready FROM students WHERE placement_score >= 80');
      const needsRes = await db.query('SELECT COUNT(*)::int as needs FROM students WHERE placement_score < 80');
      
      const topDeptRes = await db.query(
        `SELECT u.department, AVG(s.placement_score) as avg_score
         FROM users u
         JOIN students s ON u.user_id = s.student_id
         GROUP BY u.department
         ORDER BY avg_score DESC
         LIMIT 1`
      );

      const totalRegistered = totalRes.rows[0]?.total || 0;
      const placementReady = readyRes.rows[0]?.ready || 0;
      const needsTraining = needsRes.rows[0]?.needs || 0;
      const topDepartment = topDeptRes.rows[0]?.department || 'CSE';

      return res.status(200).json({
        success: true,
        summary: {
          totalRegistered,
          placementReady,
          needsTraining,
          topDepartment,
          upcomingVisits: [
            { company: 'Google', date: '2026-08-15' },
            { company: 'Microsoft', date: '2026-09-01' }
          ]
        }
      });
    } catch (error) {
      return next(error);
    }
  }
};
