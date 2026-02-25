import React from 'react';
import { usePlanContext } from '../../contexts/PlanContext';
import { useSettingsContext } from '../../contexts/SettingsContext';
import { getNextNotificationTime } from '../../utils/dateHelpers';

const BookOpenIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const ActivePlanCard: React.FC = () => {
  const { currentPlan, progress, loading, error } = usePlanContext();
  const { settings } = useSettingsContext();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 18, width: '60%' }} />
        <div className="skeleton" style={{ height: 14, width: '80%' }} />
        <div className="skeleton" style={{ height: 8, width: '100%', marginTop: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <AlertIcon />
        <span>ወዮ! {error.message}</span>
      </div>
    );
  }

  if (!currentPlan) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        gap: 16,
      }}>
        <div
          className="icon-box icon-box-xl icon-box-gradient animate-candle-glow"
        >
          <BookOpenIcon />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 17, color: 'var(--foreground)', marginBottom: 6 }}>
            Ready to begin?
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted-foreground)', lineHeight: 1.5 }}>
            No active plan found. Set a rhythm for your daily bread.
          </p>
        </div>
        <button className="btn btn-primary" style={{ marginTop: 4 }}>
          Start New Plan
        </button>
      </div>
    );
  }

  const completionPercentage = progress && progress.total_units > 0
    ? (progress.completed_units / progress.total_units) * 100 : 0;

  const nextNotification = getNextNotificationTime(new Date(), settings.workingHours, settings.quietHours);

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: 'var(--gradient-amber)',
        opacity: 0.06,
      }} />

      <div style={{ position: 'relative' }}>
        {/* Label */}
        <p className="section-header" style={{ marginBottom: 4 }}>Active Plan</p>

        {/* Book name */}
        <p className="amharic-text" style={{
          fontSize: 17, fontWeight: 700, color: 'var(--accent)',
          marginBottom: 14, lineHeight: 1.4,
        }}>
          {currentPlan.books.join('፣ ')}
        </p>

        {/* Progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-foreground)' }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--accent)' }}>
            <ClockIcon />
            <span style={{ fontSize: 12 }}>
              Next: {nextNotification.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <span className="badge badge-muted">
            {progress?.completed_units || 0}/{progress?.total_units || 0} Units
          </span>
        </div>
      </div>
    </div>
  );
};
