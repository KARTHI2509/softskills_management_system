/*
------------------------------------------------
File: facultyRoutes.js
Purpose: Maps faculty-specific evaluations and activity management endpoints.
Responsibilities: Exposes routes for student scoring, activity creation, and grading queues.
Dependencies: express, facultyController, authMiddleware, roleMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/*
POST /api/faculty/evaluation
Saves grades and updates student readiness indexes.
Only FACULTY or ADMIN can access.
*/
router.post('/evaluation', protect, authorize('FACULTY', 'ADMIN'), facultyController.evaluateStudent);

/*
POST /api/faculty/activities
Assigns practice modules.
*/
router.post('/activities', protect, authorize('FACULTY', 'ADMIN'), facultyController.assignActivity);

/*
GET /api/faculty/pending-evaluations
Lists student files pending evaluation.
*/
router.get('/pending-evaluations', protect, authorize('FACULTY', 'ADMIN'), facultyController.listPendingEvaluations);

module.exports = router;
