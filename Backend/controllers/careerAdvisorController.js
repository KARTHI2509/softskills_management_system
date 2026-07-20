/*
------------------------------------------------
File: careerAdvisorController.js
Purpose: Handles AI Career Advisor prompt queries.
Responsibilities: Queries Gemini AI for career guidance and returns study roadmap templates.
Dependencies: aiService, Student
------------------------------------------------
*/

const Student = require('../models/Student');
const aiService = require('../services/aiService');

module.exports = {
  /*
  POST /api/advisor/ask
  Answers student career path/placement inquiries using Gemini.
  */
  askAdvisor: async (req, res, next) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, message: 'Prompt text is required.' });
      }

      // Fetch student data for context
      const stats = await Student.getDashboardStats(req.user.user_id);
      const reports = await Student.getDetailedProgressReport(req.user.user_id);
      
      const context = `
        Student Name: ${stats.profile?.name || 'Krishna'}
        Department: ${stats.profile?.department || 'CSE'}
        CGPA: ${stats.profile?.cgpa || '8.25'}
        Placement Readiness Index: ${stats.placementScore}%
        Aptitude Rating: ${reports.aptitude.average}%
        Resume Rating: ${reports.resume.average}%
        Mock Interview Rating: ${reports.interview.average}%
      `;

      // Query Gemini
      const db = require('../config/db');
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      
      let answer = '';
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && !apiKey.includes('placeholder') && apiKey !== '') {
        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const genPrompt = `
            You are an expert college placement director and career coach. 
            Below is the academic profile of the student asking the question:
            ${context}
            
            Student Question: "${prompt}"
            
            Provide an encouraging, highly structured, and actionable guidance response. 
            Include bullet-points with concrete resources, tools, or roadmap steps.
          `;
          const result = await model.generateContent(genPrompt);
          answer = result.response.text();
        } catch (err) {
          console.error('Gemini advisor lookup failed, fallback to rules engine:', err);
        }
      }

      if (!answer) {
        // Fallback response builder based on query keywords
        const query = prompt.toLowerCase();
        if (query.includes('resume') || query.includes('cv')) {
          answer = `Based on your profile, your Resume ATS score stands at **${reports.resume.average}%**. Here are your priority items:\n\n1. **Incorporate Action Verbs**: Start bullets with verbs like *orchestrated*, *optimized*, or *spearheaded*.\n2. **Quantify Metrics**: Add metrics matching your projects (e.g. "Improved database query response times by 35%").\n3. **Include Missing Keywords**: Ensure keywords like *CI/CD*, *PostgreSQL*, and *RESTful APIs* are included.`;
        } else if (query.includes('interview') || query.includes('hr')) {
          answer = `Your Mock Interview rating is **${reports.interview.average}%**. Focus on these techniques:\n\n1. **Use the STAR Method**: Structure answers by describing the *Situation*, *Task*, *Action*, and *Result*.\n2. **Eye Contact**: Maintain visual confidence if using webcam responses.\n3. **Clarity over Speed**: Speak composed and steady at ~130 words per minute.`;
        } else {
          answer = `Welcome ${stats.profile?.name || 'Krishna'}! Based on your **${stats.profile?.department || 'CSE'}** engineering details, here is your daily placement roadmap:\n\n- 🌅 **Morning**: Practice 2 timed logical puzzles in the Aptitude Arena.\n- ☀️ **Afternoon**: Upload an updated resume PDF to verify ATS scores.\n- 🌆 **Evening**: Record a 1-minute HR video pitch on 'Tell me about yourself'.`;
        }
      }

      return res.status(200).json({
        success: true,
        answer
      });
    } catch (error) {
      return next(error);
    }
  }
};
