/*
------------------------------------------------
File: Card.jsx
Purpose: Premium Glassmorphism Card.
Responsibilities: Wraps components inside custom background grid panels.
Dependencies: react
------------------------------------------------
*/

import React from 'react';

const Card = ({ children, title = '', className = '', action = null }) => {
  return (
    <div className={`glass-card p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 dark:border-slate-700 pb-3">
          {title && <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;
