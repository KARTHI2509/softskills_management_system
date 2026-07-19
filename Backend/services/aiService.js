const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini client helper
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes('placeholder') || apiKey === '') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

module.exports = {
  /*
  Analyzes mock interview transcripts and parameters using Gemini AI.
  Params: question (text), responseText (text), toneMetrics (object).
  Returns: AI evaluation comments and suggested adjustments.
  */
  evaluateInterviewResponse: async (question, responseText, toneMetrics = {}) => {
    const genAI = getGeminiClient();
    
    if (genAI) {
      try {
        console.log('Sending interview response to Gemini AI...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
          Evaluate the student's answer for the following placement interview question.
          
          Question: "${question}"
          Student Answer Pitch: "${responseText}"
          
          Provide a constructive assessment in JSON format. Do not return any other text, markdown, or commentary. Use this exact JSON structure:
          {
            "score": 85, 
            "grammarScore": 90, 
            "pronunciationScore": 88, 
            "strengths": ["strength 1", "strength 2"],
            "suggestions": ["suggestion 1", "suggestion 2"]
          }
        `;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
          success: true,
          ...parsed
        };
      } catch (err) {
        console.error('Gemini API call failed, falling back to rule engine:', err);
      }
    }

    // Fallback Mock AI evaluation engine below:
    const cleanText = (responseText || '').trim();
    const wordCount = cleanText.split(/\s+/).filter(w => w.length > 0).length;

    let score = 75;
    let grammarScore = 80;
    let pronunciationScore = 85;
    let suggestions = [];
    let strengths = [];

    if (wordCount < 10) {
      score = 45;
      grammarScore = 60;
      pronunciationScore = 70;
      strengths = ['Began the prompt cleanly.'];
      suggestions = [
        'Your response is extremely short. Aim to speak for at least 1-2 minutes to detail your thoughts.',
        'Describe specific instances, projects, or situations using the STAR methodology (Situation, Task, Action, Result).'
      ];
    } else if (wordCount >= 10 && wordCount < 50) {
      score = 70;
      grammarScore = 75;
      pronunciationScore = 80;
      strengths = ['Clear core explanation.', 'Good direct response address.'];
      suggestions = [
        'Elaborate more on the actions YOU personally took in this scenario.',
        'Incorporate stronger action verbs (e.g., "orchestrated", "resolved", "spearheaded").'
      ];
    } else {
      score = 90;
      grammarScore = 88;
      pronunciationScore = 92;
      strengths = [
        'Detailed and comprehensive description.',
        'Excellent application of structured answers (STAR method).',
        'Assertive and professional vocabulary.'
      ];
      suggestions = [
        'Keep up the structure! Try slightly adjusting your pace to stay composed.',
        'Maintain eye contact if recording video responses to increase visual confidence.'
      ];
    }

    return {
      success: true,
      score,
      grammarScore,
      pronunciationScore,
      suggestions,
      strengths
    };
  },

  /*
  Evaluates resume files against ATS schemas and keywords using Gemini AI.
  Params: resumeRawText (text).
  Returns: ATS alignment ratings and keyword optimization proposals.
  */
  analyzeResumeATS: async (resumeRawText) => {
    const genAI = getGeminiClient();

    if (genAI) {
      try {
        console.log('Sending resume to Gemini AI for ATS analysis...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
          Analyze the following resume details for ATS formatting, recommended industry keywords, and layout structure optimization.
          
          Resume Details: "${resumeRawText}"
          
          Provide a detailed report in JSON format. Do not return any other text, markdown, or commentary. Use this exact JSON structure:
          {
            "atsScore": 75, 
            "missingKeywords": ["keyword 1", "keyword 2"],
            "formattingIssues": ["issue 1", "issue 2"],
            "aiSuggestions": ["suggestion 1", "suggestion 2"]
          }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        return {
          success: true,
          ...parsed
        };
      } catch (err) {
        console.error('Gemini API call failed, falling back to rule engine:', err);
      }
    }

    // Fallback Mock ATS analyzer below:
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
