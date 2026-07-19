/*
------------------------------------------------
File: logger.js
Purpose: Handles unified console audit records.
Responsibilities: Logs message strings and exception tracers.
Dependencies: None
------------------------------------------------
*/

module.exports = {
  /*
  Log general information messages.
  */
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  },

  /*
  Log system error messages.
  */
  error: (message, err) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, err || '');
  }
};
