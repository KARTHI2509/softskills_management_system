/*
------------------------------------------------
File: MainLayout.jsx
Purpose: Public website shell layout.
Responsibilities: Mounts unified top navbar and footer around Outlet child components.
Dependencies: react, react-router-dom, lucide-react
------------------------------------------------
*/

import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar Header */}
      <header className="sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              SkillForge
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <span>&copy; 2026 SkillForge Soft Skills System. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
