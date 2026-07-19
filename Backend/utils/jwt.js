/*
------------------------------------------------
File: jwt.js
Purpose: Manages JSON Web Token signing.
Responsibilities: Encodes user payload and assigns standard 24h expiration settings.
Dependencies: jsonwebtoken, dotenv
------------------------------------------------
*/

const jwt = require('jsonwebtoken');
require('dotenv').config();

/*
Generates a JWT token for a specific user ID.
Params: id (user_id).
Returns: JWT signed token string.
*/
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecrettokenkeyhere',
    { expiresIn: '24h' }
  );
};

module.exports = { generateToken };
