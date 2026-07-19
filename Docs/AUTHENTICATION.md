# Authentication and Authorization

This document specifies the security mechanisms used in the **Smart Soft Skills Management System for Placement Readiness**.

## Password Security
All user passwords are encrypted prior to database storage using **bcryptjs** with a cost factor (salt rounds) of `10`. Clear-text passwords are never logged, stored, or outputted by APIs.

---

## Token-Based Authentication (JWT)
The system uses JSON Web Tokens (JWT) for stateless authentication.
*   **Token Generation**: Upon successful login or registration, the backend signs a payload with the user's base credentials:
    ```json
    {
      "id": "user-uuid",
      "email": "user@college.edu",
      "role": "STUDENT"
    }
    ```
*   **Expiration**: Tokens are configured to expire in `24 hours` (`24h`).
*   **Token Delivery**: Sent back in the response body as `token` and stored in LocalStorage or Cookies on the frontend.
*   **Authorization Header**: Clients must send the JWT token in all authenticated HTTP requests as a Bearer token:
    ```http
    Authorization: Bearer <jwt_token>
    ```

---

## Role-Based Access Control (RBAC)

The application supports four user roles:
1.  **STUDENT** - Access to practice, upload resumes, do mock tests/interviews, and view reports.
2.  **FACULTY** - Evaluate students, schedule group discussions, assign activities, and check attendance.
3.  **PLACEMENT_OFFICER** - Access placement statistics, compare departments, inspect readiness index, and download student profile collections.
4.  **ADMIN** - Universal system access, user roles updates, database configurations, and global settings toggles.

### Access Hierarchy Mapping
```
ADMIN ──────────> PLACEMENT_OFFICER ────> FACULTY ────> STUDENT
```

---

## Middleware Architecture

Authentication and authorization are managed by two core middlewares:
- `authMiddleware.js`: Validates the bearer token signature and binds the decoded user profile to the `req.user` payload.
- `roleMiddleware.js`: Checks the role bound to `req.user` against a list of allowed roles for specific route access.

### Route Implementation Example
```javascript
const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Only faculty members can evaluate student submissions
router.post('/evaluate', protect, authorize('FACULTY', 'ADMIN'), facultyController.evaluateStudent);
```
