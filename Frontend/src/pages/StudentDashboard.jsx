/*
------------------------------------------------
File: StudentDashboard.jsx
Purpose: Authenticated view for student portals.
Responsibilities: Displays placement metrics, charts, upcoming events.
Dependencies: react, studentService, Card, ChartsPlaceholder, LoadingSkeleton
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import studentService from '../services/studentService';
import Card from '../components/Card';
import ChartsPlaceholder from '../components/ChartsPlaceholder';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Award, Calendar, UserCheck, TrendingUp } from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getDashboardStats()
      .then(res => {
        if (res.success) setStats(res.stats);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <LoadingSkeleton type="card" lines={3} />
        <LoadingSkeleton type="card" lines={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {stats?.profile?.name || 'Krishna'}!</h1>
          <p className="text-slate-500 dark:text-slate-400">Here is your placement readiness check for this week.</p>
        </div>
        <div className="text-sm font-semibold px-4 py-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl">
          Roll No: {stats?.profile?.roll_no || '2026CSE042'}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Placement Score</p>
            <p className="text-2xl font-extrabold">{stats?.placementScore || 82}%</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Attendance Rate</p>
            <p className="text-2xl font-extrabold">{stats?.attendance || 94.5}%</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Aptitude Score</p>
            <p className="text-2xl font-extrabold">85/100</p>
          </div>
        </Card>
      </div>

      {/* Graphs */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card title="Weekly Score Analysis" className="h-fit">
          <ChartsPlaceholder type="line" data={[60, 65, 75, 78, 82]} labels={['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']} />
        </Card>
        <Card title="Monthly Category Analysis" className="h-fit">
          <ChartsPlaceholder type="bar" data={[85, 90, 78, 82]} labels={['Aptitude', 'Communication', 'GD', 'Mock Interview']} />
        </Card>
      </div>

      {/* Sub Grids */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card title="Upcoming Activities">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <p className="font-bold text-sm">Elevator Pitch Video Upload</p>
                <p className="text-xs text-slate-400">Communication Skills activity</p>
              </div>
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Due in 2 days
              </span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <div>
                <p className="font-bold text-sm">Quantitative Test - Ratios</p>
                <p className="text-xs text-slate-400">Aptitude training exercise</p>
              </div>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Scheduled for Friday
              </span>
            </div>
          </div>
        </Card>

        <Card title="Trainer Feedback & Review">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
              <p className="text-sm font-semibold">"Krishna showed strong technical content during the Mock HR interview. Focus slightly on maintaining eye contact and refining sentence structuring during stress questions."</p>
              <p className="text-xs text-slate-400 mt-2 font-bold">— Trainer Srinivas (Mock Interview HR)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
