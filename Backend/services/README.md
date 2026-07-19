# Backend Services

## Purpose
Abstractions for handling third-party integrations and complex async workflows (like email notifications, file uploads, and generative AI feedback).

## Files
- `aiService.js`: Wrapper interface to interact with Gemini / OpenAI API endpoints.
- `storageService.js`: Handles video/resume file streams upload to Cloudinary.
- `emailService.js`: Email alert template builders (forgot password codes).
- `notificationService.js`: Central system notifications distribution manager.

## Responsibilities
- Decouple controllers from third-party vendor APIs.
- Manage AI model requests and parsed formatting.
- Handle media storage operations.
