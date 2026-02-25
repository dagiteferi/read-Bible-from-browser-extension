import React from 'react';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getNextNotificationTime } from '../../utils/dateHelpers';

export const NextNotification: React.FC = () => {
  const { settings, loading } = useSettingsContext();

  if (loading) return <div className="loading-pulse w-80 h-32" />;

  const nextNotification = getNextNotificationTime(new Date(), settings.workingHours, settings.quietHours);

  return (
    <div className="flex items-center gap-8 bg-amber-spirit bg-opacity-10 px-12 py-6 rounded-full border border-amber-spirit border-opacity-20 animate-fade-in group hover:bg-opacity-20 transition-all cursor-default">
      <div className="text-amber-spirit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path>
          <path d="M12 18v4"></path>
          <path d="M4.93 4.93l2.83 2.83"></path>
          <path d="M16.24 16.24l2.83 2.83"></path>
          <path d="M2 12h4"></path>
          <path d="M18 12h4"></path>
          <path d="M4.93 19.07l2.83-2.83"></path>
          <path d="M16.24 7.76l2.83-2.83"></path>
        </svg>
      </div>
      <span className="text-12 font-bold text-amber-spirit-warm tracking-tight">
        {nextNotification.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};
