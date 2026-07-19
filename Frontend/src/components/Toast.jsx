/*
------------------------------------------------
File: Toast.jsx
Purpose: Unified Toast Notifications.
Responsibilities: Displays transient success, info, and error alerts.
Dependencies: react, lucide-react
------------------------------------------------
*/

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-300',
    error: 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800/30 dark:text-rose-300',
    info: 'bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-950/20 dark:border-sky-800/30 dark:text-sky-300'
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-sky-500" />
  };

  return (
    <div className={`fixed bottom-5 right-5 flex items-center gap-3 px-4 py-3.5 border rounded-2xl shadow-xl backdrop-blur-md z-50 animate-bounce ${styles[type]}`}>
      {icons[type]}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
        <X className="w-4 h-4 text-current" />
      </button>
    </div>
  );
};

export default Toast;
