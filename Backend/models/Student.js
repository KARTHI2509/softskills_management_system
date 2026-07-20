/*
------------------------------------------------
File: Student.js
Purpose: Manages student profile metrics database queries.
Responsibilities: Student dashboard summaries, attendance rates, scoring, and registration details.
Dependencies: db.js
------------------------------------------------
*/

const db = require('../config/db');

module.exports = {
  /*
  Creates student details link record.
  */
  createStudent: async (studentId, rollNo, year, cgpa) => {
    const res = await db.query(
      `INSERT INTO students (student_id, roll_no, year, cgpa, placement_score)
       VALUES ($1, $2, $3, $4, 0)
       RETURNING *`,
      [studentId, rollNo, year, cgpa]
    );
    return res.rows[0];
  },

  /*
  Fetches full student dashboard credentials and metrics details.
  */
  getDashboardStats: async (studentId) => {
    const profileRes = await db.query(
      `SELECT u.name, u.email, u.department, s.roll_no, s.year, s.cgpa, s.placement_score
       FROM users u
       JOIN students s ON u.user_id = s.student_id
       WHERE u.user_id = $1`,
      [studentId]
    );

    const attendanceRes = await db.query(
      `SELECT 
         COUNT(*) as total, 
         SUM(CASE WHEN status = 'PRESENT' THEN 1 ELSE 0 END) as present
       FROM attendance WHERE student_id = $1`,
      [studentId]
    );

    const attendRow = attendanceRes.rows[0];
    const total = parseInt(attendRow.total) || 0;
    const present = parseInt(attendRow.present) || 0;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : '100.0';
    const attendanceRate = parseFloat(attendancePercentage);

    // Compute dynamic score details for the weighted Placement Readiness Score
    const reports = await module.exports.getDetailedProgressReport(studentId);
    
    const commScore = reports.writtenAnswers.average || 80;
    const resumeScore = reports.resume.average || 75;
    const interviewScore = reports.interview.average || 78;
    const aptitudeScore = reports.aptitude.average || 82;
    
    // Faculty Evaluation (Group Discussion average)
    const gdRes = await db.query(
      'SELECT AVG(score) as avg FROM gd_scores WHERE student_id = $1',
      [studentId]
    );
    const facultyScore = Math.round(parseFloat(gdRes.rows[0]?.avg) || 85);
    
    // Activity Completion Rate
    const activitiesCountRes = await db.query('SELECT COUNT(*)::int as count FROM activities');
    const studentMockCountRes = await db.query(
      'SELECT COUNT(*)::int as count FROM mock_interviews WHERE student_id = $1 AND status = \'COMPLETED\'',
      [studentId]
    );
    const assignedCount = activitiesCountRes.rows[0]?.count || 5;
    const completedCount = studentMockCountRes.rows[0]?.count || 4;
    const activityCompletionRate = Math.min(100, Math.round((completedCount / Math.max(1, assignedCount)) * 100));

    // Weighted Score logic
    const weightedScore = Math.round(
      (commScore * 0.20) +
      (resumeScore * 0.15) +
      (interviewScore * 0.25) +
      (aptitudeScore * 0.20) +
      (attendanceRate * 0.05) +
      (facultyScore * 0.10) +
      (activityCompletionRate * 0.05)
    );

    // Update dynamic index
    await db.query('UPDATE students SET placement_score = $1 WHERE student_id = $2', [weightedScore, studentId]);

    // Update profile object in memory
    const profile = profileRes.rows[0] ? { ...profileRes.rows[0], placement_score: weightedScore } : null;

    return {
      profile,
      placementScore: weightedScore,
      attendance: attendanceRate
    };
  },

  /*
  Updates placement scoring of student.
  */
  updatePlacementScore: async (studentId, score) => {
    await db.query(
      'UPDATE students SET placement_score = $1 WHERE student_id = $2',
      [score, studentId]
    );
  },

  /*
  Aggregates student historical evaluation scores across all modules.
  */
  getDetailedProgressReport: async (studentId) => {
    // 1. Aptitude average
    const aptRes = await db.query(
      'SELECT AVG((score::float / total_questions) * 100) as avg, COUNT(*) as count FROM aptitude_tests WHERE student_id = $1',
      [studentId]
    );
    
    // 2. Mock Interview average
    const mockRes = await db.query(
      'SELECT AVG(score) as avg, COUNT(*) as count FROM mock_interviews WHERE student_id = $1',
      [studentId]
    );
    
    // 3. Resume ATS average
    const resumeRes = await db.query(
      'SELECT AVG(ats_score) as avg, COUNT(*) as count FROM resumes WHERE student_id = $1',
      [studentId]
    );

    // 4. Subjective Written Answers average
    const writtenRes = await db.query(
      'SELECT AVG(score) as avg, COUNT(*) as count FROM student_answers WHERE student_id = $1 AND score IS NOT NULL',
      [studentId]
    );

    return {
      aptitude: {
        average: Math.round(parseFloat(aptRes.rows[0].avg) || 0),
        count: parseInt(aptRes.rows[0].count) || 0
      },
      interview: {
        average: Math.round(parseFloat(mockRes.rows[0].avg) || 0),
        count: parseInt(mockRes.rows[0].count) || 0
      },
      resume: {
        average: Math.round(parseFloat(resumeRes.rows[0].avg) || 0),
        count: parseInt(resumeRes.rows[0].count) || 0
      },
      writtenAnswers: {
        average: Math.round(parseFloat(writtenRes.rows[0].avg) || 0),
        count: parseInt(writtenRes.rows[0].count) || 0
      }
    };
  },

  /*
  Fetches unified profile fields including student metrics.
  */
  getStudentProfile: async (studentId) => {
    const res = await db.query(
      `SELECT u.name, u.email, u.role, u.department, s.roll_no, s.year, s.cgpa, s.placement_score
       FROM users u
       LEFT JOIN students s ON u.user_id = s.student_id
       WHERE u.user_id = $1`,
      [studentId]
    );
    return res.rows[0];
  },

  /*
  Updates roll_no, year, and cgpa for a student.
  */
  updateStudentInfo: async (studentId, rollNo, year, cgpa) => {
    const res = await db.query(
      `UPDATE students 
       SET roll_no = $1, year = $2, cgpa = $3 
       WHERE student_id = $4 
       RETURNING *`,
      [rollNo, year, cgpa, studentId]
    );
    return res.rows[0];
  }
};
