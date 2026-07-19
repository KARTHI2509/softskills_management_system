# Backend Models

## Purpose
This folder encapsulates all queries and database access patterns. All SQL instructions are written inside models to separate database operations from HTTP routing.

## Files
- `User.js`: Base queries for credentials register, verification, and role profile updates.
- `Student.js`: Analytics lookups, scorecard updates, and profile data mapper.
- `Faculty.js`: Faculty evaluation database inputs.
- `Placement.js`: Queries for tracking eligible candidate lists and department aggregates.
- `MockInterview.js`: DB queries mapping video assets and evaluations.
- `GroupDiscussion.js`: DB maps to GD events and team registers.
- `Aptitude.js`: Quiz scores mapping, question banks.
- `Resume.js`: Database logs of resume uploads and ATS metrics.
- `Activity.js`: Activity database registers.
- `Attendance.js`: Class attendance tables maps.

## Responsibilities
- Encapsulate SQL database interactions.
- Provide data models to services and controllers.
