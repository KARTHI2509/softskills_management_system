/*
------------------------------------------------
File: studentController.js
Purpose: Manages student profile requests.
Responsibilities: Fetches student dashboards, attendance details, and progress scopes.
Dependencies: Student, Attendance
------------------------------------------------
*/

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

module.exports = {
  /*
  GET /api/student/dashboard
  Returns placement scores, attendance aggregates, upcoming modules.
  */
  getDashboardStats: async (req, res, next) => {
    try {
      const stats = await Student.getDashboardStats(req.user.user_id);
      return res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/student/progress-graphs
  Returns mock weekly/monthly development graphs arrays.
  */
  getProgressGraphs: async (req, res, next) => {
    try {
      return res.status(200).json({
        success: true,
        graphs: {
          weekly: [65, 70, 72, 80, 82],
          monthly: [50, 62, 70, 75, 82],
          categories: ['Communication', 'Aptitude', 'Group Discussion', 'Mock Interviews']
        }
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/student/attendance
  Returns historical student attendance logs.
  */
  getAttendance: async (req, res, next) => {
    try {
      const logs = await Attendance.findByStudentId(req.user.user_id);
      return res.status(200).json({
        success: true,
        attendance: logs
      });
    } catch (error) {
      return next(error);
    }
  }
};
