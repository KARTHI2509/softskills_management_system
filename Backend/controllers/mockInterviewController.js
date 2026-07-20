/*
------------------------------------------------
File: mockInterviewController.js
Purpose: Manages mock interviews, video submissions, and feedback hooks.
Responsibilities: Logs videos, triggers AI evaluations via Gemini/OpenAI wrapper services.
Dependencies: MockInterview, aiService, storageService
------------------------------------------------
*/

const MockInterview = require('../models/MockInterview');
const aiService = require('../services/aiService');
const storageService = require('../services/storageService');

module.exports = {
  /*
  GET /api/mock-interview/questions
  Fetches question banks matching categories.
  */
  getQuestions: async (req, res, next) => {
    try {
      return res.status(200).json({
        success: true,
        questions: [
          { id: 'q-1', text: 'Tell me about yourself and your background.', category: 'HR' },
          { id: 'q-2', text: 'Describe a situation where you had to work with a difficult team member.', category: 'Behavioral' }
        ]
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/mock-interview/upload-recording
  Saves local recording file paths and uploads resources to Cloudinary.
  */
  uploadRecording: async (req, res, next) => {
    try {
      // Multer binds files to req.file
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No video recording file supplied' });
      }

      // Simulated local upload path
      const filePath = req.file.path;
      console.log(`Video upload requested: ${filePath}`);
      
      // Upload file to cloud storage (Cloudinary wrapper)
      const cloudRes = await storageService.uploadFile(filePath, 'mock-interviews');
      
      // Log mock interview database record
      const record = await MockInterview.createInterview(req.user.user_id, cloudRes.url);

      return res.status(201).json({
        success: true,
        message: 'Recording uploaded successfully',
        interview: record
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/mock-interview/ai-evaluate
  Initiates AI parsing evaluation routines.
  */
  requestAIEvaluation: async (req, res, next) => {
    try {
      const { interviewId, responseText, questionText } = req.body;
      
      const aiFeedback = await aiService.evaluateInterviewResponse(questionText, responseText);
      await MockInterview.submitEvaluation(interviewId, aiFeedback.score, 'AI Automated Evaluation', aiFeedback);

      return res.status(200).json({
        success: true,
        feedback: aiFeedback
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/mock-interview/history
  Fetches historical mock interviews logged by the student.
  */
  getHistory: async (req, res, next) => {
    try {
      const history = await MockInterview.findByStudentId(req.user.user_id);
      return res.status(200).json({
        success: true,
        history
      });
    } catch (error) {
      return next(error);
    }
  }
};
