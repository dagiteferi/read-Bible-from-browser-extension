import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { usePlanContext } from '../../contexts/PlanContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getNextNotificationTime } from '../../utils/dateHelpers';

export const ActivePlanCard: React.FC = () => {
  const { currentPlan, progress, loading, error } = usePlanContext();
  const { settings } = useSettingsContext();

  if (loading) return <div className="loading-pulse h-160 w-full" />;
  if (error) return (
    <div className="error-message">
      <p>ወዮ! (Error): {error.message}</p>
    </div>
  );

  if (!currentPlan) {
    return (
      <Card parchment className="text-center py-48">
        <div className="mb-16 opacity-30">
          <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <h2 className="text-20 font-medium text-indigo-prayer dark:text-night-text mb-8">Begin Your Journey</h2>
        <p className="text-text-secondary dark:text-night-text-muted px-24">
          No active plan found. Set a rhythm for your daily bread.
        </p>
      </Card>
    );
  }

  const completionPercentage = progress && progress.total_units > 0
    ? (progress.completed_units / progress.total_units) * 100
    : 0;

  const nextNotification = getNextNotificationTime(new Date(), settings.workingHours, settings.quietHours);

  return (
    <Card parchment className="relative overflow-hidden">
      <div className="absolute top-0 right-0 p-16 opacity-10">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" opacity=".3" />
        </svg>
      </div>

      <div className="relative z-10">
        <h2 className="text-18 font-medium text-indigo-prayer dark:text-night-text mb-4 uppercase tracking-widest">
          Active Plan
        </h2>
        <p className="text-20 font-ethiopic text-amber-spirit-warm font-semibold mb-24" data-amharic="true">
          {currentPlan.books.join('፣ ')}
        </p>

        <div className="space-y-16">
          <ProgressBar progress={completionPercentage} showLabel />

          <div className="flex justify-between items-center pt-8">
            <div className="flex items-center gap-8 text-text-secondary dark:text-night-text-muted text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>Listening: <span className="text-indigo-prayer dark:text-night-amber font-medium">{nextNotification.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
            </div>

            <div className="text-xs font-medium text-olive-mountain dark:text-dark-olive bg-olive-mountain bg-opacity-10 px-8 py-2 rounded-full">
              {progress?.completed_units || 0} / {progress?.total_units || 0} Units
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
