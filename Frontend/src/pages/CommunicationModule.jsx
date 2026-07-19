/*
------------------------------------------------
File: CommunicationModule.jsx
Purpose: Renders reading, vocabulary, and delivery modules.
Responsibilities: Lists exercises, captures speech/text inputs, outputs metrics.
Dependencies: react, Card, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { BookOpen, Volume2, Award } from 'lucide-react';

const CommunicationModule = () => {
  const [activeTab, setActiveTab] = useState('reading');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Communication Module</h1>
        <p className="text-slate-500 dark:text-slate-400">Practice vocabulary, reading articulation, and structural speaking models.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-px">
        {['reading', 'speaking', 'vocabulary'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSubmitted(false); }}
            className={`pb-3 text-sm font-bold border-b-2 capitalize transition-all ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Module Content */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'reading' && (
            <Card title="Active Reading Passage Placement">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium mb-6">
                "Effective active communication is not merely about conveying information clearly. It is equally dependent on active listening, ensuring that messages are decoded and digested with empathy and clear intent before response triggers are launched."
              </p>
              
              {!submitted ? (
                <div className="space-y-4">
                  <p className="font-semibold text-sm">Summarize the core message of the passage in one sentence:</p>
                  <textarea rows="3" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-xl text-sm" placeholder="Type summarize answer..."></textarea>
                  <Button onClick={() => setSubmitted(true)} variant="primary">Submit Summary</Button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-2xl flex items-center gap-4">
                  <Award className="w-8 h-8 text-emerald-500" />
                  <div>
                    <p className="font-bold text-sm">Passage Summary Evaluated</p>
                    <p className="text-xs">Score: 92/100. Strong keyword usage matched.</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'speaking' && (
            <Card title="Oral Pitch Practice">
              <p className="text-slate-500 mb-6">Read the following prompt aloud. Press record to capture audio feedback.</p>
              <h3 className="font-bold text-lg mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">"Why should we select you over other candidates with similar CGPAs?"</h3>
              
              <div className="flex gap-4">
                <Button variant="primary" className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" /> Start Audio Capture
                </Button>
                <Button variant="outline">Skip Prompt</Button>
              </div>
            </Card>
          )}

          {activeTab === 'vocabulary' && (
            <Card title="Contextual Synonym Drills">
              <p className="text-slate-500 mb-6">Find the word that best substitutes for the highlighted term.</p>
              <p className="font-medium bg-slate-50 dark:bg-slate-900 p-4 rounded-xl mb-6">"The executive's explanation was **lucid**, leaving no room for query doubts."</p>
              
              <div className="grid grid-cols-2 gap-4">
                {['Ambiguous', 'Clear', 'Tense', 'Elaborate'].map((opt) => (
                  <Button 
                    key={opt} 
                    variant="outline" 
                    onClick={() => alert(opt === 'Clear' ? 'Correct answer!' : 'Incorrect. Try again.')}
                    className="justify-center py-3"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Modules Stats */}
        <Card title="Progress overview" className="h-fit">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-semibold">Exercises completed</span>
              <span className="font-bold">12 / 20</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-semibold">Average Accuracy</span>
              <span className="font-bold text-blue-600">88%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400 font-semibold">Module Badge</span>
              <span className="font-bold text-amber-500"> Silver Speaker</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunicationModule;
