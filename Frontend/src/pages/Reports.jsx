/*
------------------------------------------------
File: Reports.jsx
Purpose: Analytical summaries visual representation.
Responsibilities: Gathers evaluation reports metrics.
Dependencies: react, Card
------------------------------------------------
*/

import React from 'react';
import Card from '../components/Card';
import { BarChart3, FileText, Download } from 'lucide-react';
import Button from '../components/Button';

const Reports = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Progress Reports</h1>
        <p className="text-slate-500 dark:text-slate-400">View and export weekly performance metrics and department comparisons.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card title="Student Evaluation Report Summary">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-bold text-sm">Weekly Evaluation - Week 5</p>
                  <p className="text-xs text-slate-400">PDF Document • 1.2 MB</p>
                </div>
              </div>
              <Button variant="outline" className="px-3 py-1.5 text-xs flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Export
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Module Analytics Scorecard">
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Communication Aptitude</span>
              <span className="font-bold">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Group Discussions Rate</span>
              <span className="font-bold">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">Mock Interview Scores</span>
              <span className="font-bold text-emerald-600">82%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
