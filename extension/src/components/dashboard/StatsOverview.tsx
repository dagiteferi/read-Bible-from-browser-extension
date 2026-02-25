import React from 'react';
import { Card } from '../common/Card';
import { usePlanContext } from '../../contexts/PlanContext';

export const StatsOverview: React.FC = () => {
  const { progress, loading, error } = usePlanContext();

  if (loading) return <div className="loading-pulse h-120 w-full" />;
  if (error) return null;

  return (
    <Card className="border-t-4 border-t-indigo-prayer">
      <h3 className="text-14 font-medium text-text-secondary dark:text-night-text-muted uppercase tracking-widest mb-16">
        Milestones
      </h3>
      <div className="grid grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="flex items-center gap-8 text-indigo-prayer dark:text-night-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="text-xs font-semibold">Verses Read</span>
          </div>
          <p className="text-24 font-inter font-bold text-amber-spirit">{progress?.completed_verses || 0}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-8 text-indigo-prayer dark:text-night-text">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <span className="text-xs font-semibold">Rhythm</span>
          </div>
          <p className="text-24 font-inter font-bold text-olive-mountain">
            {progress?.completed_units || 0} <span className="text-12 font-medium opacity-50">UNITS</span>
          </p>
        </div>
      </div>
    </Card>
  );
};
