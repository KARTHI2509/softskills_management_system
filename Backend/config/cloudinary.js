/*
------------------------------------------------
File: cloudinary.js
Purpose: Cloudinary integration config.
Responsibilities: Configures the Cloudinary API credentials.
Dependencies: cloudinary, dotenv
------------------------------------------------
*/

const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'placeholder_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'placeholder_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder_secret'
});

module.exports = cloudinary;
