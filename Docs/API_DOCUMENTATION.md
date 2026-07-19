# API Documentation

This document describes the API endpoints for the **Smart Soft Skills Management System for Placement Readiness**.

## Base URL
`http://localhost:5000/api`

---

## Authentication Endpoints (`/auth`)

### 1. Register User
*   **POST** `/auth/register`
*   **Request Body**:
    ```json
    {
      "name": "John Doe",
      "email": "student@college.edu",
      "password": "SecurePassword123",
      "role": "STUDENT",
      "department": "CSE",
      "roll_no": "2026CSE001",
      "year": 4,
      "cgpa": 8.75
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "token": "eyJhbGciOi...",
      "user": {
        "id": "u-123-abc",
        "name": "John Doe",
        "email": "student@college.edu",
        "role": "STUDENT"
      }
    }
    ```

### 2. Login User
*   **POST** `/auth/login`
*   **Request Body**:
    ```json
    {
      "email": "student@college.edu",
      "password": "SecurePassword123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOi...",
      "user": {
        "id": "u-123-abc",
        "name": "John Doe",
        "role": "STUDENT",
        "department": "CSE"
      }
    }
    ```

### 3. Logout User
*   **POST** `/auth/logout`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```

### 4. Forgot Password
*   **POST** `/auth/forgot-password`
*   **Request Body**:
    ```json
    {
      "email": "student@college.edu"
    }
    ```

### 5. Reset Password
*   **POST** `/auth/reset-password`
*   **Request Body**:
    ```json
    {
      "token": "reset-token-xyz",
      "newPassword": "NewSecurePassword456"
    }
    ```

### 6. Get Profile
*   **GET** `/auth/profile`
*   **Headers**: `Authorization: Bearer <token>`
*   **Response (200 OK)**

### 7. Update Profile
*   **PUT** `/auth/profile`
*   **Headers**: `Authorization: Bearer <token>`
*   **Request Body**:
    ```json
    {
      "name": "John Doe",
      "department": "CSE"
    }
    ```

---

## Student Endpoints (`/student`)
All student requests require header token: `Authorization: Bearer <token>` and `role: STUDENT/FACULTY/PLACEMENT_OFFICER/ADMIN`.

### 1. Get Dashboard Summary
*   **GET** `/student/dashboard`
*   **Response (200 OK)**:
    ```json
    {
      "profile": { "name": "John Doe", "roll_no": "2026CSE001" },
      "placementScore": 82,
      "attendance": 94.5,
      "skillProgress": { "communication": 75, "aptitude": 88, "interview": 80 },
      "upcomingActivities": [...],
      "recentFeedback": [...]
    }
    ```

### 2. Get Skill Progress Graphs
*   **GET** `/student/progress-graphs`

### 3. Get Attendance Records
*   **GET** `/student/attendance`

---

## Faculty Endpoints (`/faculty`)
Requires header token with `role: FACULTY` or `ADMIN`.

### 1. Submit Student Evaluation
*   **POST** `/faculty/evaluation`
*   **Request Body**:
    ```json
    {
      "student_id": "stud-uuid-here",
      "activity_type": "GD",
      "activity_id": "act-uuid-here",
      "score": 85,
      "feedback": "Showed great leadership during the discussion."
    }
    ```

### 2. Post Activity Assignment
*   **POST** `/faculty/activities`
*   **Request Body**:
    ```json
    {
      "title": "Resume Pitch",
      "description": "Prepare a 1-minute pitch video",
      "due_date": "2026-07-25T18:00:00Z",
      "category": "COMMUNICATION"
    }
    ```

---

## Placement Endpoints (`/placement`)
Requires header token with `role: PLACEMENT_OFFICER` or `ADMIN`.

### 1. Get Eligible Students
*   **GET** `/placement/eligible`
*   **Query Params**: `minCgpa=8.0&minScore=75`

### 2. Get Department Performance Analytics
*   **GET** `/placement/department-comparison`

---

## Communication Exercises (`/communication`)
*   **GET** `/communication/exercises`
*   **POST** `/communication/submit`

---

## Mock Interview Endpoints (`/mock-interview`)
*   **GET** `/mock-interview/questions`
*   **POST** `/mock-interview/upload-recording` (Multipart upload for video)
*   **POST** `/mock-interview/ai-evaluate` (Calls Gemini/OpenAI services)

---

## Resume Builder Endpoints (`/resume`)
*   **POST** `/resume/upload` (Upload to Cloudinary, extracts details)
*   **POST** `/resume/evaluate` (ATS analysis and suggestions)

---

## Aptitude Test Endpoints (`/aptitude`)
*   **GET** `/aptitude/questions` (Get timed questions)
*   **POST** `/aptitude/submit` (Submit score sheet, updates placement score)
*   **GET** `/aptitude/leaderboard` (Overall placement readiness leaderboard)
