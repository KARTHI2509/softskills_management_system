# Backend Development Guide

This document defines coding guidelines, file responsibilities, and architecture models for the Express.js backend.

## Architectural Principles
We follow the **Model-View-Controller (MVC)** architectural layout combined with a **Service Layer Pattern**:

1.  **Routes (`/routes`)**: Bind URLs directly to controllers. Routes should NOT contain any database interactions or business logic.
2.  **Controllers (`/controllers`)**: Parse incoming body elements, check credentials, map schema variables, and delegate tasks to services.
3.  **Services (`/services`)**: Business logic engines. Handle external APIs (Gemini/Cloudinary), process metrics, and calculate values.
4.  **Models (`/models`)**: Handle all database queries and interactions.
5.  **Middlewares (`/middleware`)**: Cross-cutting concerns such as logging, security guards, input schema validation, and error routing.

---

## Centralized Error Handling

All Express controllers should wrap logic using `express-async-handler` or standard `try/catch` and direct errors to `next(error)`.
The centralized `errorHandler.js` middleware intercept errors and formats response payloads:
```json
{
  "success": false,
  "message": "Resource not found",
  "stack": "Error: ... (disabled in production)"
}
```

---

## Coding Comment Standards
Every file must start with a header comment detailing its purpose, responsibilities, and dependencies.
Example:
```javascript
/*
------------------------------------------------
File: authController.js
Purpose: Manages JWT credentials operations.
Dependencies: userService, jwtUtils, dbService.
------------------------------------------------
*/
```

---

## Environment Variables Configuration
Configure `.env` files in the root folder. Never push secret keys to version control:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=supersecrettokenkeyhere
CLOUDINARY_CLOUD_NAME=yourcloudname
CLOUDINARY_API_KEY=yourkey
CLOUDINARY_API_SECRET=yoursecret
GEMINI_API_KEY=yourgeminikey
```
