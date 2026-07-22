/*
------------------------------------------------
File: LiveInterviewSchedule.jsx
Purpose: Live 1-on-1 Mock Interview Schedule and Slot Management for Students and Faculty.
Responsibilities: Allows faculty to schedule slots, reschedule times, students to view upcoming live interviews & scorecards.
Dependencies: react, axiosClient, lucide-react, react-router-dom
------------------------------------------------
*/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { 
  Video, Calendar, Clock, User, CheckCircle, Plus, Sparkles, 
  ChevronRight, Award, AlertCircle, MessageSquare, Star, ArrowRight, Edit3 
} from 'lucide-react';

const LiveInterviewSchedule = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('STUDENT');
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Form State (Faculty)
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [title, setTitle] = useState('1-on-1 Technical & Soft Skills Interview');
  const [category, setCategory] = useState('Technical & Behavioral');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [formError, setFormError] = useState('');

  // Reschedule Form State (Faculty)
  const [editSession, setEditSession] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  // Selected Session for viewing feedback report modal
  const [viewSession, setViewSession] = useState(null);

  const fetchProfileAndSessions = async () => {
    setLoading(true);
    try {
      const profileRes = await axiosClient.get('/auth/profile');
      if (profileRes.data.success) {
        const role = profileRes.data.user.role;
        setUserRole(role);

        if (role === 'FACULTY' || role === 'ADMIN') {
          // Fetch student list for faculty scheduling dropdown
          axiosClient.get('/faculty/students')
            .then(res => {
              if (res.data.success) setStudents(res.data.students || []);
            })
            .catch(console.error);
        }
      }

      const sessionsRes = await axiosClient.get('/live-interview/sessions');
      if (sessionsRes.data.success) {
        setSessions(sessionsRes.data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to load live interview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndSessions();
  }, []);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !scheduleDate || !scheduleTime) {
      setFormError('Please select a student, date, and time slot.');
      return;
    }

    setScheduling(true);
    setFormError('');

    try {
      const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`).toISOString();
      const res = await axiosClient.post('/live-interview/schedule', {
        studentId: selectedStudentId,
        title,
        category,
        scheduledAt
      });

      if (res.data.success) {
        setShowScheduleModal(false);
        setSelectedStudentId('');
        setTitle('1-on-1 Technical & Soft Skills Interview');
        setScheduleDate('');
        setScheduleTime('');
        fetchProfileAndSessions();
      }
    } catch (err) {
      console.error('Failed to schedule session:', err);
      setFormError(err.response?.data?.message || 'Failed to schedule live interview session.');
    } finally {
      setScheduling(false);
    }
  };

  const handleOpenRescheduleModal = (session) => {
    setEditSession(session);
    setEditTitle(session.title);
    setEditCategory(session.category || 'Technical & Behavioral');
    
    // Parse current date and time
    const d = new Date(session.scheduled_at);
    const dateStr = d.toISOString().split('T')[0];
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    
    setEditDate(dateStr);
    setEditTime(`${hours}:${mins}`);
    setFormError('');
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!editDate || !editTime) {
      setFormError('Please select a valid date and time slot.');
      return;
    }

    setRescheduling(true);
    setFormError('');

    try {
      const scheduledAt = new Date(`${editDate}T${editTime}`).toISOString();
      const res = await axiosClient.put(`/live-interview/reschedule/${editSession.session_id}`, {
        title: editTitle,
        category: editCategory,
        scheduledAt
      });

      if (res.data.success) {
        setEditSession(null);
        fetchProfileAndSessions();
      }
    } catch (err) {
      console.error('Failed to reschedule session:', err);
      setFormError(err.response?.data?.message || 'Failed to reschedule live interview session.');
    } finally {
      setRescheduling(false);
    }
  };

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { dateStr, timeStr };
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            LIVE IN PROGRESS
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-black tracking-wider uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            SCHEDULED
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>Live 1-on-1 Mock Interview</span>
            <span className="p-2 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
              <Video className="w-6 h-6" />
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect live in real-time with faculty mentors for live audio & video mock interviews and instant scorecards.
          </p>
        </div>

        {(userRole === 'FACULTY' || userRole === 'ADMIN') && (
          <button
            onClick={() => { setShowScheduleModal(true); setFormError(''); }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-500/20 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Schedule Live Slot
          </button>
        )}
      </div>

      {/* Schedule Slot Modal (Faculty) */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60">
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-rose-500" />
                Schedule Live 1-on-1 Interview
              </h3>
              <button 
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-white text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.user_id} value={s.user_id}>
                      {s.name} ({s.department || 'Student'}) - {s.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Interview Title & Domain
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  ⚠️ {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={scheduling}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
              >
                {scheduling ? 'Scheduling Slot...' : 'Confirm Live Slot'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Slot Modal (Faculty) */}
      {editSession && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60">
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-500" />
                Change Interview Time & Slot
              </h3>
              <button 
                onClick={() => setEditSession(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  Candidate Student: <span className="text-slate-900 dark:text-white font-extrabold">{editSession.student_name}</span>
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                  Interview Title & Domain
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    New Time
                  </label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 bg-transparent text-xs font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  ⚠️ {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={rescheduling}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {rescheduling ? 'Updating Time Slot...' : 'Update & Reschedule Slot'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Live Feedback Scorecard Modal */}
      {viewSession && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60">
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Live Interview Evaluation Scorecard
              </h3>
              <button 
                onClick={() => setViewSession(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/50 flex justify-between items-center">
                <div>
                  <h4 className="font-black text-sm text-slate-850 dark:text-white">{viewSession.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Faculty: {viewSession.faculty_name} • Student: {viewSession.student_name}</p>
                </div>
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex flex-col items-center justify-center border border-emerald-500/20">
                  <span className="text-xl font-black">{viewSession.overall_score || 0}%</span>
                  <span className="text-[9px] font-black uppercase tracking-wider">Overall</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Communication</p>
                  <p className="text-lg font-black text-blue-600 dark:text-blue-400">{viewSession.communication_score || 0}%</p>
                </div>
                <div className="p-3 bg-purple-500/5 border border-purple-500/15 rounded-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Technical</p>
                  <p className="text-lg font-black text-purple-600 dark:text-purple-400">{viewSession.technical_score || 0}%</p>
                </div>
                <div className="p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confidence</p>
                  <p className="text-lg font-black text-amber-600 dark:text-amber-400">{viewSession.confidence_score || 0}%</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/50 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                  Faculty Feedback & Notes
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{viewSession.faculty_feedback || 'No written notes supplied.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Sessions List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-200">
            {userRole === 'STUDENT' ? 'Your Scheduled & Completed Live Sessions' : 'Faculty Assigned Live Interview Slots'}
          </h3>
          <span className="text-xs font-bold text-slate-400">Total: {sessions.length}</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-400 animate-pulse">
            Loading live interview sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl text-center space-y-3">
            <Video className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <p className="font-extrabold text-sm text-slate-700 dark:text-slate-300">No Live Mock Interview Sessions Scheduled</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {userRole === 'STUDENT'
                ? 'Your assigned faculty mentor will schedule live 1-on-1 interview slots for you. Slots will appear here.'
                : 'Click "Schedule Live Slot" above to schedule a live video interview with a student.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {sessions.map(s => {
              const { dateStr, timeStr } = formatDateTime(s.scheduled_at);
              const isCompleted = s.status === 'COMPLETED';

              return (
                <div 
                  key={s.session_id}
                  className="p-6 bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-3xl shadow-md flex flex-col justify-between space-y-4 hover:border-rose-500/30 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      {getStatusBadge(s.status)}
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        {s.category || 'General'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-slate-850 dark:text-white group-hover:text-rose-500 transition-colors">
                        {s.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        {userRole === 'STUDENT' ? `Faculty Advisor: ${s.faculty_name}` : `Student Candidate: ${s.student_name}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {timeStr}
                        </span>
                      </div>

                      {(userRole === 'FACULTY' || userRole === 'ADMIN') && !isCompleted && (
                        <button
                          onClick={() => handleOpenRescheduleModal(s)}
                          className="flex items-center gap-1 text-[11px] font-black text-blue-500 hover:text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 transition-all"
                          title="Change interview date or time slot"
                        >
                          <Edit3 className="w-3 h-3" />
                          Change Time
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/40">
                    {isCompleted ? (
                      <button
                        onClick={() => setViewSession(s)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        View Live Scorecard ({s.overall_score || 0}%)
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/live-interview/room/${s.session_id}`)}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wider transform hover:scale-105"
                      >
                        <Video className="w-4 h-4" />
                        {userRole === 'STUDENT' ? 'Join Live Room' : 'Start Live Interview'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveInterviewSchedule;
