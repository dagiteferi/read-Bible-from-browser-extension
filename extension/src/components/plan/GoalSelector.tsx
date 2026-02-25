import React from 'react';
import { Card } from '../common/Card';

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
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Set Your Goal</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Define your target completion date or your preferred daily reading pace.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="targetDate" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
            Target Completion Date
          </label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => onTargetDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-deep focus:ring-indigo-deep dark:bg-dark-surface dark:border-dark-border dark:text-dark-text"
          />
        </div>

        <div>
          <label htmlFor="maxVerses" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
            Maximum Verses per Reading Unit
          </label>
          <input
            type="number"
            id="maxVerses"
            value={maxVersesPerUnit}
            onChange={(e) => onMaxVersesChange(parseInt(e.target.value))}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-deep focus:ring-indigo-deep dark:bg-dark-surface dark:border-dark-border dark:text-dark-text"
          />
          <p className="mt-1 text-xs text-text-secondary dark:text-dark-text-secondary">
            This helps control the length of each daily reading.
          </p>
        </div>
      </div>
    </Card>
  );
};
