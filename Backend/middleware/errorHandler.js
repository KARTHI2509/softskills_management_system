/*
------------------------------------------------
File: errorHandler.js
Purpose: Captures system runtime errors globally.
Responsibilities: Intercepts Express errors and outputs clean JSON packages.
Dependencies: dotenv
------------------------------------------------
*/

/*
Global error handling middleware.
Intercepts errors, sets response statuses, and formats return payloads.
*/
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('System Exception caught:', err.message, err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = { errorHandler };
