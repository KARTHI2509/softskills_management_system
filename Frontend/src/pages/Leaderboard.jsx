/*
------------------------------------------------
File: Leaderboard.jsx
Purpose: Placement readiness rankings leaderboard.
Responsibilities: Lists top students sorted by readiness score.
Dependencies: react, Card
------------------------------------------------
*/

import React from 'react';
import Card from '../components/Card';
import { Award, Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
  const ranking = [
    { rank: 1, name: 'Suhas K', score: 95, department: 'CSE', roll: '2026CSE042' },
    { rank: 2, name: 'Krishna Kumar', score: 82, department: 'CSE', roll: '2026CSE002' },
    { rank: 3, name: 'Gowthami Reddy', score: 78, department: 'ECE', roll: '2026ECE012' }
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    return <Award className="w-5 h-5 text-amber-600" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Placement Readiness Leaderboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Benchmark your placement readiness score against peers across all engineering departments.</p>
      </div>

      <Card title="Top Placement Readiness Rankings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 pb-3 text-slate-400">
                <th className="py-3 font-semibold">Rank</th>
                <th className="py-3 font-semibold">Name</th>
                <th className="py-3 font-semibold">Roll No</th>
                <th className="py-3 font-semibold">Department</th>
                <th className="py-3 font-semibold text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ranking.map((st) => (
                <tr key={st.rank} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 font-bold flex items-center gap-2">
                    {getRankIcon(st.rank)} {st.rank}
                  </td>
                  <td className="py-4 font-bold">{st.name}</td>
                  <td className="py-4 text-slate-400">{st.roll}</td>
                  <td className="py-4">{st.department}</td>
                  <td className="py-4 text-center font-extrabold text-blue-600 dark:text-blue-400">
                    {st.score}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
