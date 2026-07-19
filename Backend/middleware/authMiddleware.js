/*
------------------------------------------------
File: authMiddleware.js
Purpose: Protects routes using JWT verification.
Responsibilities: Validates Bearer tokens and binds user claims to req.user.
Dependencies: jsonwebtoken, dotenv, db.js
------------------------------------------------
*/

const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

/*
Auth middleware handler.
Validates the authorization header token.
Passes request to next middleware if verification succeeds.
*/
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecrettokenkeyhere');

      // Fetch user profile from database
      const userRes = await db.query(
        'SELECT user_id, name, email, role, department FROM users WHERE user_id = $1',
        [decoded.id]
      );

      if (userRes.rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      req.user = userRes.rows[0];
      return next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
