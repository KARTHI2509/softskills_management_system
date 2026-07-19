/*
------------------------------------------------
File: aiService.js
Purpose: Manages generative AI API calls (Gemini/OpenAI integration layer).
Responsibilities: Generates mock evaluations, ATS resume reviews, and speech feedback.
Dependencies: dotenv
------------------------------------------------
*/

require('dotenv').config();

module.exports = {
  /*
  Analyzes mock interview transcripts and parameters.
  Params: question (text), responseText (text), toneMetrics (object).
  Returns: AI evaluation comments and suggested adjustments.
  */
  evaluateInterviewResponse: async (question, responseText, toneMetrics = {}) => {
    // If API keys are available, we can initiate Gemini/OpenAI calls here.
    // Fallback Mock AI evaluation engine below:
    return {
      success: true,
      score: 85,
      grammarScore: 90,
      pronunciationScore: 88,
      suggestions: [
        'Try to expand your description of resolving conflicts.',
        'Use more active action verbs (e.g. "managed", "engineered" instead of "handled").',
        'Maintain a slightly slower speaking pace to enhance message clarity.'
      ],
      strengths: [
        'Strong technical core description.',
        'Confident tone usage.'
      ]
    };
  },

  /*
  Evaluates resume files against ATS schemas and keywords.
  Params: resumeRawText (text).
  Returns: ATS alignment ratings and keyword optimization proposals.
  */
  analyzeResumeATS: async (resumeRawText) => {
    return {
      success: true,
      atsScore: 78,
      missingKeywords: ['CI/CD', 'Docker', 'PostgreSQL Optimization', 'REST API Design'],
      formattingIssues: [
        'Include a dedicated Skills grid at the top.',
        'Replace long paragraphs with bullet points describing actions.'
      ],
      aiSuggestions: [
        'Add quantitative metrics to your projects (e.g. "Improved query performance by 40%").',
        'Incorporate cloud architecture components matching modern recruitment databases.'
      ]
    };
  }
};
