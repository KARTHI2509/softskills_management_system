/*
------------------------------------------------
File: Activity.js
Purpose: Manages activities table database queries.
Responsibilities: Creates activity assignments, lists upcoming activities.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Assigns a soft skills practice activity.
  */
  createActivity: async (title, description, dueDate, assignedBy, category) => {
    const res = await db.query(
      `INSERT INTO activities (title, description, due_date, assigned_by, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, dueDate, assignedBy, category]
    );
    return res.rows[0];
  },

  /*
  Retrieves upcoming student tasks and activities.
  */
  findUpcoming: async () => {
    const res = await db.query(
      'SELECT * FROM activities WHERE due_date > CURRENT_TIMESTAMP ORDER BY due_date ASC'
    );
    return res.rows;
  }
};
