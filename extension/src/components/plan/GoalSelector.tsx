import React from 'react';

interface GoalSelectorProps {
  targetDate: string;
  onTargetDateChange: (date: string) => void;
  maxVersesPerUnit: number;
  onMaxVersesChange: (verses: number) => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  targetDate,
  onTargetDateChange,
  maxVersesPerUnit,
  onMaxVersesChange,
}) => {
  return (
    <div className="space-y-24 animate-fade-in">
      <div className="space-y-8">
        <h2 className="text-18 font-medium text-indigo-prayer dark:text-night-text uppercase tracking-widest">
          The Goal
        </h2>
        <p className="text-text-secondary dark:text-night-text-muted text-sm italic">
          Set the pace of your journey.
        </p>
      </div>

      <div className="space-y-24">
        <div className="space-y-8">
          <label htmlFor="targetDate" className="text-xs font-bold uppercase tracking-widest text-indigo-prayer dark:text-night-amber">
            Completion Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => onTargetDateChange(e.target.value)}
              className="w-full bg-white dark:bg-night-surface border border-border-light dark:border-night-border rounded-sacred p-12 text-text-primary dark:text-night-text focus:border-amber-spirit focus:ring-1 focus:ring-amber-spirit outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <label htmlFor="maxVerses" className="text-xs font-bold uppercase tracking-widest text-indigo-prayer dark:text-night-amber">
              Daily Verse Limit
            </label>
            <span className="text-20 font-bold text-amber-spirit">{maxVersesPerUnit}</span>
          </div>
          <input
            type="range"
            id="maxVerses"
            value={maxVersesPerUnit}
            onChange={(e) => onMaxVersesChange(parseInt(e.target.value))}
            min="1"
            max="50"
            className="w-full accent-amber-spirit"
          />
          <p className="text-[10px] text-text-secondary dark:text-night-text-muted italic">
            This ensures your daily portions are manageable and meditative.
          </p>
        </div>
      </div>
    </div>
  );
};
