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
      return res.status(200).json({
        success: true,
        summary: {
          totalRegistered: 120,
          placementReady: 85,
          needsTraining: 35,
          topDepartment: 'CSE',
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
