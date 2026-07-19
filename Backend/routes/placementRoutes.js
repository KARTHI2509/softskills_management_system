/*
------------------------------------------------
File: placementRoutes.js
Purpose: Maps placement officers analytics views.
Responsibilities: Exposes routes for eligible candidate shortlists and department comparison charts.
Dependencies: express, placementController, authMiddleware, roleMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/*
GET /api/placement/eligible
Retrieves shortlist files.
Only PLACEMENT_OFFICER or ADMIN roles allowed.
*/
router.get('/eligible', protect, authorize('PLACEMENT_OFFICER', 'ADMIN'), placementController.getEligibleStudents);

/*
GET /api/placement/department-comparison
Aggregates averages per department.
*/
router.get('/department-comparison', protect, authorize('PLACEMENT_OFFICER', 'ADMIN'), placementController.getDepartmentComparison);

/*
GET /api/placement/analytics
Returns summary corporate alignment details.
*/
router.get('/analytics', protect, authorize('PLACEMENT_OFFICER', 'ADMIN'), placementController.getAnalytics);

module.exports = router;
