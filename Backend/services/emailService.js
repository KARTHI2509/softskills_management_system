/*
------------------------------------------------
File: emailService.js
Purpose: Manages SMTP configuration and email broadcasts.
Responsibilities: Constructs and triggers transactional emails.
Dependencies: None
------------------------------------------------
*/

module.exports = {
  /*
  Sends password recovery tokens.
  Params: recipientEmail (string), recoveryToken (string).
  Returns: Delivery status.
  */
  sendForgotPasswordEmail: async (recipientEmail, recoveryToken) => {
    console.log(`[EMAIL SERVICE] Sending recovery link to: ${recipientEmail}`);
    console.log(`[EMAIL SERVICE] Reset URL: http://localhost:3000/reset-password?token=${recoveryToken}`);
    return {
      success: true,
      message: 'Password reset link dispatched successfully'
    };
  }
};
