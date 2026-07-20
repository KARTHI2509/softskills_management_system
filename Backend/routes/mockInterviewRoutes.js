/*
------------------------------------------------
File: mockInterviewRoutes.js
Purpose: Maps mock interview upload processes.
Responsibilities: Configures multer file parsers and maps question requests and AI evaluation requests.
Dependencies: express, multer, mockInterviewController, authMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mockInterviewController = require('../controllers/mockInterviewController');
const { protect } = require('../middleware/authMiddleware');

// Set up temporary local storage parsing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

/*
GET /api/mock-interview/questions
Fetches interview questions.
*/
router.get('/questions', protect, mockInterviewController.getQuestions);

/*
POST /api/mock-interview/upload-recording
Interprets video file inputs, uploads to Cloudinary, and registers a mock interview session.
*/
router.post('/upload-recording', protect, upload.single('video'), mockInterviewController.uploadRecording);

/*
POST /api/mock-interview/ai-evaluate
Resolves audio/video metrics using AI model feedback.
*/
router.post('/ai-evaluate', protect, mockInterviewController.requestAIEvaluation);

/*
GET /api/mock-interview/history
Fetches mock interview session evaluations.
*/
router.get('/history', protect, mockInterviewController.getHistory);

module.exports = router;
