/*
------------------------------------------------
File: AuthLayout.jsx
Purpose: Visual container shell for registration and logins.
Responsibilities: Places central card shells against dynamic gradient background grids.
Dependencies: react, react-router-dom, lucide-react
------------------------------------------------
*/

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 hover:opacity-95">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            SkillForge
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-3xl backdrop-blur-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
