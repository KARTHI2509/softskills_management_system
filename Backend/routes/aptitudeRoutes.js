/*
------------------------------------------------
File: aptitudeRoutes.js
Purpose: Maps aptitude assessment triggers.
Responsibilities: Exposes routes for questions retrieval, answers sheet submissions, and leaderboards.
Dependencies: express, aptitudeController, authMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const aptitudeController = require('../controllers/aptitudeController');
const { protect } = require('../middleware/authMiddleware');

/*
GET /api/aptitude/questions
Returns quiz questions matching category.
*/
router.get('/questions', protect, aptitudeController.getQuestions);

/*
POST /api/aptitude/submit
Validates responses, saves scores, updates placement indices.
*/
router.post('/submit', protect, aptitudeController.submitTest);

/*
GET /api/aptitude/leaderboard
Returns top placement score performers.
*/
router.get('/leaderboard', protect, aptitudeController.getLeaderboard);

module.exports = router;
