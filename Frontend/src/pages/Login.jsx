/*
------------------------------------------------
File: Login.jsx
Purpose: Authenticates user credentials.
Responsibilities: Stores token context and routes user to role-specific dashboard views.
Dependencies: react, react-router-dom, useAuth, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      // Fetch profile context after successful auth to resolve role
      const tokenPayload = localStorage.getItem('token');
      if (tokenPayload) {
        // Mock role route fallback
        if (email.includes('admin')) {
          navigate('/admin/dashboard');
        } else if (email.includes('faculty')) {
          navigate('/faculty/dashboard');
        } else if (email.includes('placement')) {
          navigate('/placement/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-800 dark:text-gray-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            register a new profile
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="name@college.edu"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <Button type="submit" variant="primary" loading={loading} className="w-full py-3">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Login;
