import React from 'react';
import { TimePicker } from '../common/TimePicker';
import { TimeRange } from '../../types/storage';

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="18.36" x2="5.64" y2="16.93"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

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
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary mb-1">Your Sacred Rhythm</h2>
        <p className="text-sm text-muted-foreground italic">"To everything there is a season..." — Ecclesiastes 3:1</p>
      </div>

      <div className="space-y-4">
        {/* Stillness Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-destructive/40"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-destructive/10 text-destructive rounded-lg">
              <MoonIcon />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Times of Stillness</h3>
              <p className="text-[11px] text-muted-foreground italic">No notifications will disturb your peace.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Quiet From"
              value={quietHours.start}
              onChange={(e) => onQuietHoursChange({ ...quietHours, start: e.target.value })}
            />
            <TimePicker
              label="Quiet Until"
              value={quietHours.end}
              onChange={(e) => onQuietHoursChange({ ...quietHours, end: e.target.value })}
            />
          </div>
        </div>

        {/* Listening Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-success/40"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <SunIcon />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Times of Listening</h3>
              <p className="text-[11px] text-muted-foreground italic">Scripture will be delivered in this window.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TimePicker
              label="Active From"
              value={workingHours.start}
              onChange={(e) => onWorkingHoursChange({ ...workingHours, start: e.target.value })}
            />
            <TimePicker
              label="Active Until"
              value={workingHours.end}
              onChange={(e) => onWorkingHoursChange({ ...workingHours, end: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-muted/20 p-4 rounded-lg border border-border border-dashed">
          <p className="text-[11px] text-center text-muted-foreground">
            Plan wisely. Setting a generous listening window ensures the system can bridge any missed portions gracefully.
          </p>
        </div>
      </div>
    </div>
  );
};
