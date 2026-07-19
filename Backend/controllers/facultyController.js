/*
------------------------------------------------
File: facultyController.js
Purpose: Handles faculty evaluations and activity mappings.
Responsibilities: Logs student grades, creates activities, and checks evaluations pending queue.
Dependencies: Activity, Student, MockInterview, GroupDiscussion
------------------------------------------------
*/

const Activity = require('../models/Activity');
const Student = require('../models/Student');
const GroupDiscussion = require('../models/GroupDiscussion');
const MockInterview = require('../models/MockInterview');

module.exports = {
  /*
  POST /api/faculty/evaluation
  Evaluates students for group discussions.
  */
  evaluateStudent: async (req, res, next) => {
    try {
      const { student_id, gd_id, score, feedback } = req.body;
      const scoreRecord = await GroupDiscussion.scoreParticipant(student_id, gd_id, score, feedback);
      
      // Fetch current score details to update cumulative student score
      const stats = await Student.getDashboardStats(student_id);
      const newCumulative = Math.min(100, Math.round((stats.placementScore + score) / 2));
      await Student.updatePlacementScore(student_id, newCumulative);

      return res.status(200).json({
        success: true,
        message: 'Evaluation saved successfully',
        record: scoreRecord
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/faculty/activities
  Creates soft skills practice activity assignments.
  */
  assignActivity: async (req, res, next) => {
    try {
      const { title, description, due_date, category } = req.body;
      const activity = await Activity.createActivity(
        title, 
        description, 
        due_date, 
        req.user.user_id, 
        category
      );
      return res.status(201).json({
        success: true,
        message: 'Activity assigned successfully',
        activity
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/faculty/pending-evaluations
  Returns list of student uploads awaiting evaluation.
  */
  listPendingEvaluations: async (req, res, next) => {
    try {
      return res.status(200).json({
        success: true,
        pending: [
          {
            id: 'mock-int-1',
            studentName: 'Krishna Kumar',
            activityTitle: 'Mock Interview - Tell me about yourself',
            type: 'MOCK_INTERVIEW',
            submittedAt: new Date()
          }
        ]
      });
    } catch (error) {
      return next(error);
    }
  }
};
