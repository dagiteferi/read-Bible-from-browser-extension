import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';

export const DisplaySettings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedMode === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <Card className="space-y-24">
      <div className="flex items-center justify-between group cursor-pointer" onClick={toggleDarkMode}>
        <div className="space-y-4">
          <h3 className="text-12 font-bold uppercase tracking-widest text-indigo-prayer dark:text-night-amber">
            Vesper Mode (Dark)
          </h3>
          <p className="text-[10px] text-text-secondary dark:text-night-text-muted italic">
            Gentle illumination for evening meditation.
          </p>
        </div>
        <div className={`w-48 h-24 rounded-full p-4 transition-colors duration-300 ${isDarkMode ? 'bg-amber-spirit' : 'bg-border-light'}`}>
          <div className={`w-16 h-16 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-24' : 'translate-x-0'}`} />
        </div>
      </div>

      <div className="pt-16 border-t border-border-light dark:border-night-border space-y-12">
        <h3 className="text-12 font-bold uppercase tracking-widest text-indigo-prayer dark:text-night-amber opacity-50">
          Scripture Font
        </h3>
        <div className="grid grid-cols-2 gap-8">
          <button className="p-12 text-center rounded-sacred border-2 border-amber-spirit bg-amber-spirit bg-opacity-10 text-12 font-bold text-amber-spirit">
            Noto Sans Ethiopic
          </button>
          <button className="p-12 text-center rounded-sacred border border-border-light dark:border-night-border text-12 font-bold text-text-secondary opacity-50 cursor-not-allowed">
            Abyssinica (Soon)
          </button>
        </div>
      </div>
    </Card>
  );
};
