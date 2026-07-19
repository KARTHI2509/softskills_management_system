/*
------------------------------------------------
File: Settings.jsx
Purpose: Unified system and profile settings.
Responsibilities: Manages theme switches, notifications, and profile modifications.
Dependencies: react, Card, ThemeContext, useAuth
------------------------------------------------
*/

import React, { useContext, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { ThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Sun, Moon, Bell, Shield, Lock } from 'lucide-react';

const Settings = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight font-sans">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure visual themes, password configs, and notifications permissions.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Appearance setting */}
        <Card title="Appearance Options">
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-bold text-sm">Visual Dark Theme</p>
              <p className="text-xs text-slate-400">Switches entire interface color mappings.</p>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </Card>

        {/* Notifications Setting */}
        <Card title="Alert Options">
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="font-bold text-sm">Email Grade Notifications</p>
              <p className="text-xs text-slate-400">Sends alerts when activities are evaluated by faculty.</p>
            </div>
            <input 
              type="checkbox" 
              checked={emailAlerts} 
              onChange={() => setEmailAlerts(!emailAlerts)} 
              className="w-5 h-5 accent-blue-600 cursor-pointer" 
            />
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Settings;
