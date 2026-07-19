# Frontend Development Guide

This guide is for developers working on the **Smart Soft Skills Management System** React frontend.

## Technology Summary
- **UI Framework**: React.js (functional components with Hooks)
- **Styling**: Tailwind CSS for responsive grid layouts and utility formatting
- **Routing**: React Router DOM (v6) with path routing
- **Animations**: Framer Motion for cards, tables, and modal page overlays
- **API Fetching**: Axios client with centralized token inclusion interceptors

---

## State Architecture

Global states are shared using standard React Context engines:
*   **`AuthContext`**: Manages token verification status, current logged-in user profile attributes, and logout methods.
*   **`ThemeContext`**: Governs dark mode settings, writing state variables to `document.documentElement` to allow Tailwind's `dark:` selectors.

---

## Reusable UI Design Standards

All interactive controls should utilize core reusable UI blocks:
- **`src/components/Button.jsx`**: Custom states supporting variant colors (primary, outline, secondary) and loading attributes.
- **`src/components/Card.jsx`**: Glassmorphism dashboard panel wrappers with standard shadow styling.
- **`src/components/LoadingSkeleton.jsx`**: Pulsing page loaders displaying layout mockups before APIs finish fetching.
- **`src/components/Toast.jsx`**: Auto-dismiss error & info popups.

---

## Route Authorization Guard

Routes are defined under `src/routes/AppRoutes.jsx`. Wrap components using `ProtectedRoute` to restrict access:
```jsx
// Example routing setup
import { ProtectedRoute } from '../routes/ProtectedRoute';
import StudentDashboard from '../pages/StudentDashboard';

<Route 
  path="/student/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['STUDENT']}>
      <StudentDashboard />
    </ProtectedRoute>
  } 
/>
```
---

## Coding Standards & Layout Comments
Every React component must have a top-level comment block specifying its structural purpose and attributes.
Example:
```jsx
/*
------------------------------------------------
File: StudentDashboard.jsx
Purpose: Core view for authenticated students.
Responsibilities: Displays placement metrics, charts, upcoming events.
------------------------------------------------
*/
```
- Keep CSS variables structured inside `src/styles/index.css`.
- Rely on Framer Motion animation variables declared in `src/animations/presets.js` to ensure consistent micro-interactions across components.
