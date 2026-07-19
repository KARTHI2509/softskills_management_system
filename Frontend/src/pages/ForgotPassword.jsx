/*
------------------------------------------------
File: ForgotPassword.jsx
Purpose: Dispatches password recovery links.
Responsibilities: Logs password request inputs.
Dependencies: react, authService, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import Button from '../components/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred requesting link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold">Recover Password</h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Enter email to receive recovery instructions.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-medium">
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="student@college.edu"
          />
        </div>
        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Dispatched Link
        </Button>
      </form>

      <div className="text-center text-sm font-medium text-blue-600">
        <Link to="/login" className="hover:underline">Back to Sign In</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
