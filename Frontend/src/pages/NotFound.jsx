/*
------------------------------------------------
File: NotFound.jsx
Purpose: 404 error page.
Responsibilities: Informs users of incorrect routing attempts.
Dependencies: react, react-router-dom, Button
------------------------------------------------
*/

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="p-4 bg-rose-500/10 text-rose-500 rounded-3xl mb-6">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold mb-3">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        The URL path you requested does not exist or has been restricted.
      </p>
      <Link to="/">
        <Button variant="primary">Return Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
