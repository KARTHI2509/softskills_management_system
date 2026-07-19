/*
------------------------------------------------
File: Faculty.js
Purpose: Manages faculty profile database queries.
Responsibilities: Specialization registry mapping.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Registers faculty detail specialization.
  */
  createFaculty: async (facultyId, specialization) => {
    const res = await db.query(
      `INSERT INTO faculties (faculty_id, specialization) VALUES ($1, $2) RETURNING *`,
      [facultyId, specialization]
    );
    return res.rows[0];
  }
};
