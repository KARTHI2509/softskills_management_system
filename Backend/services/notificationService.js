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
  Creates in-app user notifications.
  Params: userId (UUID), message (string).
  Returns: Database query result.
  */
  createNotification: async (userId, message) => {
    try {
      const res = await db.query(
        'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *',
        [userId, message]
      );
      return res.rows[0];
    } catch (error) {
      console.error('Notification creation failure:', error);
      throw error;
    }
  }
};
