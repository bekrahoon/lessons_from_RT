import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Переключить на ${isDark ? 'светлую' : 'темную'} тему`}
      title={`Переключить на ${isDark ? 'светлую' : 'темную'} тему`}
    >
      <div className="theme-toggle-track">
        <div className="theme-toggle-thumb">
          {isDark ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
}

export default ThemeToggle;