/*
------------------------------------------------
File: App.jsx
Purpose: Core application router gate.
Responsibilities: Integrates ThemeProvider, AuthProvider, and AppRoutes.
Dependencies: react, AuthContext, ThemeContext, AppRoutes, index.css
------------------------------------------------
*/

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
