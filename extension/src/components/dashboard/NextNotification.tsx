import React from 'react';
import { Card } from '../common/Card';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getNextNotificationTime } from '../../utils/dateHelpers';

export const NextNotification: React.FC = () => {
  const { settings, loading } = useSettingsContext();

  if (loading) return <Card><p>Loading notification settings...</p></Card>;

  const nextNotification = getNextNotificationTime(new Date(), settings.workingHours, settings.quietHours); // Simplified

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Next Listening Time</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Your next reading is scheduled for: {nextNotification.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </Card>
  );
};
