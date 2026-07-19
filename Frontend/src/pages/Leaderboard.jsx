/*
------------------------------------------------
File: Leaderboard.jsx
Purpose: Placement readiness rankings leaderboard.
Responsibilities: Lists top students sorted by readiness score.
Dependencies: react, axiosClient, Card
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import { Award, Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axiosClient.get('/aptitude/leaderboard');
        if (res.data.success) {
          setRanking(res.data.leaderboard);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

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
        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading rankings...</p>
        ) : ranking.length > 0 ? (
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
                {ranking.map((st, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 font-bold flex items-center gap-2">
                      {getRankIcon(idx + 1)} {idx + 1}
                    </td>
                    <td className="py-4 font-bold">{st.name}</td>
                    <td className="py-4 text-slate-400">{st.roll_no}</td>
                    <td className="py-4">{st.department}</td>
                    <td className="py-4 text-center font-extrabold text-blue-600 dark:text-blue-400">
                      {st.placement_score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-6 text-center">No student rankings recorded yet.</p>
        )}
      </Card>
    </div>
  );
};

export default Leaderboard;

