/*
------------------------------------------------
File: Aptitude.jsx
Purpose: Renders timed aptitude evaluations.
Responsibilities: Manages quiz questions, grades responses, saves statistics.
Dependencies: react, Card, Button
------------------------------------------------
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { Timer, Award, CheckCircle, HelpCircle } from 'lucide-react';

const Aptitude = () => {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const questions = [
    { id: 1, text: 'Find the next term in: 3, 5, 9, 17, 33...', options: ['65', '60', '55', '50'], answer: '65' },
    { id: 2, text: 'A train 100m long passes a bridge in 10s at 72km/h. Bridge length is...', options: ['100m', '150m', '200m', '250m'], answer: '100m' }
  ];

  const handleStart = () => {
    setStarted(true);
    setScore(null);
  };

  const handleSubmit = () => {
    setLoading(true);
    // Grade mock answers
    setTimeout(() => {
      let correct = 0;
      questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.answer) correct++;
      });
      setScore(correct);
      setStarted(false);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Aptitude Practice Engine</h1>
        <p className="text-slate-500 dark:text-slate-400">Take timed tests across logical, quantitative, and verbal reasoning categories.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main evaluation screen */}
        <div className="md:col-span-2 space-y-6">
          {!started && score === null && (
            <Card title="Aptitude Preparation Assessment">
              <p className="text-slate-500 mb-6">Evaluate your logical skills with a 10-minute timed module assessment.</p>
              <Button onClick={handleStart} variant="primary" className="flex items-center gap-2">
                Start Timed Test
              </Button>
            </Card>
          )}

          {started && (
            <Card title="Logical Reasoning Module">
              <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl mb-6">
                <span className="text-xs font-bold text-slate-500">2 Questions</span>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Timer className="w-4 h-4" /> 09:42 remaining
                </span>
              </div>

              <div className="space-y-8">
                {questions.map((q) => (
                  <div key={q.id} className="space-y-4">
                    <p className="font-semibold text-sm flex gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /> {q.text}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: opt })}
                          className={`p-3 text-xs font-semibold border rounded-xl text-left transition-all ${
                            selectedAnswers[q.id] === opt 
                              ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <Button onClick={handleSubmit} loading={loading} variant="primary" className="w-full">
                  Submit Answers
                </Button>
              </div>
            </Card>
          )}

          {score !== null && !started && (
            <Card title="Test Summary Results">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-extrabold text-lg">
                  {score} / 2
                </div>
                <div>
                  <h3 className="font-bold text-sm">Graded Correct Answers</h3>
                  <p className="text-xs text-slate-400">Score has been synced with your placement readiness index rating.</p>
                </div>
              </div>
              <Button onClick={handleStart} variant="outline" className="mt-6 w-full">
                Retry Test
              </Button>
            </Card>
          )}
        </div>

        {/* Categories Overview */}
        <div className="space-y-6">
          <Card title="Question Bank Categories">
            <div className="space-y-2">
              {['Quantitative Reasoning', 'Logical Fallacies', 'Verbal Articulation'].map((cat, idx) => (
                <div key={idx} className="p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span>{cat}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">20 Qs</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Aptitude;
