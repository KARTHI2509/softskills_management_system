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

      {/* Daily Challenges & Learning System Module */}
      <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Card title="Daily Vocabulary" className="md:col-span-1 border-amber-200/50 dark:border-amber-950/50 bg-amber-500/5">
          <span className="px-2.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-bold uppercase tracking-wider">Word of the Day</span>
          <h3 className="text-lg font-black text-amber-700 dark:text-amber-400 mt-2.5">Pernicious</h3>
          <p className="text-[10px] text-slate-500 italic mt-0.5">Adjective · /pəˈnɪʃ.əs/</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed font-semibold">Having a harmful effect, especially in a gradual or subtle way.</p>
          <div className="mt-4 p-2.5 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            "The influence of pernicious habits on soft skill preparations."
          </div>
        </Card>

        <Card title="Aptitude Challenge" className="md:col-span-2">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-blue-500 text-white rounded text-[9px] font-bold uppercase tracking-wider">Daily Logical Puzzle</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold mt-2.5 leading-relaxed">A clock strikes once at 1 o'clock, twice at 2 o'clock, and so on. How many times will it strike in 24 hours?</p>
            <div className="grid grid-cols-2 gap-3 mt-5 text-xs font-bold uppercase">
              <button 
                onClick={() => alert('Incorrect. Try again!')} 
                className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-colors"
              >
                A) 78 Times
              </button>
              <button 
                onClick={() => alert('Correct! In 12 hours it strikes 78 times, so in 24 hours it strikes 156 times.')} 
                className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-colors"
              >
                B) 156 Times
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
