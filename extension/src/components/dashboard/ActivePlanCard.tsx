import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { usePlanContext } from '../../contexts/PlanContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getNextNotificationTime } from '../../utils/dateHelpers';

export const ActivePlanCard: React.FC = () => {
  const { currentPlan, progress, loading, error } = usePlanContext();
  const { settings } = useSettingsContext();

  if (loading) return <Card><p>Loading plan...</p></Card>;
  if (error) return <Card><p className="text-burgundy-curtain">Error: {error.message}</p></Card>;

  if (!currentPlan) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Active Plan</h2>
        <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">No active plan found. Create one to start your journey!</p>
      </Card>
    );
  }

  const completionPercentage = progress && progress.total_units > 0
    ? (progress.completed_units / progress.total_units) * 100
    : 0;

  const nextNotification = getNextNotificationTime(new Date(), settings.workingHours, settings.quietHours); // Simplified

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Your Journey</h2>
      <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
        {currentPlan.books.join(', ')}
      </p>
      <div className="mt-4">
        <ProgressBar progress={completionPercentage} />
        <p className="text-sm text-right text-text-secondary dark:text-dark-text-secondary mt-1">
          {progress?.completed_units || 0} / {progress?.total_units || 0} units completed
        </p>
      </div>
      <p className="mt-4 text-sm text-text-secondary dark:text-dark-text-secondary">
        Listening at: {nextNotification.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </Card>
  );
};
