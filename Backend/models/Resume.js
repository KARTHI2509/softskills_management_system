/*
------------------------------------------------
File: Resume.js
Purpose: Manages resumes database storage logs.
Responsibilities: Stores Cloudinary paths, registers ATS scores, and AI recommendations JSON sets.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Saves resume record details.
  */
  saveResume: async (studentId, fileUrl, atsScore, aiSuggestions) => {
    const res = await db.query(
      `INSERT INTO resumes (student_id, file_url, ats_score, ai_suggestions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [studentId, fileUrl, atsScore, JSON.stringify(aiSuggestions)]
    );
    return res.rows[0];
  },

  /*
  Fetches student resume upload history logs.
  */
  findByStudentId: async (studentId) => {
    const res = await db.query(
      'SELECT * FROM resumes WHERE student_id = $1 ORDER BY created_at DESC',
      [studentId]
    );
    return res.rows;
  }
};
