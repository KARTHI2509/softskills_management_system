/*
------------------------------------------------
File: Notifications.jsx
Purpose: Real notifications page connected to backend with interactive module routing.
Responsibilities: Fetch live notifications, mark as read, navigate to linked module, mark all as read, delete.
Dependencies: react, react-router-dom, axiosClient, useAuth, notificationRouter, lucide-react
------------------------------------------------
*/

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../hooks/useAuth';
import { getNotificationTarget, getNotificationCategoryLabel } from '../utils/notificationRouter';
import {
  Bell, MailOpen, AlertCircle, CheckCheck, Trash2,
  Loader2, ClipboardList, Award, Users, Mic, Brain, ExternalLink, ChevronRight
} from 'lucide-react';

const getRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const getNotifIcon = (message) => {
  const m = message.toLowerCase();
  if (m.includes('task') || m.includes('assigned')) return <ClipboardList className="w-4 h-4" />;
  if (m.includes('evaluated') || m.includes('graded') || m.includes('score')) return <Award className="w-4 h-4" />;
  if (m.includes('batch') || m.includes('faculty') || m.includes('student')) return <Users className="w-4 h-4" />;
  if (m.includes('interview')) return <Mic className="w-4 h-4" />;
  if (m.includes('aptitude') || m.includes('test')) return <Brain className="w-4 h-4" />;
  if (m.includes('overdue')) return <AlertCircle className="w-4 h-4" />;
  return <Bell className="w-4 h-4" />;
};

const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      setError('Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await axiosClient.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n)
      );
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      handleMarkRead(notif.notification_id);
    }
    const targetUrl = getNotificationTarget(notif, user?.role);
    navigate(targetUrl);
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await axiosClient.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Mark all read error:', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await axiosClient.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.notification_id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'} — click any notification to open the connected feature.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-xl transition-colors"
          >
            {markingAll
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <CheckCheck className="w-4 h-4" />
            }
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>Loading notifications...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-900">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-slate-400">
          <MailOpen className="w-12 h-12 opacity-30" />
          <p className="font-semibold text-sm">No notifications yet</p>
          <p className="text-xs">You'll be notified when tasks are assigned, evaluations complete, or live interviews schedule.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const categoryLabel = getNotificationCategoryLabel(notif.message);
            const targetUrl = getNotificationTarget(notif, user?.role);

            return (
              <div
                key={notif.notification_id}
                onClick={() => handleNotificationClick(notif)}
                className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all transform hover:-translate-y-0.5 hover:shadow-lg ${
                  notif.is_read
                    ? 'border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 opacity-85 hover:border-blue-400 dark:hover:border-blue-600'
                    : 'border-blue-200 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/30 hover:border-blue-500 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 transition-transform group-hover:scale-110 ${
                    notif.is_read
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}>
                    {notif.is_read ? <MailOpen className="w-4 h-4" /> : getNotifIcon(notif.message)}
                  </div>

                  {/* Message & Category */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {categoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {getRelativeTime(notif.created_at)}
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${
                      notif.is_read
                        ? 'font-medium text-slate-600 dark:text-slate-400'
                        : 'font-bold text-slate-900 dark:text-gray-100'
                    }`}>
                      {notif.message}
                    </p>

                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-extrabold mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Open connected module</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </p>
                  </div>
                </div>

                {/* Right Action Icons */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </span>
                  
                  <button
                    onClick={(e) => handleDelete(e, notif.notification_id)}
                    title="Delete Notification"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
