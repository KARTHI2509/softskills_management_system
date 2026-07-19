# Backend Controllers

## Purpose
Controllers process incoming API request payloads, parse input parameters, verify headers, call underlying services, and format JSON output.

## Files
- `authController.js`: Student register, user login, password operations.
- `studentController.js`: Fetch score summary, profile, attendance.
- `facultyController.js`: Manage evaluations, assign tasks.
- `placementController.js`: Department analytics, eligible students.
- `communicationController.js`: Practice modules & exercises handler.
- `mockInterviewController.js`: Video upload, score mappings, feedback routing.
- `groupDiscussionController.js`: GD scoring and management.
- `resumeController.js`: ATS feedback and builder services.
- `aptitudeController.js`: Test submission, leaderboard query mappings.
- `reportController.js`: Analytical export triggers.

## Responsibilities
- Intercept Express requests.
- Validate request schemas.
- Delegate actions to services.
- Return structured HTTP responses.
