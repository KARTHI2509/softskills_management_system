/*
------------------------------------------------
File: ThemeContext.jsx
Purpose: Global UI theme context.
Responsibilities: Toggles light/dark mode, updates DOM root element styles, and manages active theme backgrounds.
Dependencies: react
------------------------------------------------
*/

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const themesList = {
  emerald: { 
    name: 'Emerald', 
    primary: '#10b981', 
    rgb: '16, 185, 129', 
    bg: '#02140f', 
    sidebar: '#010b08', 
    card: '#03251b', 
    border: '#053d2d', 
    hover: '#059669' 
  },
  master: { 
    name: 'Master Tech', 
    primary: '#8b5cf6', 
    rgb: '139, 92, 246', 
    bg: '#0d0f1a', 
    sidebar: '#07080f', 
    card: '#141729', 
    border: '#1f2440', 
    hover: '#7c3aed' 
  },
  ruby: { 
    name: 'Ruby Sunset', 
    primary: '#ef4444', 
    rgb: '239, 68, 68', 
    bg: '#1c080a', 
    sidebar: '#0d0405', 
    card: '#2c0c0f', 
    border: '#441317', 
    hover: '#dc2626' 
  },
  ocean: { 
    name: 'Ocean Wave', 
    primary: '#0ea5e9', 
    rgb: '14, 165, 233', 
    bg: '#020d1a', 
    sidebar: '#01070e', 
    card: '#041933', 
    border: '#072a54', 
    hover: '#0284c7' 
  },
  legend: { 
    name: 'Legend Gold', 
    primary: '#f59e0b', 
    rgb: '245, 158, 11', 
    bg: '#120c02', 
    sidebar: '#0a0601', 
    card: '#211604', 
    border: '#382607', 
    hover: '#d97706' 
  },
  rose: { 
    name: 'Rose Red', 
    primary: '#f43f5e', 
    rgb: '244, 63, 94', 
    bg: '#1a060a', 
    sidebar: '#0e0305', 
    card: '#2c0a11', 
    border: '#44101a', 
    hover: '#e11d48' 
  },
  midnight: { 
    name: 'Midnight', 
    primary: '#3b82f6', 
    rgb: '59, 130, 246', 
    bg: '#02040a', 
    sidebar: '#010205', 
    card: '#050a17', 
    border: '#0d1733', 
    hover: '#2563eb' 
  },
  sakura: { 
    name: 'Sakura Pink', 
    primary: '#ec4899', 
    rgb: '236, 72, 153', 
    bg: '#1a050f', 
    sidebar: '#0e0208', 
    card: '#2c0919', 
    border: '#440f27', 
    hover: '#db2677' 
  },
  forest: { 
    name: 'Forest Green', 
    primary: '#22c55e', 
    rgb: '34, 197, 94', 
    bg: '#020f04', 
    sidebar: '#010802', 
    card: '#04210a', 
    border: '#073811', 
    hover: '#16a34a' 
  },
  slate: { 
    name: 'Slate', 
    primary: '#64748b', 
    rgb: '100, 116, 139', 
    bg: '#0f172a', 
    sidebar: '#090d16', 
    card: '#1e293b', 
    border: '#334155', 
    hover: '#475569' 
  },
  coral: { 
    name: 'Coral', 
    primary: '#ff6b6b', 
    rgb: '255, 107, 107', 
    bg: '#140505', 
    sidebar: '#0a0303', 
    card: '#240b0b', 
    border: '#3d1212', 
    hover: '#ff5252' 
  },
  cosmic: { 
    name: 'Cosmic Violet', 
    primary: '#a855f7', 
    rgb: '168, 85, 247', 
    bg: '#0c0214', 
    sidebar: '#06010a', 
    card: '#1a042c', 
    border: '#2d074b', 
    hover: '#9333ea' 
  }
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const [accentColor, setAccentColor] = useState(localStorage.getItem('accentColor') || 'emerald');
  const [customColor, setCustomColor] = useState(localStorage.getItem('customColor') || '#8b5cf6');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    let c;
    if (accentColor === 'custom') {
      const customBg = '#05070a';
      const customSidebar = '#020305';
      const customCard = '#0e111a';
      const customBorder = '#1a1f30';
      c = {
        name: 'Custom',
        primary: customColor,
        rgb: hexToRgb(customColor) || '139, 92, 246',
        bg: customBg,
        sidebar: customSidebar,
        card: customCard,
        border: customBorder,
        hover: customColor
      };
    } else {
      c = themesList[accentColor] || themesList.emerald;
    }

    let style = document.getElementById('dynamic-accent-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dynamic-accent-styles';
      document.head.appendChild(style);
    }

    style.innerHTML = `
      :root {
        --color-accent: ${c.primary};
        --color-accent-hover: ${c.hover};
        --color-accent-rgb: ${c.rgb};
        --color-primary: ${c.primary};
      }
      
      .dark {
        --color-bg: ${c.bg};
        --color-sidebar: ${c.sidebar};
        --color-header: ${c.sidebar};
        --color-card: ${c.card};
        --color-border: ${c.border};
        --color-surface: ${c.card};
      }
      
      /* Global Theme Overrides in Dark Mode */
      .dark body {
        background-color: var(--color-bg) !important;
      }
      
      .dark aside {
        background-color: var(--color-sidebar) !important;
        border-color: var(--color-border) !important;
      }
      
      .dark header {
        background-color: var(--color-header) !important;
        border-color: var(--color-border) !important;
      }
      
      .dark .bg-white.dark\\:bg-\\[\\#111625\\], 
      .dark .bg-white.dark\\:bg-slate-900,
      .dark .dark\\:bg-slate-900,
      .dark .dark\\:bg-\\[\\#111625\\],
      .dark .bg-slate-900,
      .dark .bg-\\[\\#111625\\],
      .dark .bg-white.dark\\:bg-slate-900\\/50,
      .dark .dark\\:bg-slate-900\\/50 {
        background-color: var(--color-card) !important;
      }
      
      .dark .border-slate-200.dark\\:border-slate-800\\/80,
      .dark .border-slate-800,
      .dark .dark\\:border-slate-800,
      .dark .dark\\:border-slate-800\\/80,
      .dark .border-slate-200.dark\\:border-slate-800 {
        border-color: var(--color-border) !important;
      }
      
      .accent-bg-primary {
        background-color: ${c.primary} !important;
      }
      .accent-bg-hover:hover {
        background-color: ${c.hover} !important;
      }
      .accent-text-primary {
        color: ${c.primary} !important;
      }
      .accent-border-primary {
        border-color: ${c.primary} !important;
      }
      .accent-shadow-primary {
        box-shadow: 0 10px 15px -3px rgba(${c.rgb}, 0.25) !important;
      }
      body {
        transition: background-color 0.2s ease, color 0.2s ease;
      }
    `;
    localStorage.setItem('accentColor', accentColor);
    if (accentColor === 'custom') {
      localStorage.setItem('customColor', customColor);
    }
  }, [accentColor, customColor]);

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
  }

  /*
  Toggles current theme state.
  */
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleTheme, 
      accentColor, 
      setAccentColor, 
      customColor, 
      setCustomColor, 
      fontSize, 
      setFontSize 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
