/*
------------------------------------------------
File: MockInterview.jsx
Purpose: Handles video mock interview tasks.
Responsibilities: Integrates file uploads, calls AI evaluators, maps logs lists.
Dependencies: react, axiosClient, Card, Button, Skeletons
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Video, Upload, Play, CheckCircle } from 'lucide-react';

const MockInterview = () => {
  const [selectedQuestion, setSelectedQuestion] = useState('Tell me about yourself and your background.');
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleUpload = () => {
    setUploading(true);
    // Simulate API Cloudinary file upload + AI Evaluation parsing
    setTimeout(() => {
      setUploading(false);
      setFeedback({
        score: 85,
        strengths: ['Clear structure', 'Good vocabulary'],
        suggestions: ['Slow down your pace', 'Maintain better eye alignment']
      });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">AI Mock Interview Coach</h1>
        <p className="text-slate-500 dark:text-slate-400">Select placement questions, upload video pitches, and evaluate feedback metrics using the AI core engine.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Current Interview Prompt">
            <h2 className="text-xl font-bold bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl mb-6">"{selectedQuestion}"</h2>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center">
                <Video className="w-10 h-10 text-slate-400 mb-4" />
                <p className="font-semibold text-sm mb-2">Record or Select your video response file</p>
                <p className="text-xs text-slate-400 mb-6">Supports MP4, WebM up to 50MB</p>
                
                <Button onClick={handleUpload} loading={uploading} variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload response video
                </Button>
              </div>
            </div>
          </Card>

          {feedback && (
            <Card title="AI Feedback Report">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-extrabold text-2xl">
                    {feedback.score}%
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Overall Performance Rating</h3>
                    <p className="text-xs text-slate-400">Analysis resolved from speech pace, clarity, and keyword ratios.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-sm text-emerald-600 mb-3">Key Strengths</h4>
                    <ul className="space-y-2">
                      {feedback.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> {str}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-600 mb-3">Improvement Suggestions</h4>
                    <ul className="space-y-2">
                      {feedback.suggestions.map((sug, idx) => (
                        <li key={idx} className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {sug}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card title="Questions Library">
            <div className="space-y-3">
              {[
                'Tell me about yourself and your background.',
                'Why do you want to join our company?',
                'Explain a complex project you developed.',
                'What are your greatest professional strengths?'
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedQuestion(q); setFeedback(null); }}
                  className={`w-full text-left p-3 text-xs font-semibold rounded-xl transition-all border ${
                    selectedQuestion === q 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                      : 'border-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>

          <Card title="Interview History Logs">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-gray-100 dark:border-slate-800 pb-2.5">
                <div>
                  <p className="font-bold">Introduction prompt</p>
                  <p className="text-slate-400">Score: 82%</p>
                </div>
                <Button variant="outline" className="px-2.5 py-1 text-xs flex items-center gap-1">
                  <Play className="w-3 h-3" /> Watch
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default MockInterview;
