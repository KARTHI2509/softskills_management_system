# Backend Routes

## Purpose
Exposes and maps all REST URLs endpoints to their respective controllers, binding guards and RBAC role criteria.

## Files
- `authRoutes.js`: Login, register, profile routing.
- `studentRoutes.js`: Student dashboard and metrics.
- `facultyRoutes.js`: Faculty evaluation tasks.
- `placementRoutes.js`: Placement dashboard metrics.
- `communicationRoutes.js`: Communication exercises.
- `mockInterviewRoutes.js`: Recording and video uploads.
- `groupDiscussionRoutes.js`: GD lists and scores routing.
- `resumeRoutes.js`: ATS scoring logic.
- `aptitudeRoutes.js`: Quizzes routing.
- `reportRoutes.js`: Exporting system reports.

## Responsibilities
- Define system URLs.
- Secure access paths using authorization middlewares.
