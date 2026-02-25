import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className = '' }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 ${className}`}>
      <div
        className="bg-amber-warm h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${clampedProgress}%` }}
      ></div>
    </div>
  );
};
