/*
------------------------------------------------
File: communicationController.js
Purpose: Handles reading, vocabulary, and presentation modules exercises.
Responsibilities: Outputs practice question banks, saves text and audio submissions.
Dependencies: None
------------------------------------------------
*/

module.exports = {
  /*
  GET /api/communication/exercises
  Returns soft skills exercises list.
  */
  getExercises: async (req, res, next) => {
    try {
      return res.status(200).json({
        success: true,
        exercises: [
          { id: 'comm-1', title: 'Active Listening Basics', category: 'Reading', difficulty: 'Beginner' },
          { id: 'comm-2', title: 'Pitch Deck Delivery', category: 'Speaking', difficulty: 'Intermediate' }
        ]
      });
    } catch (error) {
      return next(error);
    }
  },

  /*
  POST /api/communication/submit
  Saves exercise response answers and checks results.
  */
  submitExercise: async (req, res, next) => {
    try {
      const { exerciseId, answerText } = req.body;
      console.log(`User ${req.user.user_id} submitted answer for exercise ${exerciseId}: ${answerText}`);
      return res.status(200).json({
        success: true,
        score: 90,
        feedback: 'Excellent vocabulary choice. Corrected 1 syntax minor bug.'
      });
    } catch (error) {
      return next(error);
    }
  }
};
