/*
------------------------------------------------
File: aptitudeController.js
Purpose: Handles aptitude categories quizzes.
Responsibilities: Exposes timed test question banks, saves results, and resolves leaderboards.
Dependencies: Aptitude, Student
------------------------------------------------
*/

const Aptitude = require('../models/Aptitude');
const Student = require('../models/Student');

module.exports = {
  /*
  GET /api/aptitude/questions
  Returns list of timed aptitude questions.
  */
  getQuestions: async (req, res, next) => {
    try {
      const category = req.query.category || 'Quantitative';
      return res.status(200).json({
        success: true,
        category,
        questions: [
          { id: 'apt-1', question: 'Find the next term in: 3, 5, 9, 17, 33...', options: ['65', '60', '55', '50'], answer: '65' },
          { id: 'apt-2', question: 'A train 100m long passes a bridge in 10s at 72km/h. Bridge length is...', options: ['100m', '150m', '200m', '250m'], answer: '100m' }
        ]
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/aptitude/submit
  Grades user submission and updates student placement score index.
  */
  submitTest: async (req, res, next) => {
    try {
      const { score, totalQuestions, category } = req.body;
      const record = await Aptitude.submitTestResult(req.user.user_id, score, totalQuestions, category);

      // Compute score adjustments
      const percentage = (score / totalQuestions) * 100;
      const stats = await Student.getDashboardStats(req.user.user_id);
      const newPlacementScore = Math.min(100, Math.round((stats.placementScore + percentage) / 2));
      await Student.updatePlacementScore(req.user.user_id, newPlacementScore);

      return res.status(200).json({
        success: true,
        message: 'Aptitude test score logged',
        record,
        newPlacementScore
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/aptitude/leaderboard
  Returns placement scores rankings.
  */
  getLeaderboard: async (req, res, next) => {
    try {
      const list = await Aptitude.getLeaderboard();
      return res.status(200).json({
        success: true,
        leaderboard: list
      });
    } catch (error) {
      return next(error);
    }
  }
};
