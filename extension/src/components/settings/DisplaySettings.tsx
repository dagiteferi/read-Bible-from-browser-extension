import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const DisplaySettings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
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
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Display Settings</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Customize the appearance of your extension.
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-medium text-text-primary dark:text-dark-text">Dark Mode</span>
        <Button onClick={toggleDarkMode} className="bg-indigo-deep dark:bg-dark-indigo">
          {isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
        </Button>
      </div>
      {/* Placeholder for font size settings */}
    </Card>
  );
};
