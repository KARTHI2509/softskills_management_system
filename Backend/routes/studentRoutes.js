/*
------------------------------------------------
File: studentRoutes.js
Purpose: Maps student metrics endpoints.
Responsibilities: Exposes dashboard, attendance, and progress analytics routes.
Dependencies: express, studentController, authMiddleware, roleMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/*
GET /api/student/dashboard
Returns cumulative scores, attendances, and events maps.
Only roles STUDENT, FACULTY, PLACEMENT_OFFICER, or ADMIN allowed.
*/
router.get('/dashboard', protect, authorize('STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN'), studentController.getDashboardStats);

/*
GET /api/student/progress-graphs
Returns weekly/monthly graphs dataset parameters.
*/
router.get('/progress-graphs', protect, authorize('STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN'), studentController.getProgressGraphs);

/*
GET /api/student/attendance
Returns historical logs.
*/
router.get('/attendance', protect, authorize('STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN'), studentController.getAttendance);

module.exports = router;
