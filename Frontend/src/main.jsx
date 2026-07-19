/*
------------------------------------------------
File: main.jsx
Purpose: Mounting point.
Responsibilities: Mounts the App component inside the DOM root container.
Dependencies: react, react-dom, App
------------------------------------------------
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
