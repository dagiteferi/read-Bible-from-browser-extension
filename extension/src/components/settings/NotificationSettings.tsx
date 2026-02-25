import React from 'react';
import { Card } from '../common/Card';
import { TimePicker } from '../common/TimePicker';
import { useSettingsContext } from '../../contexts/SettingsContext';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useSettingsContext();

  if (loading) return <Card><p>Loading settings...</p></Card>;

  const handleQuietHoursChange = (type: 'start' | 'end', value: string) => {
    updateSettings({
      quietHours: { ...settings.quietHours, [type]: value },
    });
  };

  const handleWorkingHoursChange = (type: 'start' | 'end', value: string) => {
    updateSettings({
      workingHours: { ...settings.workingHours, [type]: value },
    });
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Notification Settings</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Manage when and how you receive your daily readings.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-medium text-indigo-deep dark:text-dark-indigo mb-2">Quiet Hours (Times of Stillness)</h3>
          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={settings.quietHours.start}
              onChange={(e) => handleQuietHoursChange('start', e.target.value)}
            />
            <TimePicker
              label="End Time"
              value={settings.quietHours.end}
              onChange={(e) => handleQuietHoursChange('end', e.target.value)}
            />
          </div>
          <p className="mt-1 text-xs text-text-secondary dark:text-dark-text-secondary">
            Notifications will be paused during these hours.
          </p>
        </div>

        <div>
          <h3 className="font-medium text-indigo-deep dark:text-dark-indigo mb-2">Working Hours (Times of Listening)</h3>
          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={settings.workingHours.start}
              onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
            />
            <TimePicker
              label="End Time"
              value={settings.workingHours.end}
              onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
            />
          </div>
          <p className="mt-1 text-xs text-text-secondary dark:text-dark-text-secondary">
            Notifications will primarily be delivered within these hours.
          </p>
        </div>
      </div>
    </Card>
  );
};
