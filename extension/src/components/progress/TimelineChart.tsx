import React from 'react';
import { Card } from '../common/Card';

export const TimelineChart: React.FC = () => {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Your Reading Journey Timeline</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        (Placeholder for a visual timeline chart of your reading progress.)
      </p>
      <div className="mt-4 h-48 bg-gray-100 dark:bg-dark-surface-light rounded-md flex items-center justify-center text-text-secondary dark:text-dark-text-secondary">
        Chart will appear here
      </div>
    </Card>
  );
};
