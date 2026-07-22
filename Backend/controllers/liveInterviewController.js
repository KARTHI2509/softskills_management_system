/*
------------------------------------------------
File: liveInterviewController.js
Purpose: API Controller for live 1-on-1 mock interviews, WebRTC signaling, and evaluations.
Dependencies: ../models/LiveInterview, ../models/User
------------------------------------------------
*/

const LiveInterview = require('../models/LiveInterview');

module.exports = {
  /*
  POST /api/live-interview/schedule
  Faculty or Admin schedules a live 1-on-1 interview slot for a student.
  */
  scheduleSession: async (req, res, next) => {
    try {
      const { studentId, facultyId: reqFacultyId, title, category, scheduledAt } = req.body;
      const facultyId = req.user.role === 'FACULTY' ? req.user.user_id : reqFacultyId;

      if (!studentId || !scheduledAt) {
        return res.status(400).json({ success: false, message: 'Student ID and Scheduled Date/Time are required.' });
      }

      const session = await LiveInterview.createSession({
        facultyId,
        studentId,
        title,
        category,
        scheduledAt
      });

      return res.status(201).json({
        success: true,
        message: 'Live interview session scheduled successfully.',
        session
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/live-interview/sessions
  Fetches scheduled and past live interview sessions for current logged-in user.
  */
  getSessions: async (req, res, next) => {
    try {
      let sessions = [];
      if (req.user.role === 'STUDENT') {
        sessions = await LiveInterview.getStudentSessions(req.user.user_id);
      } else {
        sessions = await LiveInterview.getFacultySessions(req.user.user_id);
      }

      return res.status(200).json({
        success: true,
        sessions
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/live-interview/session/:sessionId
  Fetches details for a specific live session.
  */
  getSessionDetails: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const session = await LiveInterview.getSessionById(sessionId);

      if (!session) {
        return res.status(404).json({ success: false, message: 'Live interview session not found.' });
      }

      return res.status(200).json({
        success: true,
        session
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  PUT /api/live-interview/status/:sessionId
  Updates live session lifecycle state (SCHEDULED -> LIVE -> COMPLETED).
  */
  updateSessionStatus: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { status } = req.body;

      const session = await LiveInterview.updateStatus(sessionId, status);
      return res.status(200).json({
        success: true,
        session
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  PUT /api/live-interview/reschedule/:sessionId
  Faculty updates schedule time, date, title, or category.
  */
  rescheduleSession: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { title, category, scheduledAt } = req.body;

      if (!scheduledAt) {
        return res.status(400).json({ success: false, message: 'Scheduled date and time are required.' });
      }

      const session = await LiveInterview.rescheduleSession(sessionId, {
        title,
        category,
        scheduledAt
      });

      return res.status(200).json({
        success: true,
        message: 'Live interview slot rescheduled successfully.',
        session
      });
    } catch (error) {
      return next(error);
    }
  },


  /*
  POST /api/live-interview/evaluate/:sessionId
  Faculty submits live scorecard evaluation for a session.
  */
  submitEvaluation: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { commScore, techScore, confScore, feedback } = req.body;

      const session = await LiveInterview.submitEvaluation(sessionId, {
        commScore,
        techScore,
        confScore,
        feedback
      });

      return res.status(200).json({
        success: true,
        message: 'Live interview evaluation submitted successfully.',
        session
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/live-interview/signal/send
  WebRTC Signaling: Client sends SDP offer/answer or ICE candidate.
  */
  sendSignal: async (req, res, next) => {
    try {
      const { sessionId, receiverId, signalType, payload } = req.body;
      const senderId = req.user.user_id;

      if (!sessionId || !receiverId || !signalType || !payload) {
        return res.status(400).json({ success: false, message: 'Invalid WebRTC signal payload.' });
      }

      await LiveInterview.saveSignal({
        sessionId,
        senderId,
        receiverId,
        signalType,
        payload
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      return next(error);
    }
  },

  /*
  GET /api/live-interview/signal/poll/:sessionId
  WebRTC Signaling: Client polls for incoming SDP/ICE signals.
  */
  pollSignals: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user.user_id;

      const signals = await LiveInterview.fetchAndClearSignals({
        sessionId,
        userId
      });

      return res.status(200).json({
        success: true,
        signals
      });
    } catch (error) {
      return next(error);
    }
  }

};
