/*
------------------------------------------------
File: Profile.jsx
Purpose: Authenticated profile update page.
Responsibilities: Logs profile changes, commits updates to backend servers.
Dependencies: react, useAuth, authService, Card, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/Card';
import Button from '../components/Button';
import { User, Mail, GraduationCap, ShieldAlert } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Krishna Kumar');
  const [department, setDepartment] = useState(user?.department || 'CSE');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate updating API
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">User Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage account information, check active role permissions, and modify credentials details.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left card */}
        <Card className="flex flex-col items-center text-center p-8 h-fit">
          <div className="h-24 w-24 bg-blue-600 text-white text-3xl font-extrabold rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            {name.charAt(0)}
          </div>
          <h2 className="font-extrabold text-xl">{name}</h2>
          <span className="mt-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg uppercase tracking-wider text-slate-500">
            {user?.role || 'STUDENT'}
          </span>

          <div className="w-full border-t border-slate-100 dark:border-slate-800 mt-6 pt-6 text-left space-y-4 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>{user?.email || 'student@college.edu'}</span>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>Department: {department}</span>
            </div>
          </div>
        </Card>

        {/* Right card */}
        <Card title="Account details" className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="mt-1.5 block w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-sm"
              />
            </div>

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

            <Button type="submit" variant="primary" loading={loading} className="px-8">
              Update Profile details
            </Button>
          </form>
        </Card>

      </div>
    </div>
  );
};

export default Profile;
