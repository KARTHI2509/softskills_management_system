/*
------------------------------------------------
File: reportRoutes.js
Purpose: Maps reports compiles.
Responsibilities: Exposes weekly, monthly, and department analytics routes.
Dependencies: express, reportController, authMiddleware, roleMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/*
GET /api/reports/weekly
Pulls weekly feedback stats for student.
*/
router.get('/weekly', protect, authorize('STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN'), reportController.getWeeklyReport);

/*
GET /api/reports/monthly
Pulls monthly analytics indices.
*/
router.get('/monthly', protect, authorize('STUDENT', 'FACULTY', 'PLACEMENT_OFFICER', 'ADMIN'), reportController.getMonthlyReport);

/*
GET /api/reports/department
Averages department records (Faculty/Placement/Admin only).
*/
router.get('/department', protect, authorize('FACULTY', 'PLACEMENT_OFFICER', 'ADMIN'), reportController.getDepartmentReport);

module.exports = router;
