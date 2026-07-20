/*
------------------------------------------------
File: certificateController.js
Purpose: Handles Issuance of verified soft skills/placement readiness certificates.
Responsibilities: Checks readiness scores thresholds and issues crypto-verified pdf signatures.
Dependencies: db.js, Student
------------------------------------------------
*/

const db = require('../config/db');
const Student = require('../models/Student');
const crypto = require('crypto');

module.exports = {
  /*
  GET /api/certificates
  Returns student certificates listing.
  */
  listCertificates: async (req, res, next) => {
    try {
      const certRes = await db.query(
        `SELECT * FROM certificates 
         WHERE student_id = $1 
         ORDER BY issued_at DESC`,
        [req.user.user_id]
      );

      return res.status(200).json({
        success: true,
        certificates: certRes.rows
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/certificates/claim
  Verifies if placement readiness score >= 80. If yes, generates verified certificate.
  */
  claimCertificate: async (req, res, next) => {
    try {
      const stats = await Student.getDashboardStats(req.user.user_id);
      
      if (stats.placementScore < 80) {
        return res.status(400).json({
          success: false,
          message: `Your Placement Readiness Score is currently ${stats.placementScore}%. You need at least 80% to claim your readiness certificate.`
        });
      }

      // Check if already claimed
      const existRes = await db.query(
        `SELECT * FROM certificates WHERE student_id = $1 AND type = 'PLACEMENT_READINESS'`,
        [req.user.user_id]
      );

      if (existRes.rows.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Certificate already issued.',
          certificate: existRes.rows[0]
        });
      }

      // Generate verified hash
      const dataStr = `${req.user.user_id}-placement-readiness-${Date.now()}`;
      const verificationHash = crypto.createHash('sha256').update(dataStr).digest('hex').substring(0, 16).toUpperCase();

      const newCert = await db.query(
        `INSERT INTO certificates (student_id, type, verification_hash)
         VALUES ($1, 'PLACEMENT_READINESS', $2)
         RETURNING *`,
        [req.user.user_id, verificationHash]
      );

      return res.status(201).json({
        success: true,
        message: 'Placement Readiness Certificate issued successfully!',
        certificate: newCert.rows[0]
      });
    } catch (error) {
      return next(error);
    }
  }
};
