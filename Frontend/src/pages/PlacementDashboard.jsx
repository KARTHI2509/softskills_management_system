/*
------------------------------------------------
File: PlacementDashboard.jsx
Purpose: Placement Officers metrics interface.
Responsibilities: Filters eligible students, compares departments, logs visits.
Dependencies: react, placementService, Card, Button, ChartsPlaceholder, LoadingSkeleton
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import placementService from '../services/placementService';
import Card from '../components/Card';
import Button from '../components/Button';
import ChartsPlaceholder from '../components/ChartsPlaceholder';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Award, Briefcase, GraduationCap, BarChart2, Filter } from 'lucide-react';

const PlacementDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [minCgpa, setMinCgpa] = useState(8.0);
  const [minScore, setMinScore] = useState(70);
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      placementService.getAnalytics(),
      placementService.getDepartmentComparison(),
      placementService.getEligibleStudents(minCgpa, minScore)
    ]).then(([analRes, compRes, eligRes]) => {
      if (analRes.success) setAnalytics(analRes.summary);
      if (compRes.success) setComparison(compRes.comparison);
      if (eligRes.success) setEligibleStudents(eligRes.students);
    })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = () => {
    setLoading(true);
    placementService.getEligibleStudents(minCgpa, minScore)
      .then(res => {
        if (res.success) setEligibleStudents(res.students);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  if (loading && !analytics) {
    return <LoadingSkeleton type="card" lines={4} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Placement Readiness Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Track aggregate college placement indexes and shortlist students matching recruiting metrics.</p>
      </div>

      {/* Analytics cards */}
      <div className="grid sm:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 text-blue-600 rounded-2xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Registered Students</p>
            <p className="text-2xl font-extrabold">{analytics?.totalRegistered || 120}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Placement Ready</p>
            <p className="text-2xl font-extrabold">{analytics?.placementReady || 85}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-rose-500/10 text-rose-600 rounded-2xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Upcoming Visits</p>
            <p className="text-2xl font-extrabold">{analytics?.upcomingVisits?.length || 2}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-4 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Top Dept</p>
            <p className="text-2xl font-extrabold">{analytics?.topDepartment || 'CSE'}</p>
          </div>
        </Card>
      </div>

      {/* Comparisons */}
      <Card title="Department-wise Readiness Comparisons">
        <ChartsPlaceholder 
          type="bar" 
          data={comparison.map(c => c.avg_placement_score) || [82, 75, 78, 68]} 
          labels={comparison.map(c => c.department) || ['CSE', 'ECE', 'EEE', 'MECH']} 
        />
      </Card>

      {/* Filters and Shortlists */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Filters */}
        <Card title="Filter Criteria" className="h-fit">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold">Minimum CGPA ({minCgpa})</label>
              <input 
                type="range" 
                min="5.0" 
                max="10.0" 
                step="0.1" 
                value={minCgpa} 
                onChange={e => setMinCgpa(parseFloat(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Min Placement Score ({minScore}%)</label>
              <input 
                type="range" 
                min="40" 
                max="100" 
                value={minScore} 
                onChange={e => setMinScore(parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <Button onClick={handleFilter} className="w-full flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" /> Filter Shortlist
            </Button>
          </div>
        </Card>

        {/* Shortlisted Student list */}
        <Card title="Eligible Candidates List" className="md:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 pb-3 text-slate-400">
                  <th className="py-3 font-semibold">Name</th>
                  <th className="py-3 font-semibold">Roll No</th>
                  <th className="py-3 font-semibold">Department</th>
                  <th className="py-3 font-semibold text-center">CGPA</th>
                  <th className="py-3 font-semibold text-center">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {eligibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400">No students match current metrics filter.</td>
                  </tr>
                ) : (
                  eligibleStudents.map((st, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 font-bold">{st.name}</td>
                      <td className="py-3 text-slate-400">{st.roll_no}</td>
                      <td className="py-3">{st.department}</td>
                      <td className="py-3 text-center font-semibold">{st.cgpa}</td>
                      <td className="py-3 text-center font-bold text-blue-600 dark:text-blue-400">{st.placement_score}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default PlacementDashboard;
