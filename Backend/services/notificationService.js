/*
------------------------------------------------
File: notificationService.js
Purpose: Dispatches in-app notification alerts.
Responsibilities: Inserts notification alerts into the database.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Creates in-app user notifications with optional target URL.
  Params: userId (UUID), message (string), targetUrl (string optional).
  Returns: Database query result.
  */
  createNotification: async (userId, message, targetUrl = null) => {
    try {
      const res = await db.query(
        `INSERT INTO notifications (user_id, message, target_url) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [userId, message, targetUrl]
      );
      return res.rows[0];
    } catch (error) {
      // Fallback if target_url column is not yet migrated
      try {
        const fallbackRes = await db.query(
          'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
          [userId, message]
        );
        return fallbackRes.rows[0];
      } catch (fbErr) {
        console.error('Notification creation failure:', fbErr);
        throw fbErr;
      }
    }
  }
};
