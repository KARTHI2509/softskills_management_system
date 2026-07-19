/*
------------------------------------------------
File: About.jsx
Purpose: Public system about description.
Responsibilities: Communicates goals, methodology, and developer scopes.
Dependencies: react, react-router-dom
------------------------------------------------
*/

import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-slate-800 dark:text-slate-100">
      <h1 className="text-4xl font-extrabold mb-6">About the System</h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        The Smart Soft Skills Management System for Placement Readiness is built to empower college graduates with the non-technical capabilities (communication, reasoning, presentation, conflict management) that corporate recruiters demand.
      </p>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Objectives</h2>
        <ul className="list-disc list-inside space-y-3 text-slate-600 dark:text-slate-400">
          <li>Automate qualitative soft skills evaluation through AI templates.</li>
          <li>Bridge the communication gap between trainers and large batches of placement candidates.</li>
          <li>Offer real-world group discussion and mock interview scenarios.</li>
          <li>Generate department-wide analytics to identify candidates needing support.</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
