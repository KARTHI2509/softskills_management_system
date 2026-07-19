/*
------------------------------------------------
File: FacultyDashboard.jsx
Purpose: Core view for faculty evaluations.
Responsibilities: Assigns activities, grades students, reviews submissions.
Dependencies: react, facultyService, Card, Button, LoadingSkeleton
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import facultyService from '../services/facultyService';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Users, ClipboardList, PlusCircle, CheckSquare } from 'lucide-react';

const FacultyDashboard = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [assignTitle, setAssignTitle] = useState('');
  const [category, setCategory] = useState('COMMUNICATION');
  
  useEffect(() => {
    facultyService.getPendingEvaluations()
      .then(res => {
        if (res.success) setPending(res.pending);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!assignTitle) return;
    facultyService.assignActivity({
      title: assignTitle,
      due_date: new Date(Date.now() + 86400000 * 3), // 3 days from now
      category
    }).then(() => {
      alert('Activity assigned successfully!');
      setAssignTitle('');
    }).catch(console.error);
  };

  if (loading) {
    return <LoadingSkeleton type="list" lines={4} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Faculty Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Evaluate submissions, assign training activities, and manage Group Discussions.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Pending Evaluations</p>
            <p className="text-2xl font-extrabold">{pending.length}</p>
          </div>
        </Card>
        
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Students Tracked</p>
            <p className="text-2xl font-extrabold">42</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Activities Created</p>
            <p className="text-2xl font-extrabold">8</p>
          </div>
        </Card>
      </div>

      {/* Main Controls Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Assign Activity Form */}
        <Card title="Assign New Soft Skill Activity">
          <form onSubmit={handleCreateActivity} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Activity Title</label>
              <input 
                type="text" 
                required 
                value={assignTitle} 
                onChange={e => setAssignTitle(e.target.value)}
                placeholder="e.g. 1-Minute Pitch Video" 
                className="mt-1.5 block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Training Category</label>
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="mt-1.5 block w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl text-sm"
              >
                <option value="COMMUNICATION">Communication</option>
                <option value="MOCK_INTERVIEW">Mock Interview</option>
                <option value="GD">Group Discussion</option>
                <option value="APTITUDE">Aptitude</option>
              </select>
            </div>
            <Button type="submit" variant="primary" className="w-full flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Assign to Batch
            </Button>
          </form>
        </Card>

        {/* Pending Evaluations list */}
        <Card title="Pending Evaluations Queue">
          <div className="space-y-4">
            {pending.map((item) => (
              <div key={item.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-gray-200">{item.studentName}</p>
                  <p className="text-xs text-slate-400">{item.activityTitle}</p>
                </div>
                <Button variant="outline" className="px-4 py-1.5 text-xs font-bold">
                  Evaluate
                </Button>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default FacultyDashboard;
