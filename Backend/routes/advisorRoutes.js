/*
------------------------------------------------
File: advisorRoutes.js
Purpose: Maps AI Career Advisor prompt actions.
Responsibilities: Exposes endpoints for career guidance prompting.
Dependencies: express, careerAdvisorController, authMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const careerAdvisorController = require('../controllers/careerAdvisorController');
const { protect } = require('../middleware/authMiddleware');

/*
POST /api/advisor/ask
Answers student career questions.
*/
router.post('/ask', protect, careerAdvisorController.askAdvisor);

module.exports = router;
