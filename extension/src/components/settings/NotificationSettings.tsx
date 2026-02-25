import React from 'react';
import { Card } from '../common/Card';
import { TimePicker } from '../common/TimePicker';
import { useSettingsContext } from '../../contexts/SettingsContext';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useSettingsContext();

  if (loading) return <div className="loading-pulse h-200 w-full" />;

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
    <Card className="space-y-24">
      <div className="space-y-16">
        <div className="flex items-center gap-12">
          <div className="text-burgundy-curtain">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path><path d="M12 7v5l3 3"></path></svg>
          </div>
          <h3 className="text-12 font-bold uppercase tracking-widest text-indigo-prayer dark:text-night-amber">
            Stillness (Quiet Hours)
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-16 ml-32">
          <TimePicker
            label="From"
            value={settings.quietHours.start}
            onChange={(e) => handleQuietHoursChange('start', e.target.value)}
          />
          <TimePicker
            label="Until"
            value={settings.quietHours.end}
            onChange={(e) => handleQuietHoursChange('end', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-16 pt-16 border-t border-border-light dark:border-night-border">
        <div className="flex items-center gap-12">
          <div className="text-olive-mountain">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </div>
          <h3 className="text-12 font-bold uppercase tracking-widest text-indigo-prayer dark:text-night-amber">
            Listening (Active Hours)
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-16 ml-32">
          <TimePicker
            label="From"
            value={settings.workingHours.start}
            onChange={(e) => handleWorkingHoursChange('start', e.target.value)}
          />
          <TimePicker
            label="Until"
            value={settings.workingHours.end}
            onChange={(e) => handleWorkingHoursChange('end', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};
