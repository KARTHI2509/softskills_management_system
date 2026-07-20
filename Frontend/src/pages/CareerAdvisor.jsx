/*
------------------------------------------------
File: CareerAdvisor.jsx
Purpose: Renders the AI Career Advisor chat interface.
Responsibilities: Manages chat prompting dialogue feeds, displays AI roadmaps.
Dependencies: react, axiosClient, Card, Button, Lucide icons
------------------------------------------------
*/

import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { Send, Compass, UserCheck, Code, Award, Loader2 } from 'lucide-react';

const CareerAdvisor = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState([
    {
      role: 'advisor',
      text: 'Hello! I am your SkillForge AI Career Advisor. Ask me anything about resume improvements, mock interview techniques, daily learning roadmaps, or placement suggestions!'
    }
  ]);

  const handleAsk = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const query = customPrompt || prompt;
    if (!query.trim() || loading) return;

    setLoading(true);
    setPrompt('');
    
    // Add student message to log
    setChatLog(prev => [...prev, { role: 'student', text: query }]);

    try {
      const res = await axiosClient.post('/advisor/ask', { prompt: query });
      if (res.data.success) {
        setChatLog(prev => [...prev, { role: 'advisor', text: res.data.answer }]);
      }
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { role: 'advisor', text: 'Sorry, I encountered an issue fetching career recommendations. Check your connection or API keys.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    { title: 'What should I improve?', desc: 'Check dynamic placement scorecard suggestions.', icon: Compass },
    { title: 'Which company suits me?', desc: 'Check eligibility match ratings.', icon: UserCheck },
    { title: 'Resume review & suggestions', desc: 'ATS format optimizations.', icon: Code },
    { title: 'HR & Technical interview tips', desc: 'Mock interview grading feedback.', icon: Award }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">AI Career Advisor</h1>
        <p className="text-slate-500 dark:text-slate-400">Receive personalized learning roadmaps, company eligibility suggestions, and resume improvements dynamically.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Chat Feed */}
        <div className="md:col-span-2 space-y-4 flex flex-col h-[550px]">
          <Card className="flex-1 flex flex-col overflow-hidden p-0 rounded-3xl border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Active Guidance Session</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs">
              {chatLog.map((chat, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${chat.role === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl leading-relaxed whitespace-pre-line font-medium ${
                    chat.role === 'student'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200/50 dark:border-slate-800/50'
                  }`}>
                    {chat.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Footer Input */}
            <form onSubmit={(e) => handleAsk(e)} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-transparent flex gap-3">
              <input
                type="text"
                required
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ask me about interview tips, eligibility, roadmap..."
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Button type="submit" variant="primary" className="p-3 rounded-2xl shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>

        {/* Suggestion Prompts */}
        <div className="space-y-4">
          <Card title="Quick Inquiries" className="h-full">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Click template prompt to ask AI:</p>
            <div className="space-y-3">
              {suggestions.map((sug, idx) => {
                const Icon = sug.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAsk(null, sug.title)}
                    className="w-full text-left p-3.5 border border-slate-100 dark:border-slate-800/50 hover:border-blue-600 rounded-2xl flex items-start gap-3 transition-all hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{sug.title}</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">{sug.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default CareerAdvisor;
