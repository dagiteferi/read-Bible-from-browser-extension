import React from 'react';
import { usePlanContext } from '../../contexts/PlanContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getNextNotificationTime } from '../../utils/dateHelpers';

const BellIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const NextNotification: React.FC = () => {
  const { currentPlan } = usePlanContext();
  const { settings } = useSettingsContext();

  if (!currentPlan) return null;

  const nextTime = getNextNotificationTime(new Date(), settings.workingHours, settings.quietHours);
  const timeStr = nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 99,
      background: 'hsl(27, 55%, 51%, 0.12)',
      border: '1px solid hsl(27, 55%, 51%, 0.2)',
    }}>
      <span style={{ color: 'var(--accent)' }}>
        <BellIcon />
      </span>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
        {timeStr}
      </span>
    </div>
  );
};
