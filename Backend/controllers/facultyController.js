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
const Question = require('../models/questionModel');
const Answer = require('../models/answerModel');

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
  },

  /*
  POST /api/faculty/questions/import
  Processes bulk copy-paste questions or CSV strings uploaded by faculty.
  */
  importQuestions: async (req, res, next) => {
    try {
      const { csvText, listType } = req.body;
      if (!csvText) {
        return res.status(400).json({ success: false, message: 'No questions content supplied.' });
      }

      let questionsToInsert = [];

      if (listType === 'json') {
        const parsed = JSON.parse(csvText);
        questionsToInsert = parsed.map(q => ({
          category: q.category || 'GENERAL',
          question_text: q.question_text || q.text,
          options: q.options || null,
          correct_answer: q.correct_answer || q.answer || null,
          created_by: req.user.user_id
        }));
      } else {
        // Parse CSV format text
        const lines = csvText.split('\n');
        lines.forEach(line => {
          if (!line.trim()) return;
          const parts = line.split(',');
          if (parts.length >= 2) {
            const category = parts[0].trim().toUpperCase();
            const question_text = parts[1].trim();
            const optionsRaw = parts[2] ? parts[2].trim() : '';
            const options = optionsRaw ? optionsRaw.split(';').map(o => o.trim()) : null;
            const correct_answer = parts[3] ? parts[3].trim() : null;
            
            questionsToInsert.push({
              category,
              question_text,
              options,
              correct_answer,
              created_by: req.user.user_id
            });
          }
        });
      }

      if (questionsToInsert.length === 0) {
        return res.status(400).json({ success: false, message: 'Could not parse any valid questions.' });
      }

      const insertedCount = await Question.bulkInsert(questionsToInsert);
      return res.status(201).json({
        success: true,
        message: `Successfully imported ${insertedCount} questions.`,
        count: insertedCount
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/faculty/answers/evaluate
  Evaluates and scores a student written subjective answer.
  */
  evaluateStudentAnswer: async (req, res, next) => {
    try {
      const { answerId, score, feedback } = req.body;
      const updatedAnswer = await Answer.gradeAnswer(answerId, score, feedback);
      return res.status(200).json({
        success: true,
        message: 'Student answer evaluated successfully',
        answer: updatedAnswer
      });
    } catch (error) {
      return next(error);
    }
  }
};
