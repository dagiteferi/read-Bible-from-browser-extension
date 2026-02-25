import React, { useState, useEffect } from 'react';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const DisplaySettings: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <div className="card">
      <p className="section-header">Display</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: isDark ? 'hsl(211,52%,25%,0.15)' : 'hsl(27,55%,51%,0.1)',
            color: isDark ? 'var(--primary)' : 'var(--accent)',
          }}>
            {isDark ? <MoonIcon /> : <SunIcon />}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
              {isDark ? 'Easy on the eyes at night' : 'Clear daytime reading'}
            </p>
          </div>
        </div>
        <button
          className="toggle"
          style={{ background: isDark ? 'var(--primary)' : undefined }}
          onClick={toggle}
          aria-label="Toggle dark mode"
        >
          <div className="toggle-thumb" style={{ transform: isDark ? 'translateX(20px)' : 'translateX(0)' }} />
        </button>
      </div>
    </div>
  );
};
