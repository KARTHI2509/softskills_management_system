/*
------------------------------------------------
File: LoadingSkeleton.jsx
Purpose: Pulsing placeholder grid loaders.
Responsibilities: Simulates charts or list item bars before API responses return.
Dependencies: react
------------------------------------------------
*/

import React from 'react';

const LoadingSkeleton = ({ type = 'card', lines = 3 }) => {
  if (type === 'list') {
    return (
      <div className="space-y-3 animate-pulse w-full">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <div className="h-10 w-10 bg-gray-200 dark:bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card p-6 animate-pulse w-full space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full" />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
