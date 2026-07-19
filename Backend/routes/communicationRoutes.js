/*
------------------------------------------------
File: communicationRoutes.js
Purpose: Maps communication modules actions.
Responsibilities: Exposes routes for active verbal/reading exercises list.
Dependencies: express, communicationController, authMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');
const { protect } = require('../middleware/authMiddleware');

/*
GET /api/communication/exercises
Fetches lists.
*/
router.get('/exercises', protect, communicationController.getExercises);

/*
POST /api/communication/submit
Saves student replies.
*/
router.post('/submit', protect, communicationController.submitExercise);

module.exports = router;
