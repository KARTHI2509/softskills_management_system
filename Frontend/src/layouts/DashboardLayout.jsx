/*
------------------------------------------------
File: DashboardLayout.jsx
Purpose: Authenticated application dashboard shell.
Responsibilities: Models responsive navigation sidebars, maps user roles access, renders profile status header.
Dependencies: react, react-router-dom, useAuth, ThemeContext, lucide-react
------------------------------------------------
*/

import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, User, Settings, LogOut, Bell, Sun, Moon, 
  Menu, X, BookOpen, GraduationCap, Users, FileText, CheckSquare, Award, BarChart3
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Resolve link maps based on role
  const getSidebarLinks = () => {
    const common = [
      { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
      { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> }
    ];

    if (user?.role === 'STUDENT') {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Communication', path: '/communication', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Mock Interview', path: '/mock-interview', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Group Discussion', path: '/group-discussion', icon: <Users className="w-5 h-5" /> },
        { name: 'Resume Builder', path: '/resume-builder', icon: <FileText className="w-5 h-5" /> },
        { name: 'Aptitude Tests', path: '/aptitude', icon: <CheckSquare className="w-5 h-5" /> },
        { name: 'Leaderboard', path: '/leaderboard', icon: <Award className="w-5 h-5" /> },
        { name: 'Progress Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" /> },
        ...common
      ];
    }

    if (user?.role === 'FACULTY') {
      return [
        { name: 'Faculty Dashboard', path: '/faculty/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Assign Activity', path: '/faculty/activities', icon: <BookOpen className="w-5 h-5" /> },
        { name: 'Manage Questions', path: '/faculty/questions', icon: <CheckSquare className="w-5 h-5" /> },
        { name: 'Evaluate Students', path: '/faculty/evaluations', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'GD Scheduler', path: '/group-discussion', icon: <Users className="w-5 h-5" /> },
        { name: 'Class Reports', path: '/reports', icon: <BarChart3 className="w-5 h-5" /> },
        ...common
      ];
    }

    if (user?.role === 'PLACEMENT_OFFICER') {
      return [
        { name: 'Placement Dashboard', path: '/placement/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Eligible Shortlist', path: '/placement/eligible', icon: <GraduationCap className="w-5 h-5" /> },
        { name: 'Dept Comparison', path: '/placement/comparison', icon: <BarChart3 className="w-5 h-5" /> },
        ...common
      ];
    }

    if (user?.role === 'ADMIN') {
      return [
        { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Manage Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'System Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
        ...common
      ];
    }

    return common;
  };

  const links = getSidebarLinks();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:relative'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-lg text-slate-800 dark:text-gray-100">SkillForge</span>
          </Link>
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100vh-8rem)]">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-gray-100'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3.5 w-full px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20">
          <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <Link 
              to="/notifications" 
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-slate-900" />
            </Link>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

            {/* User Profile Summary */}
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-90">
              <div className="h-9 w-9 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-slate-800 dark:text-gray-200 leading-none">{user?.name || 'Guest User'}</p>
                <p className="text-xs font-semibold text-slate-400 capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Anonymous'}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
