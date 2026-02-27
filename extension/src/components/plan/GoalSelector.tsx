import React from 'react';

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const CompassIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
  </svg>
);

interface GoalSelectorProps {
  targetDate: string;
  onTargetDateChange: (date: string) => void;
  maxVersesPerUnit: number;
  onMaxVersesChange: (verses: number) => void;
  timeLapMinutes: number;
  onTimeLapMinutesChange: (minutes: number) => void;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  targetDate,
  onTargetDateChange,
  maxVersesPerUnit,
  onMaxVersesChange,
  timeLapMinutes,
  onTimeLapMinutesChange,
}) => {
  const lapOptions = [15, 30, 45, 60, 90, 120, 180, 240, 360, 480];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-primary mb-1">Set Your Pace</h2>
        <p className="text-sm text-muted-foreground italic">"I press on toward the goal..." — Philippians 3:14</p>
      </div>

      <div className="space-y-4">
        {/* Completion Date Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 text-accent rounded-lg">
              <CalendarIcon />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Target Completion</h3>
              <p className="text-[11px] text-muted-foreground">When do you hope to finish this journey?</p>
            </div>
          </div>

          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => onTargetDateChange(e.target.value)}
            className="w-full bg-background border border-border rounded-lg p-3 text-foreground focus:ring-2 focus:ring-accent/50 outline-none transition-all"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Daily Frequency (Time Lap) Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Time Lap</h3>
              <p className="text-[11px] text-muted-foreground">Interval between notifications</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {lapOptions.map((mins) => (
              <button
                key={mins}
                onClick={() => onTimeLapMinutesChange(mins)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${timeLapMinutes === mins
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'bg-secondary text-muted-foreground hover:bg-border'
                  }`}
              >
                {mins < 60 ? `${mins}m` : `${mins / 60}h`}
              </button>
            ))}
          </div>

          <div className="flex justify-between px-1">
            <span className="text-[10px] text-muted-foreground font-medium">FREQUENT</span>
            <span className="text-[10px] text-muted-foreground font-medium">SPACED</span>
          </div>
        </div>

        {/* Verse Limit Card */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-success/10 text-success rounded-lg">
              <CompassIcon />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Portion Size</h3>
              <p className="text-[11px] text-muted-foreground">Max verses per delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <input
              type="range"
              id="maxVerses"
              value={maxVersesPerUnit}
              onChange={(e) => onMaxVersesChange(parseInt(e.target.value))}
              min="1"
              max="50"
              className="flex-1 accent-success"
            />
            <span className="w-10 text-center font-bold text-lg text-success">{maxVersesPerUnit}</span>
          </div>

          <div className="flex justify-between px-1">
            <span className="text-[10px] text-muted-foreground font-medium">BITE-SIZED</span>
            <span className="text-[10px] text-muted-foreground font-medium">DEEP STUDY</span>
          </div>

          <p className="mt-4 text-[11px] text-center text-muted-foreground italic bg-muted/30 py-2 rounded-lg border border-dashed border-border/50">
            {maxVersesPerUnit <= 5
              ? "Small daily portions to meditate upon throughout your day."
              : maxVersesPerUnit <= 15
                ? "A balanced rhythm for growth and understanding."
                : "A vigorous pace for those seeking deep immersion."}
          </p>
        </div>
      </div>
    </div>
  );
};
