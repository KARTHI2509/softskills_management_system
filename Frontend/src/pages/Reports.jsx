/*
------------------------------------------------
File: Reports.jsx
Purpose: Analytical summaries visual representation.
Responsibilities: Gathers evaluation reports metrics.
Dependencies: react, axiosClient, Card
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import { BarChart3, FileText, Download, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/reports/monthly');
        if (res.data.success) {
          setStats(res.data.report);
        }
      } catch (err) {
        console.error('Failed to load progress reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Progress Reports</h1>
        <p className="text-slate-500 dark:text-slate-400">View your active training metrics, average grades, and completion counters in real time.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Scorecard card */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Placement Readiness Competency Breakdown">
            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading scorecard...</p>
            ) : stats ? (
              <div className="space-y-6">
                
                {/* 1. Quantitative & Logical */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Quantitative & Logical Aptitude</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">{stats.aptitude.average}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.aptitude.average}%` }}
                    />
                  </div>
                </div>

                {/* 2. Communication / Written */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Verbal Articulation / Written Answers</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">{stats.writtenAnswers.average}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.writtenAnswers.average}%` }}
                    />
                  </div>
                </div>

                {/* 3. Mock Interview */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">AI Mock Interviews Pitching</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">{stats.interview.average}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.interview.average}%` }}
                    />
                  </div>
                </div>

                {/* 4. Resume ATS */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Resume ATS Compatibility Grade</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">{stats.resume.average}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${stats.resume.average}%` }}
                    />
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No competency metrics recorded yet.</p>
            )}
          </Card>
        </div>

        {/* Right side stats card */}
        <div className="space-y-6">
          <Card title="Activity Completion Metrics">
            {loading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading completion logs...</p>
            ) : stats ? (
              <div className="space-y-4">
                
                <div className="p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Aptitude Tests Run</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {stats.aptitude.count} tests
                  </span>
                </div>

                <div className="p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Mock Interviews Uploaded</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {stats.interview.count} sessions
                  </span>
                </div>

                <div className="p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Resumes ATS Scanned</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    {stats.resume.count} files
                  </span>
                </div>

              </div>
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No completions recorded yet.</p>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Reports;

