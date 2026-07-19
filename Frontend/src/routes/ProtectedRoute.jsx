/*
------------------------------------------------
File: ProtectedRoute.jsx
Purpose: Guards restricted dashboard routes.
Responsibilities: Intercepts unauthenticated routes and redirects to /login.
Dependencies: react, react-router-dom, useAuth
------------------------------------------------
*/

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSkeleton from '../components/LoadingSkeleton';

/*
Route guard component.
Params: children (target route page), allowedRoles (roles list).
*/
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-6">
        <LoadingSkeleton type="card" lines={4} />
      </div>
    );
  }

  if (!user) {
    console.warn('Unauthorized routing access attempted, redirecting...');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.warn(`Access denied. Role ${user.role} does not meet requirements.`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
