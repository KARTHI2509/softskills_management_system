/*
------------------------------------------------
File: groupDiscussionRoutes.js
Purpose: Maps group discussions actions.
Responsibilities: Exposes routing for GD creation, participant grading, and listing active events.
Dependencies: express, groupDiscussionController, authMiddleware, roleMiddleware
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const groupDiscussionController = require('../controllers/groupDiscussionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

/*
POST /api/group-discussion/create
Creates a new discussion topic.
Only FACULTY or ADMIN can create.
*/
router.post('/create', protect, authorize('FACULTY', 'ADMIN'), groupDiscussionController.createDiscussion);

/*
POST /api/group-discussion/evaluate
Records performance grades.
*/
router.post('/evaluate', protect, authorize('FACULTY', 'ADMIN'), groupDiscussionController.recordScores);

/*
GET /api/group-discussion/list
Retrieves discussion schedules.
*/
router.get('/list', protect, groupDiscussionController.listDiscussions);

module.exports = router;
