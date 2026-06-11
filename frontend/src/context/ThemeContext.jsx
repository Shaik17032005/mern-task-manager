import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.style.setProperty('--bg-main', '#0b0f19');
      root.style.setProperty('--bg-card', 'rgba(17, 24, 39, 0.65)');
      root.style.setProperty('--text-main', '#f3f4f6');
    } else {
      root.style.setProperty('--bg-main', '#f9fafb');
      root.style.setProperty('--bg-card', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--text-main', '#1f2937');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
