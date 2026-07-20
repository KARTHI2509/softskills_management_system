/*
------------------------------------------------
File: communicationController.js
Purpose: Handles reading, vocabulary, and presentation modules exercises.
Responsibilities: Outputs practice question banks, saves text and audio submissions.
Dependencies: None
------------------------------------------------
*/

const Question = require('../models/questionModel');
const Answer = require('../models/answerModel');
const aiService = require('../services/aiService');
const db = require('../config/db');

module.exports = {
  /*
  GET /api/communication/exercises
  Returns soft skills exercises list dynamically from the database.
  */
  getExercises: async (req, res, next) => {
    try {
      const dbQuestions = await Question.getQuestionsByCategory('COMMUNICATION');
      
      const fallbackExercises = [
        { question_id: 'comm-1', question_text: 'Describe a time when you successfully resolved a conflict in a project group.', category: 'COMMUNICATION', options: null },
        { question_id: 'comm-2', question_text: 'How do you prioritize tasks when working on multiple deadlines?', category: 'COMMUNICATION', options: null }
      ];

      const exercises = dbQuestions.length > 0 ? dbQuestions : fallbackExercises;
      
      return res.status(200).json({
        success: true,
        exercises
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/communication/submit
  Saves exercise response answers and checks results using Gemini.
  */
  submitExercise: async (req, res, next) => {
    try {
      const { exerciseId, answerText } = req.body;
      if (!exerciseId || !answerText) {
        return res.status(400).json({ success: false, message: 'exerciseId and answerText are required.' });
      }

      // Query database to retrieve the question text or fallback
      let questionText = 'Communication practice question response.';
      if (exerciseId && exerciseId.length === 36) { // Check if UUID
        const qRes = await db.query('SELECT question_text FROM questions WHERE question_id = $1', [exerciseId]);
        if (qRes.rows[0]) {
          questionText = qRes.rows[0].question_text;
        }
      } else {
        if (exerciseId === 'comm-1') {
          questionText = 'Describe a time when you successfully resolved a conflict in a project group.';
        } else if (exerciseId === 'comm-2') {
          questionText = 'How do you prioritize tasks when working on multiple deadlines?';
        }
      }

      // Evaluate response using Gemini in aiService
      const evalResult = await aiService.evaluateSubjectiveAnswer(questionText, answerText);

      // Save answer details to database if it's a valid UUID question
      let record = null;
      if (exerciseId && exerciseId.length === 36) {
        record = await Answer.submitAnswer(
          req.user.user_id,
          exerciseId,
          answerText,
          evalResult.score,
          evalResult.feedback
        );
      }

      return res.status(200).json({
        success: true,
        score: evalResult.score,
        feedback: evalResult.feedback,
        record
      });
    } catch (error) {
      return next(error);
    }
  }
};
