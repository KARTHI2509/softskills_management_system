/*
------------------------------------------------
File: Button.jsx
Purpose: Reusable Action button.
Responsibilities: Renders custom theme sizes, variant colors, and loading indicator states.
Dependencies: react
------------------------------------------------
*/

import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', loading = false, disabled = false, className = '' }) => {
  const baseStyle = "px-6 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-200 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
