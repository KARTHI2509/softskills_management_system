/*
------------------------------------------------
File: Aptitude.jsx
Purpose: Renders timed aptitude evaluations.
Responsibilities: Manages quiz questions, grades responses, saves statistics.
Dependencies: react, axiosClient, Card, Button, Skeletons
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { Timer, Award, CheckCircle, HelpCircle, FileText } from 'lucide-react';

const Aptitude = () => {
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState('QUANTITATIVE');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch questions when category changes or test starts
  const loadQuestions = async () => {
    try {
      const res = await axiosClient.get(`/aptitude/questions?category=${category}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [category]);

  const handleStart = () => {
    setStarted(true);
    setScore(null);
    setSubmitSuccess(false);
    setSelectedAnswers({});
    setWrittenAnswers({});
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const mcqQuestions = questions.filter(q => q.options && q.options.length > 0);
      const subjectiveQuestions = questions.filter(q => !q.options || q.options.length === 0);

      // 1. Grade and submit MCQ answers if any exist
      if (mcqQuestions.length > 0) {
        let correctCount = 0;
        mcqQuestions.forEach((q) => {
          const qId = q.question_id || q.id;
          if (selectedAnswers[qId] === q.correct_answer) {
            correctCount++;
          }
        });

        await axiosClient.post('/aptitude/submit', {
          score: correctCount,
          totalQuestions: mcqQuestions.length,
          category
        });
        setScore(`${correctCount} / ${mcqQuestions.length}`);
      }

      // 2. Submit subjective written responses if any exist
      if (subjectiveQuestions.length > 0) {
        const payload = subjectiveQuestions.map(q => {
          const qId = q.question_id || q.id;
          return {
            questionId: qId,
            submittedAnswer: writtenAnswers[qId] || ''
          };
        });

        await axiosClient.post('/aptitude/answers/submit', {
          answers: payload
        });
        setSubmitSuccess(true);
      }

      setStarted(false);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit answers. Check console logs.');
    } finally {
      setLoading(false);
    }
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
          {!started && score === null && !submitSuccess && (
            <Card title={`${category.toLowerCase()} Preparation Assessment`}>
              <p className="text-slate-500 mb-6">
                Evaluate your skill levels. Dynamic questions will be loaded directly from our database.
              </p>
              <Button onClick={handleStart} variant="primary" className="flex items-center gap-2">
                Start Timed Test
              </Button>
            </Card>
          )}

          {started && (
            <Card title={`${category} Module`}>
              <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl mb-6">
                <span className="text-xs font-bold text-slate-500">{questions.length} Questions loaded</span>
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                  <Timer className="w-4 h-4" /> 10:00 remaining
                </span>
              </div>

              <div className="space-y-8">
                {questions.map((q, idx) => {
                  const qId = q.question_id || q.id;
                  const isMCQ = q.options && q.options.length > 0;

                  return (
                    <div key={qId} className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <p className="font-semibold text-sm flex gap-2">
                        <span className="text-blue-500 font-bold">{idx + 1}.</span> {q.question_text}
                      </p>
                      
                      {isMCQ ? (
                        /* Render options buttons for multiple-choice */
                        <div className="grid grid-cols-2 gap-4">
                          {q.options.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setSelectedAnswers({ ...selectedAnswers, [qId]: opt })}
                              className={`p-3 text-xs font-semibold border rounded-xl text-left transition-all ${
                                selectedAnswers[qId] === opt 
                                  ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                                  : 'border-slate-200 dark:border-slate-800'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        /* Render subjective free-text inputs for subjective written questions */
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-400 uppercase">Write your response answer:</label>
                          <textarea
                            rows="4"
                            value={writtenAnswers[qId] || ''}
                            onChange={(e) => setWrittenAnswers({ ...writtenAnswers, [qId]: e.target.value })}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Type your explanation answer here..."
                          />
                        </div>
                      )}
                    </div>
                  );
                })}

                <Button onClick={handleSubmit} loading={loading} variant="primary" className="w-full">
                  Submit Test Answers
                </Button>
              </div>
            </Card>
          )}

          {(score !== null || submitSuccess) && !started && (
            <Card title="Test Submission Results">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center font-extrabold text-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Submission Graded Successfully</h3>
                  {score && <p className="text-sm font-bold mt-1">MCQ Score: <span className="text-blue-600">{score}</span></p>}
                  {submitSuccess && <p className="text-xs text-slate-400 mt-1">Your written subjective answers have been logged for faculty review.</p>}
                </div>
              </div>
              <Button onClick={handleStart} variant="outline" className="mt-6 w-full">
                Retry Test
              </Button>
            </Card>
          )}
        </div>

        {/* Categories Overview Selector */}
        <div className="space-y-6">
          <Card title="Select Test Category">
            <div className="space-y-2">
              {[
                { name: 'Quantitative Reasoning', value: 'QUANTITATIVE' },
                { name: 'Logical Fallacies', value: 'LOGICAL' },
                { name: 'Verbal Articulation', value: 'VERBAL' }
              ].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => { setCategory(cat.value); setScore(null); setSubmitSuccess(false); }}
                  className={`w-full p-3.5 border rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                    category === cat.value 
                      ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-bold uppercase">
                    Active
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Aptitude;
