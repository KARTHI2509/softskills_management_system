/*
------------------------------------------------
File: MockInterview.jsx
Purpose: Handles video mock interview tasks.
Responsibilities: Integrates file uploads, calls AI evaluators, maps logs lists.
Dependencies: react, axiosClient, Card, Button, Skeletons
------------------------------------------------
*/

import React, { useState, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import Card from '../components/Card';
import Button from '../components/Button';
import { Video, Upload, Play, CheckCircle, FileText } from 'lucide-react';

const MockInterview = () => {
  const [selectedQuestion, setSelectedQuestion] = useState('Tell me about yourself and your background.');
  const [uploading, setUploading] = useState(false);
  const [writtenPitch, setWrittenPitch] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  
  const fileInputRef = useRef(null);

  // Triggers hidden input click
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Handles real video upload + evaluation flow
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    setFeedback(null);
    setVideoUrl(null);

    try {
      // 1. Upload video file to Backend (which forwards to Cloudinary/Fallback)
      const uploadRes = await axiosClient.post('/mock-interview/upload-recording', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (uploadRes.data.success) {
        const interview = uploadRes.data.interview;
        setVideoUrl(interview.video_url);

        // 2. Trigger AI evaluations
        const evalRes = await axiosClient.post('/mock-interview/ai-evaluate', {
          interviewId: interview.interview_id,
          questionText: selectedQuestion,
          responseText: writtenPitch || 'Simulated response pitch based on video audio content.'
        });

        if (evalRes.data.success) {
          setFeedback(evalRes.data.feedback);
        }
      }
    } catch (err) {
      console.error('Mock Interview evaluation failed:', err);
      alert('Upload failed. Please ensure Backend server is running.');
    } finally {
      setUploading(false);
    }
  };

  // Evaluates text pitch without uploading a video
  const handleTextEvaluate = async () => {
    if (!writtenPitch.trim()) return;

    setUploading(true);
    setFeedback(null);
    setVideoUrl(null);

    try {
      // Create a mock interview record with empty video link
      const uploadRes = await axiosClient.post('/mock-interview/upload-recording', null, {
        headers: { 'Content-Type': 'multipart/form-data' } // Empty file body
      });
    } catch (err) {
      // Fallback: Create mock interview evaluation directly
      try {
        const evalRes = await axiosClient.post('/mock-interview/ai-evaluate', {
          interviewId: '00000000-0000-0000-0000-000000000000', // Mock UUID
          questionText: selectedQuestion,
          responseText: writtenPitch
        });

        if (evalRes.data.success) {
          setFeedback(evalRes.data.feedback);
        }
      } catch (innerErr) {
        console.error('Text evaluation failed:', innerErr);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">AI Mock Interview Coach</h1>
        <p className="text-slate-500 dark:text-slate-400">Select placement questions, record video pitches, or submit written answers to get live AI metrics.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Current Interview Prompt">
            <h2 className="text-xl font-bold bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl mb-6">"{selectedQuestion}"</h2>
            
            <div className="space-y-6">
              {/* Audio/Video Upload area */}
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center bg-transparent">
                <Video className="w-10 h-10 text-slate-400 mb-4" />
                <p className="font-semibold text-sm mb-2">Record or Select your video response file</p>
                <p className="text-xs text-slate-400 mb-6">Supports MP4, WebM up to 50MB</p>
                
                {/* Hidden Input File */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/*"
                  className="hidden" 
                />

                <Button onClick={triggerFileSelect} loading={uploading} variant="outline" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload response video
                </Button>
              </div>

              {/* Text pitching fallback */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase">Or write your verbal answer pitch instead:</label>
                <textarea
                  rows="4"
                  value={writtenPitch}
                  onChange={(e) => setWrittenPitch(e.target.value)}
                  placeholder="Type or copy-paste your spoken response pitch here to test your vocabulary..."
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Button 
                  onClick={handleTextEvaluate} 
                  disabled={!writtenPitch.trim() || uploading} 
                  variant="primary" 
                  className="w-full justify-center"
                >
                  Analyze Text Response
                </Button>
              </div>
            </div>
          </Card>

          {videoUrl && (
            <Card title="Uploaded Video Playback">
              <video src={videoUrl} controls className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md" />
            </Card>
          )}

          {feedback && (
            <Card title="AI Feedback Report">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center font-extrabold text-2xl">
                    {feedback.score}%
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Overall Performance Rating</h3>
                    <p className="text-xs text-slate-400">Analysis resolved from speech pace, vocabulary structure, and keyword density.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-center border-y border-slate-100 dark:border-slate-800 py-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Grammar Score</p>
                    <p className="text-lg font-bold text-blue-600">{feedback.grammarScore}%</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Clarity Score</p>
                    <p className="text-lg font-bold text-blue-600">{feedback.pronunciationScore}%</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Verdict</p>
                    <p className="text-lg font-bold text-emerald-600">{feedback.score >= 70 ? 'PASS' : 'RETRY'}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-4">
                  <div>
                    <h4 className="font-bold text-sm text-emerald-600 mb-3">Key Strengths</h4>
                    <ul className="space-y-2">
                      {feedback.strengths.map((str, idx) => (
                        <li key={idx} className="text-xs font-semibold flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-600 mb-3">Improvement Suggestions</h4>
                    <ul className="space-y-2">
                      {feedback.suggestions.map((sug, idx) => (
                        <li key={idx} className="text-xs font-semibold text-slate-500 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0 mt-2" /> <span>{sug}</span>
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
                  onClick={() => { setSelectedQuestion(q); setFeedback(null); setVideoUrl(null); }}
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
