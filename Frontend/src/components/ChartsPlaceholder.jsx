/*
------------------------------------------------
File: ChartsPlaceholder.jsx
Purpose: Renders SVG animated graphs templates.
Responsibilities: Models custom line charts, bar charts, and score grids.
Dependencies: react
------------------------------------------------
*/

import React from 'react';

const ChartsPlaceholder = ({ type = 'line', data = [60, 75, 70, 85, 82], labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }) => {
  if (type === 'bar') {
    const maxVal = Math.max(...data, 100);
    return (
      <div className="h-64 flex items-end justify-between gap-4 pt-6 px-2">
        {data.map((val, idx) => {
          const heightPercent = (val / maxVal) * 100;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-xl h-48 flex items-end relative overflow-hidden">
                {/* Score bar */}
                <div 
                  style={{ height: `${heightPercent}%` }} 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 rounded-b-xl rounded-t-lg transition-all duration-500 ease-out origin-bottom scale-y-100 relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}%
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate w-full text-center">
                {labels[idx] || `Item ${idx + 1}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback SVG Line Graph
  const width = 500;
  const height = 200;
  const padding = 30;
  const maxVal = Math.max(...data, 100);
  
  // Calculate SVG line points
  const points = data.map((val, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (val * (height - padding * 2)) / maxVal;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full pt-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-gray-100 dark:text-slate-700/50" strokeDasharray="4 4" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="currentColor" className="text-gray-100 dark:text-slate-700/50" strokeDasharray="4 4" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-gray-200 dark:text-slate-700" strokeWidth="1.5" />
        
        {/* Smooth data line */}
        <polyline
          fill="none"
          stroke="url(#chartGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />

        {/* Data points */}
        {data.map((val, idx) => {
          const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
          const y = height - padding - (val * (height - padding * 2)) / maxVal;
          return (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r="6"
                className="fill-blue-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-800"
                strokeWidth="2"
              />
              <circle
                cx={x}
                cy={y}
                r="12"
                className="fill-blue-500/20 opacity-0 hover:opacity-100 transition-opacity"
              />
            </g>
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex justify-between mt-2 px-6">
        {labels.map((lbl, idx) => (
          <span key={idx} className="text-xs font-semibold text-gray-400">{lbl}</span>
        ))}
      </div>
    </div>
  );
};

export default ChartsPlaceholder;
