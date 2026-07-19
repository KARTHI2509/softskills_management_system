/*
------------------------------------------------
File: loggingMiddleware.js
Purpose: Audits incoming REST requests.
Responsibilities: Logs method, URL, and timestamp metrics.
Dependencies: None
------------------------------------------------
*/

/*
Logging middleware handler.
Logs incoming requests to the console.
*/
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} request to ${req.originalUrl}`);
  next();
};

module.exports = { requestLogger };
