/*
------------------------------------------------
File: Notifications.jsx
Purpose: Unified platform notification lists.
Responsibilities: Manages list state, marks notifications as read.
Dependencies: react, Card, useAuth
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import { Bell, MailOpen, AlertCircle } from 'lucide-react';
import Button from '../components/Button';

const Notifications = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Your mock HR interview response has been graded by Trainer Srinivas.', date: '1 hour ago', read: false },
    { id: 2, text: 'New activity assigned: Aptitude assessment logical reasoning test.', date: 'Yesterday', read: true }
  ]);

  const markAllRead = () => {
    setMessages(messages.map(m => ({ ...m, read: true })));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight font-sans">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">Keep track of evaluations grades, activities postings, and feedback logs.</p>
        </div>
        <Button onClick={markAllRead} variant="outline" className="text-xs">
          Mark all as read
        </Button>
      </div>

      <Card title="Activity Alerts Inbox">
        <div className="space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`p-4 border rounded-2xl flex items-start gap-4 transition-all ${
                m.read 
                  ? 'border-slate-100 dark:border-slate-800 bg-transparent opacity-75' 
                  : 'border-blue-100 bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900/50'
              }`}
            >
              <div className={`p-2 rounded-xl mt-0.5 ${m.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-blue-500/10 text-blue-600'}`}>
                {m.read ? <MailOpen className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${m.read ? 'font-medium text-slate-600 dark:text-slate-400' : 'font-bold text-slate-800 dark:text-gray-200'}`}>
                  {m.text}
                </p>
                <span className="text-[10px] text-slate-400 font-bold block mt-1.5">{m.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;
