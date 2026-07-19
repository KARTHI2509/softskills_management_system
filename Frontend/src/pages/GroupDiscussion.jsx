/*
------------------------------------------------
File: GroupDiscussion.jsx
Purpose: Renders Group Discussion layouts.
Responsibilities: Models timers, topic lists, team configurations.
Dependencies: react, Card, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Users, Timer, HelpCircle, User } from 'lucide-react';

const GroupDiscussion = () => {
  const [topic, setTopic] = useState('Blockchain in Supply Chain Management');
  const [timer, setTimer] = useState(600); // 10 minutes

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Group Discussion Room</h1>
        <p className="text-slate-500 dark:text-slate-400">Join active discussions, view team slots allocations, and evaluate metrics templates.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Active Discussion Session">
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Current Topic</p>
                <h3 className="font-bold text-lg">{topic}</h3>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold">
                <Timer className="w-5 h-5" /> {formatTimer(timer)}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm">Participant Teams Assignment</h4>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Krishna Kumar (You)', roll: 'Slot 1' },
                  { name: 'Aditya Vardhan', roll: 'Slot 2' },
                  { name: 'Gowthami Reddy', roll: 'Slot 3' },
                  { name: 'Suhas K', roll: 'Slot 4' }
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{member.name}</p>
                      <p className="text-xs text-slate-400">{member.roll}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card title="Topic Suggestions">
            <div className="space-y-3">
              {[
                'Blockchain in Supply Chain Management',
                'Cryptocurrency regulation versus freedom',
                'AI impact on engineering roles',
                'Is work-from-home sustainable long term?'
              ].map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setTopic(t)}
                  className={`w-full text-left p-3 text-xs font-semibold rounded-xl transition-all border ${
                    topic === t 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                      : 'border-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Trainer Evaluation Rules">
            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p>Initiating: Introducing the topic clearly awards early points.</p>
              </div>
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p>Delivery: Keep voice modulation balanced and clear.</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default GroupDiscussion;
