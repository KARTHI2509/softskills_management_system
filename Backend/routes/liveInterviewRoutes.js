/*
------------------------------------------------
File: liveInterviewRoutes.js
Purpose: Express routes for live WebRTC 1-on-1 mock interviews.
Dependencies: express, authMiddleware, liveInterviewController
------------------------------------------------
*/

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const liveInterviewController = require('../controllers/liveInterviewController');

// All routes require authentication
router.use(auth.verifyToken);

// Schedule & Sessions
router.post('/schedule', liveInterviewController.scheduleSession);
router.get('/sessions', liveInterviewController.getSessions);
router.get('/session/:sessionId', liveInterviewController.getSessionDetails);
router.put('/status/:sessionId', liveInterviewController.updateSessionStatus);
router.post('/evaluate/:sessionId', liveInterviewController.submitEvaluation);

// WebRTC Signaling
router.post('/signal/send', liveInterviewController.sendSignal);
router.get('/signal/poll/:sessionId', liveInterviewController.pollSignals);

module.exports = router;
