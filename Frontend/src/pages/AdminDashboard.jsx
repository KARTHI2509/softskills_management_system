/*
------------------------------------------------
File: AdminDashboard.jsx
Purpose: Global settings and user authorization.
Responsibilities: Manages user accounts listings, updates role states.
Dependencies: react, Card, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Shield, Settings, Users, Server, Database } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Krishna Kumar', email: 'student@college.edu', role: 'STUDENT', department: 'CSE' },
    { id: 2, name: 'Professor Srinivas', email: 'faculty@college.edu', role: 'FACULTY', department: 'CSE' },
    { id: 3, name: 'TPO Ramesh', email: 'placement@college.edu', role: 'PLACEMENT_OFFICER', department: 'TPO' }
  ]);

  const [maintMode, setMaintMode] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">System Administration</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure global rules, manage user roles, audit queries execution rates, and toggle maintenance modes.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 text-purple-600 rounded-2xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">System Status</p>
            <p className="text-xl font-extrabold text-emerald-500">Operational</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Accounts</p>
            <p className="text-xl font-extrabold">168</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">API Endpoints</p>
            <p className="text-xl font-extrabold">46 Active</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">DB Pool</p>
            <p className="text-xl font-extrabold">Connected</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User Manager */}
        <Card title="User Accounts Directory" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 pb-3 text-slate-400">
                  <th className="py-3 font-semibold">Name</th>
                  <th className="py-3 font-semibold">Email</th>
                  <th className="py-3 font-semibold">Role</th>
                  <th className="py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3.5 font-bold">{u.name}</td>
                    <td className="py-3.5 text-slate-500">{u.email}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg uppercase tracking-wider">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <Button variant="outline" className="px-3 py-1 text-xs">Modify</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Configurations Settings */}
        <Card title="Global Flags Configurations">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">System Maintenance Mode</p>
                <p className="text-xs text-slate-400">Halts non-admin API writes.</p>
              </div>
              <input 
                type="checkbox" 
                checked={maintMode} 
                onChange={() => setMaintMode(!maintMode)} 
                className="w-5 h-5 cursor-pointer accent-blue-600" 
              />
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button variant="outline" className="w-full justify-center">
                Backup Database Schema
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
