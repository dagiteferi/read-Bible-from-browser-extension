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

      <div className="space-y-32 relative before:absolute before:left-0 before:top-8 before:bottom-8 before:w-1 before:bg-border-light dark:before:bg-night-border ml-4 pl-24 pt-4">
        {/* Stillness */}
        <div className="space-y-16 relative">
          <div className="absolute -left-[29px] top-1 w-9 h-9 border-2 border-burgundy-curtain bg-white dark:bg-night-bg rounded-full shadow-sm flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-burgundy-curtain">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-burgundy-curtain">
              Times of Stillness (Quiet)
            </h3>
            <p className="text-[10px] text-text-secondary dark:text-night-text-muted mt-1 italic">
              No notifications will disturb your peace during these hours.
            </p>
          </div>
          <div className="flex items-center gap-12 bg-white dark:bg-night-surface p-16 rounded-sacred border border-border-light dark:border-night-border shadow-sm">
            <div className="flex-1">
              <TimePicker
                label="From"
                value={quietHours.start}
                onChange={(e) => onQuietHoursChange({ ...quietHours, start: e.target.value })}
              />
            </div>
            <div className="w-[1px] h-32 bg-border-light dark:bg-night-border"></div>
            <div className="flex-1">
              <TimePicker
                label="Until"
                value={quietHours.end}
                onChange={(e) => onQuietHoursChange({ ...quietHours, end: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Listening */}
        <div className="space-y-16 relative">
          <div className="absolute -left-[29px] top-1 w-9 h-9 border-2 border-olive-mountain bg-white dark:bg-night-bg rounded-full shadow-sm flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-olive-mountain">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-olive-mountain">
              Times of Listening (Active)
            </h3>
            <p className="text-[10px] text-text-secondary dark:text-night-text-muted mt-1 italic">
              Scripture will be delivered within this sacred window.
            </p>
          </div>
          <div className="flex items-center gap-12 bg-white dark:bg-night-surface p-16 rounded-sacred border border-border-light dark:border-night-border shadow-sm">
            <div className="flex-1">
              <TimePicker
                label="From"
                value={workingHours.start}
                onChange={(e) => onWorkingHoursChange({ ...workingHours, start: e.target.value })}
              />
            </div>
            <div className="w-[1px] h-32 bg-border-light dark:bg-night-border"></div>
            <div className="flex-1">
              <TimePicker
                label="Until"
                value={workingHours.end}
                onChange={(e) => onWorkingHoursChange({ ...workingHours, end: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
