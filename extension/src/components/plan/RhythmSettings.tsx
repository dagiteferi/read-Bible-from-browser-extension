import React from 'react';
import { Card } from '../common/Card';
import { TimePicker } from '../common/TimePicker';
import { TimeRange } from '../../types/storage';

interface RhythmSettingsProps {
  quietHours: TimeRange;
  onQuietHoursChange: (hours: TimeRange) => void;
  workingHours: TimeRange;
  onWorkingHoursChange: (hours: TimeRange) => void;
}

export const RhythmSettings: React.FC<RhythmSettingsProps> = ({
  quietHours,
  onQuietHoursChange,
  workingHours,
  onWorkingHoursChange,
}) => {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Times of Stillness & Listening</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Set your quiet hours (when you prefer no notifications) and listening hours (when you prefer to receive readings).
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <h3 className="font-medium text-indigo-deep dark:text-dark-indigo mb-2">Quiet Hours (Times of Stillness)</h3>
          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={quietHours.start}
              onChange={(e) => onQuietHoursChange({ ...quietHours, start: e.target.value })}
            />
            <TimePicker
              label="End Time"
              value={quietHours.end}
              onChange={(e) => onQuietHoursChange({ ...quietHours, end: e.target.value })}
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
              value={workingHours.start}
              onChange={(e) => onWorkingHoursChange({ ...workingHours, start: e.target.value })}
            />
            <TimePicker
              label="End Time"
              value={workingHours.end}
              onChange={(e) => onWorkingHoursChange({ ...workingHours, end: e.target.value })}
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
