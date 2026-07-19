/*
------------------------------------------------
File: Register.jsx
Purpose: Registers student and faculty credentials.
Responsibilities: Collects profile metadata, validates requirements, and initiates database users.
Dependencies: react, react-router-dom, useAuth, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';

const Register = () => {
  const { register } = useAuth();
  const [role, setRole] = useState('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [rollNo, setRollNo] = useState('');
  const [year, setYear] = useState(4);
  const [cgpa, setCgpa] = useState('');
  const [specialization, setSpecialization] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name,
      email,
      password,
      role,
      department,
      roll_no: role === 'STUDENT' ? rollNo : undefined,
      year: role === 'STUDENT' ? parseInt(year) : undefined,
      cgpa: role === 'STUDENT' ? parseFloat(cgpa) : undefined,
      specialization: role === 'FACULTY' ? specialization : undefined
    };

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      if (role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/faculty/dashboard');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-800 dark:text-gray-100">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          Or{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            log in to existing account
          </Link>
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Role Picker */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          type="button"
          onClick={() => setRole('STUDENT')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${role === 'STUDENT' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setRole('FACULTY')}
          className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${role === 'FACULTY' ? 'bg-white dark:bg-slate-900 shadow-sm text-blue-600' : 'text-slate-500'}`}
        >
          Faculty
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="name@college.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm"
            >
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>

          {role === 'STUDENT' && (
            <div>
              <label className="block text-sm font-semibold">Year of Study</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          )}
        </div>

        {role === 'STUDENT' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Roll Number</label>
              <input
                type="text"
                required
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm"
                placeholder="2026CSE001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                required
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm"
                placeholder="8.50"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold">Specialization</label>
            <input
              type="text"
              required
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm"
              placeholder="e.g. Communication Skills"
            />
          </div>
        )}

        <Button type="submit" variant="primary" loading={loading} className="w-full mt-4">
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
