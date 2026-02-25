import React from 'react';
import { Card } from '../common/Card';
import { usePlanContext } from '../../contexts/PlanContext';

export const Statistics: React.FC = () => {
  const { progress, loading, error } = usePlanContext();

  if (loading) return <Card><p>Loading statistics...</p></Card>;
  if (error) return <Card><p className="text-burgundy-curtain">Error loading statistics.</p></Card>;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Detailed Statistics</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 text-text-primary dark:text-dark-text">
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Verses Read</p>
          <p className="text-xl font-bold text-amber-warm">{progress?.completed_verses || 0}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Total Units Read</p>
          <p className="text-xl font-bold text-amber-warm">{progress?.completed_units || 0}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Average Verses/Day</p>
          <p className="text-xl font-bold text-amber-warm">
            {progress?.daily_history && progress.daily_history.length > 0
              ? (progress.completed_verses / progress.daily_history.length).toFixed(1)
              : 0}
          </p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Longest Streak</p>
          <p className="text-xl font-bold text-amber-warm">0 days</p> {/* Placeholder */}
        </div>
      </div>
    </Card>
  );
};
