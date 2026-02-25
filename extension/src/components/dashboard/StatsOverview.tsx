import React from 'react';
import { Card } from '../common/Card';
import { usePlanContext } from '../../contexts/PlanContext';

export const StatsOverview: React.FC = () => {
  const { progress, loading, error } = usePlanContext();

  if (loading) return <Card><p>Loading stats...</p></Card>;
  if (error) return <Card><p className="text-burgundy-curtain">Error loading stats.</p></Card>;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Your Journey So Far</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Verses Read</p>
          <p className="text-xl font-bold text-amber-warm">{progress?.completed_verses || 0}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Units Completed</p>
          <p className="text-xl font-bold text-amber-warm">{progress?.completed_units || 0}</p>
        </div>
      </div>
    </Card>
  );
};
