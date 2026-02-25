import React from 'react';
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
    <div className="space-y-24 animate-fade-in">
      <div className="space-y-8">
        <h2 className="text-18 font-medium text-indigo-prayer dark:text-night-text uppercase tracking-widest">
          The Rhythm
        </h2>
        <p className="text-text-secondary dark:text-night-text-muted text-sm italic">
          Align the Word with your daily life.
        </p>
      </div>

      <div className="space-y-32 relative before:absolute before:left-0 before:top-8 before:bottom-8 before:w-1 before:bg-border-light dark:before:bg-night-border ml-4 pl-24">
        {/* Stillness */}
        <div className="space-y-12 relative">
          <div className="absolute -left-[29px] top-4 w-9 h-9 border-2 border-burgundy-curtain bg-white dark:bg-night-bg rounded-full shadow-sm" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-burgundy-curtain">
            Times of Stillness (Quiet)
          </h3>
          <div className="grid grid-cols-2 gap-16">
            <TimePicker
              label="From"
              value={quietHours.start}
              onChange={(e) => onQuietHoursChange({ ...quietHours, start: e.target.value })}
            />
            <TimePicker
              label="Until"
              value={quietHours.end}
              onChange={(e) => onQuietHoursChange({ ...quietHours, end: e.target.value })}
            />
          </div>
          <p className="text-[10px] text-text-secondary dark:text-night-text-muted opacity-70">
            No notifications will disturb your peace during these hours.
          </p>
        </div>

        {/* Listening */}
        <div className="space-y-12 relative">
          <div className="absolute -left-[29px] top-4 w-9 h-9 border-2 border-olive-mountain bg-white dark:bg-night-bg rounded-full shadow-sm" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-olive-mountain">
            Times of Listening (Active)
          </h3>
          <div className="grid grid-cols-2 gap-16">
            <TimePicker
              label="From"
              value={workingHours.start}
              onChange={(e) => onWorkingHoursChange({ ...workingHours, start: e.target.value })}
            />
            <TimePicker
              label="Until"
              value={workingHours.end}
              onChange={(e) => onWorkingHoursChange({ ...workingHours, end: e.target.value })}
            />
          </div>
          <p className="text-[10px] text-text-secondary dark:text-night-text-muted opacity-70">
            Scripture will be delivered within this sacred window.
          </p>
        </div>
      </div>
    </div>
  );
};
