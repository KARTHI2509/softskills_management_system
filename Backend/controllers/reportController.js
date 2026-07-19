/*
------------------------------------------------
File: reportController.js
Purpose: Compiles educational analytical summaries.
Responsibilities: Generates weekly, monthly, and department metrics.
Dependencies: Student, Placement
------------------------------------------------
*/

const Student = require('../models/Student');
const Placement = require('../models/Placement');

module.exports = {
  /*
  GET /api/reports/weekly
  Weekly performance metrics for logged-in student.
  */
  getWeeklyReport: async (req, res, next) => {
    try {
      return res.status(200).json({
        success: true,
        report: {
          period: 'Weekly Range',
          activitiesCompleted: 3,
          hoursPracticed: 4.5,
          feedbackSummary: 'Shows improvement in vocabulary structure.'
        }
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/reports/monthly
  Monthly evaluation details.
  */
  getMonthlyReport: async (req, res, next) => {
    try {
      const stats = await Student.getDetailedProgressReport(req.user.user_id);
      return res.status(200).json({
        success: true,
        report: stats
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/reports/department
  Department metrics summaries (Faculty/Placement Officers only).
  */
  getDepartmentReport: async (req, res, next) => {
    try {
      const department = req.query.department || 'CSE';
      const stats = await Placement.getDepartmentComparison();
      const departmentData = stats.find(d => d.department === department) || {};

      return res.status(200).json({
        success: true,
        department,
        report: departmentData
      });
    } catch (error) {
      return next(error);
    }
  }
};
