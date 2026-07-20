/*
------------------------------------------------
File: MockInterview.jsx
Purpose: Handles video mock interview tasks and AI feedback.
Responsibilities: Integrates file uploads, calls AI evaluators, maps logs lists.
Dependencies: react, axiosClient, lucide-react, react-router-dom
------------------------------------------------
*/

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Video, Upload, CheckCircle, FileText, Sparkles, HelpCircle, 
  Play, Star, ArrowRight, Lightbulb, AlertCircle, ChevronRight, MoreVertical, X 
} from 'lucide-react';

// Reusable Circular Gauge Sub-component
const CircularProgress = ({ percent, label, rating, colorClass, strokeColor }) => {
  const radius = 36;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(30, 41, 59, 0.4)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute text-[13px] font-black text-slate-800 dark:text-white">{percent}%</span>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className={`text-[9px] font-black tracking-wider uppercase ${colorClass}`}>{rating}</p>
      </div>
    </div>
  );
};

const MockInterview = () => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState({
    text: 'Tell me about yourself and your background.',
    category: 'Behavioral'
  });
  
  const [questions, setQuestions] = useState([
    { text: 'Tell me about yourself and your background.', category: 'Behavioral', starred: true },
    { text: 'Why do you want to join our company?', category: 'Behavioral', starred: false },
    { text: 'Explain a complex project you developed.', category: 'Technical', starred: false },
    { text: 'What are your greatest professional strengths?', category: 'Behavioral', starred: false },
    { text: 'Where do you see yourself in 5 years?', category: 'Behavioral', starred: false }
  ]);

  const [history, setHistory] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [writtenPitch, setWrittenPitch] = useState('');
  
  // Modals & Panels toggle states
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  
  const [feedback, setFeedback] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch student interview logs
  const fetchHistory = () => {
    axiosClient.get('/mock-interview/history')
      .then(res => {
        if (res.data.success) {
          setHistory(res.data.history);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer logic for simulated recording
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    setFeedback(null);
    setVideoUrl(null);

    try {
      const uploadRes = await axiosClient.post('/mock-interview/upload-recording', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (uploadRes.data.success) {
        const interview = uploadRes.data.interview;
        setVideoUrl(interview.recording_url);

        const evalRes = await axiosClient.post('/mock-interview/ai-evaluate', {
          interviewId: interview.interview_id,
          questionText: selectedQuestion.text,
          responseText: writtenPitch || 'Response pitch mapped from uploaded video recording files.'
        });

        if (evalRes.data.success) {
          setFeedback(evalRes.data.feedback);
          fetchHistory();
        }
      }
    } catch (err) {
      console.error('Mock Interview video evaluation failed:', err);
      alert('Upload evaluation failed. Please make sure the backend is active.');
    } finally {
      setUploading(false);
    }
  };

  const handleTextEvaluate = async () => {
    if (!writtenPitch.trim()) return;

    setUploading(true);
    setFeedback(null);
    setVideoUrl(null);

    try {
      const evalRes = await axiosClient.post('/mock-interview/ai-evaluate', {
        interviewId: '00000000-0000-0000-0000-000000000000',
        questionText: selectedQuestion.text,
        responseText: writtenPitch
      });

      if (evalRes.data.success) {
        setFeedback(evalRes.data.feedback);
        fetchHistory();
      }
    } catch (err) {
      console.error('Text evaluation failed:', err);
      alert('AI evaluation failed. Please ensure the backend is connected.');
    } finally {
      setUploading(false);
    }
  };

  const addCustomQuestion = () => {
    const text = prompt('Enter your custom interview question:');
    if (text && text.trim()) {
      const newQ = { text: text.trim(), category: 'Custom', starred: false };
      setQuestions([...questions, newQ]);
      setSelectedQuestion(newQ);
    }
  };

  const changeQuestion = () => {
    const currentIndex = questions.findIndex(q => q.text === selectedQuestion.text);
    const nextIndex = (currentIndex + 1) % questions.length;
    setSelectedQuestion(questions[nextIndex]);
    setFeedback(null);
    setVideoUrl(null);
    setShowGuidelines(false);
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setFeedback(null);
      setVideoUrl(null);
    } else {
      setRecording(false);
      // Auto-populate response transcript and trigger AI evaluation
      const transcript = "Hi, my name is Krishna. I am a Computer Science major. I have worked on multiple full-stack React projects utilizing Node.js Express microservices and relational PostgreSQL databases. I have practiced keeping my coding clear, modular, and structured using the STAR method.";
      setWrittenPitch(transcript);
      
      // Auto trigger evaluation
      setUploading(true);
      setTimeout(async () => {
        try {
          const evalRes = await axiosClient.post('/mock-interview/ai-evaluate', {
            interviewId: '00000000-0000-0000-0000-000000000000',
            questionText: selectedQuestion.text,
            responseText: transcript
          });

          if (evalRes.data.success) {
            setFeedback(evalRes.data.feedback);
            fetchHistory();
          }
        } catch (err) {
          console.error(err);
        } finally {
          setUploading(false);
        }
      }, 1000);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const datePart = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return `${datePart} • ${timePart}`;
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Upgrade to Pro Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-2">
              <span className="inline-block p-3 bg-amber-500/10 text-amber-500 rounded-full border border-amber-500/20">
                <Star className="w-8 h-8 fill-current" />
              </span>
              <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">Upgrade to Pro</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Unlock detailed speech tone analyses, infinite questions libraries, and resume alignment metrics.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/50 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 font-semibold">
              <p className="flex items-center gap-2">✓ Advanced Speech Rhythm Analysis</p>
              <p className="flex items-center gap-2">✓ Dynamic Real-Time Grammar Checks</p>
              <p className="flex items-center gap-2">✓ Tailored Faculty Mentorship Sessions</p>
            </div>
            <button 
              onClick={() => { setShowUpgradeModal(false); alert('Payment gateway simulation complete. Welcome to Pro!'); }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl transition-colors shadow-lg shadow-blue-500/10"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      )}

      {/* AI Coach Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
            <button 
              onClick={() => setShowTipsModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-850 dark:text-white">AI Coach Tips Library</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Expert guidelines for passing placement check modules.</p>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350">
                <p className="font-extrabold text-blue-500 mb-1">STAR Framework</p>
                Describe the Situation, Task assigned, Action taken, and Results obtained clearly. Focus on results!
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350">
                <p className="font-extrabold text-purple-500 mb-1">Fluency & Pace</p>
                Aim for a word speed rate between 130 and 150 words per minute. Avoid long pauses or filler words.
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-350">
                <p className="font-extrabold text-emerald-500 mb-1">Camera Presence</p>
                Keep eye levels centered, look straight at the webcam, and sit in a well-lit workspace.
              </div>
            </div>
            <button 
              onClick={() => setShowTipsModal(false)}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-extrabold text-sm rounded-2xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Mock Interview Coach</h1>
          <Sparkles className="w-6 h-6 text-blue-500 animate-pulse mt-1" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5">
          Select placement questions, record video pitches, or submit written answers to get live AI metrics.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Prompts and Uploads */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Current Prompt */}
          <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-sm text-slate-450 dark:text-slate-400 uppercase tracking-wider">Current Interview Prompt</h3>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/15 rounded-full text-[10px] font-black tracking-wider uppercase">
                  {selectedQuestion.category}
                </span>
              </div>
              <button 
                onClick={changeQuestion}
                className="text-xs font-black bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-xl text-slate-655 dark:text-slate-300 transition-colors shadow-sm"
              >
                Change Question
              </button>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-800/40 rounded-2xl flex justify-between items-center mb-4">
              <div className="flex items-start gap-4">
                <span className="text-4xl font-serif text-slate-350 dark:text-slate-700 select-none">“</span>
                <p className="text-lg font-black text-slate-850 dark:text-slate-200 mt-1 leading-snug">
                  {selectedQuestion.text}
                </p>
              </div>
              <button 
                onClick={() => setShowGuidelines(!showGuidelines)}
                className="flex items-center gap-1.5 text-xs font-black text-slate-450 hover:text-blue-500 transition-colors shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{showGuidelines ? 'Hide Guidelines' : 'View Guidelines'}</span>
              </button>
            </div>

            {/* Inline Guidelines Section */}
            {showGuidelines && (
              <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/15 mb-6 text-xs text-slate-700 dark:text-slate-400 space-y-2 leading-relaxed">
                <p className="font-extrabold text-blue-550 dark:text-blue-400">💡 Guidelines for answering:</p>
                <p>1. **Situation**: Set the context of the story in 1-2 sentences.</p>
                <p>2. **Task**: Define the objective or challenge you faced.</p>
                <p>3. **Action**: Describe *your* specific actions and layout solutions.</p>
                <p>4. **Result**: State the measurable impact and results (e.g. "improved speed by 20%").</p>
              </div>
            )}

            {/* Video Input Frame */}
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-slate-50/20 dark:bg-slate-950/10 relative overflow-hidden">
                <div className={`p-4 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/15 mb-4 relative ${recording ? 'text-rose-500 bg-rose-500/10 animate-pulse' : ''}`}>
                  <Video className="w-8 h-8" />
                </div>
                
                {recording ? (
                  <div className="space-y-3">
                    <p className="font-extrabold text-sm text-rose-500 flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                      Live Recording: {formatTimer(recordTime)}
                    </p>
                    <p className="text-xs text-slate-400 font-semibold">Speak clearly. Click Stop when complete to auto-analyze transcript.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Record or Select your video response</p>
                    <p className="text-xs text-slate-450 font-bold">Supports MP4, WebM up to 50MB</p>
                  </div>
                )}
                
                {/* Action controls */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                  <button 
                    onClick={toggleRecording}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-black uppercase shadow transition-all ${
                      recording 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full bg-white ${recording ? 'animate-pulse' : ''}`} />
                    {recording ? 'Stop Recording' : 'Start Recording'}
                  </button>

                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="video/*"
                    className="hidden" 
                  />
                  <button 
                    onClick={triggerFileSelect}
                    disabled={uploading || recording}
                    className="flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Video
                  </button>
                </div>
              </div>

              {/* Text pitching */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Or write your verbal answer pitch instead!
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    {writtenPitch.length}/2000 characters
                  </span>
                </div>
                <textarea
                  rows="5"
                  value={writtenPitch}
                  onChange={(e) => setWrittenPitch(e.target.value.slice(0, 2000))}
                  placeholder="Type or copy-paste your spoken response pitch here to test your vocabulary..."
                  className="w-full px-4 py-4 border border-slate-200 dark:border-slate-800/80 dark:bg-[#0a0f1d] bg-transparent rounded-2xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none placeholder-slate-400 text-slate-800 dark:text-slate-200"
                />
                
                <div className="flex justify-between items-center pt-2">
                  <button 
                    onClick={() => setShowTipsModal(true)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-450 hover:text-blue-500 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Tips for better answers</span>
                  </button>
                  
                  <button 
                    onClick={handleTextEvaluate} 
                    disabled={!writtenPitch.trim() || uploading || recording} 
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/10 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze with AI
                  </button>
                </div>
              </div>
            </div>
          </div>

          {videoUrl && (
            <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 mb-4">Uploaded Video Playback</h3>
              <video src={videoUrl} controls className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md" />
            </div>
          )}

          {/* AI Performance Evaluation Report */}
          {feedback && (
            <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-150 dark:border-slate-800/50">
                <div className="h-20 w-20 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-extrabold text-2xl border border-blue-500/15">
                  {feedback.score}%
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-850 dark:text-white">AI Overall Performance Rating</h3>
                  <p className="text-xs text-slate-400 mt-1">Analysis resolved from speech pace, vocabulary structure, and keyword density.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-center pb-2">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-150 dark:border-slate-800/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grammar Score</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{feedback.grammarScore}%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-150 dark:border-slate-800/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clarity Score</p>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{feedback.pronunciationScore}%</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-150 dark:border-slate-800/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verdict Rating</p>
                  <p className={`text-2xl font-black ${feedback.score >= 70 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {feedback.score >= 70 ? 'PASS' : 'RETRY'}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-150 dark:border-slate-800/50">
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {feedback.strengths?.map((str, idx) => (
                      <li key={idx} className="text-xs font-semibold text-slate-655 dark:text-slate-300 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-2" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-4.5 h-4.5 text-amber-500" />
                    Improvement Areas
                  </h4>
                  <ul className="space-y-2">
                    {feedback.suggestions?.map((sug, idx) => (
                      <li key={idx} className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-2" />
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* AI Performance Preview (Real-time Analysis Gauges) */}
          <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">AI Performance Preview</h3>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 rounded-full text-[10px] font-black tracking-wider uppercase">
                  Real-time Analysis
                </span>
              </div>
              <select className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 px-3.5 rounded-xl text-slate-600 dark:text-slate-300">
                <option>Sample Metrics</option>
                <option>Latest Session</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2">
              <CircularProgress percent={feedback?.pronunciationScore || 85} label="Clarity" rating="Good" colorClass="text-blue-500" strokeColor="#3b82f6" />
              <CircularProgress percent={feedback?.grammarScore || 80} label="Relevance" rating="Good" colorClass="text-emerald-500" strokeColor="#10b981" />
              <CircularProgress percent={feedback ? Math.round(feedback.score * 0.9) : 75} label="Confidence" rating="Average" colorClass="text-amber-500" strokeColor="#f59e0b" />
              <CircularProgress percent={88} label="Body Lang" rating="Excellent" colorClass="text-purple-500" strokeColor="#8b5cf6" />
              <CircularProgress percent={feedback?.score || 82} label="Fluency" rating="Good" colorClass="text-teal-500" strokeColor="#14b8a6" />
            </div>

            <div className="p-3 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-center gap-2.5 text-[11px] font-semibold text-slate-450 dark:text-slate-400">
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span>These are sample metrics. Record or submit your response to get real AI feedback.</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Question bank, session list, tips */}
        <div className="space-y-6">
          
          {/* Card: Questions Library */}
          <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Questions Library</h3>
              <button onClick={() => navigate('/reports')} className="text-xs font-black text-blue-500 hover:underline">View All</button>
            </div>
            
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => { 
                    setSelectedQuestion(q); 
                    setFeedback(null); 
                    setVideoUrl(null); 
                    setShowGuidelines(false);
                  }}
                  className={`w-full text-left p-3.5 text-xs font-bold rounded-2xl transition-all border flex items-center justify-between gap-3 group ${
                    selectedQuestion.text === q.text 
                      ? 'border-blue-600 bg-blue-500/5 text-blue-600 dark:text-blue-400 shadow-md' 
                      : 'border-slate-100 dark:border-slate-800/80 dark:hover:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-355'
                  }`}
                >
                  <span className="truncate pr-2 leading-relaxed">{q.text}</span>
                  <Star className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    selectedQuestion.text === q.text || q.starred
                      ? 'fill-amber-500 text-amber-500' 
                      : 'text-slate-300 dark:text-slate-650'
                  }`} />
                </button>
              ))}
            </div>

            <button 
              onClick={addCustomQuestion}
              className="w-full mt-5 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>+</span> Add Custom Question
            </button>
          </div>

          {/* Card: Interview History Logs */}
          <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">Interview History Logs</h3>
              <button onClick={() => navigate('/reports')} className="text-xs font-black text-blue-500 hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {history.length > 0 ? (
                history.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        idx % 2 === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'
                      }`}>
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
                          {selectedQuestion.text}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        item.score >= 80 
                          ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15' 
                          : 'bg-blue-500/10 text-blue-550 dark:bg-blue-500/15 dark:text-blue-400'
                      }`}>
                        Score: {item.score}%
                      </span>
                      <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Introduction prompt</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">May 20, 2025 • 10:35 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15">
                        Score: 82%
                      </span>
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Why our company?</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">May 18, 2025 • 03:20 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-550 dark:bg-blue-500/15 dark:text-blue-400">
                        Score: 78%
                      </span>
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-850">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-500/10 text-purple-500 rounded-xl">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200">Project explanation</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">May 16, 2025 • 11:15 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/15">
                        Score: 85%
                      </span>
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => navigate('/reports')}
              className="w-full mt-4 text-center text-xs font-bold text-blue-500 hover:underline flex items-center justify-center gap-1"
            >
              View Full History <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card: AI Coach Tips */}
          <div className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-100">AI Coach Tips</h3>
              <span className="px-3 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/15 rounded-full text-[9px] font-black tracking-wider uppercase">
                New Tip
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 bg-blue-500/10 text-blue-500 border border-blue-500/15 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-150 dark:border-slate-800/40 relative">
                <p className="text-xs font-black text-slate-800 dark:text-slate-250">Good morning, Krishna! 👋</p>
                <p className="text-[11px] font-medium leading-relaxed text-slate-600 dark:text-slate-400 mt-1">
                  Remember to structure your answer using STAR (Situation, Task, Action, Result) for behavioral questions.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-slate-150 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-655 dark:text-slate-300">
                <span className="p-1 bg-slate-100 dark:bg-slate-850 rounded text-slate-400">📹</span>
                <span>Maintain eye contact with the camera.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-655 dark:text-slate-300">
                <span className="p-1 bg-slate-100 dark:bg-slate-850 rounded text-slate-400">🔑</span>
                <span>Keep your answers concise and structured.</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-slate-655 dark:text-slate-300">
                <span className="p-1 bg-slate-100 dark:bg-slate-850 rounded text-slate-400">🎯</span>
                <span>Use specific examples to demonstrate impact.</span>
              </div>
            </div>

            <button 
              onClick={() => setShowTipsModal(true)}
              className="w-full text-center text-xs font-bold text-blue-500 hover:underline flex items-center justify-center gap-1 pt-2"
            >
              View All Tips <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MockInterview;
