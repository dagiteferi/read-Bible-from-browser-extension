import React from 'react';
import { usePlanContext } from '../../contexts/PlanContext';

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const StatsOverview: React.FC = () => {
  const { progress, loading, error } = usePlanContext();

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="skeleton" style={{ height: 70, borderRadius: 12 }} />
        <div className="skeleton" style={{ height: 70, borderRadius: 12 }} />
      </div>
    );
  }

  if (error) return null;

  const stats = [
    {
      label: 'Verses Read',
      value: progress?.completed_verses ?? 0,
      icon: <BookIcon />,
      color: 'var(--accent)',
      bgColor: 'hsl(27, 55%, 51%, 0.1)',
    },
    {
      label: 'Units Done',
      value: progress?.completed_units ?? 0,
      icon: <ActivityIcon />,
      color: 'var(--success)',
      bgColor: 'hsl(103, 10%, 39%, 0.1)',
    },
  ];

  const completionPct = progress && progress.total_units > 0
    ? Math.round((progress.completed_units / progress.total_units) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p className="section-header">Milestones</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card-sm" style={{ textAlign: 'center' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: stat.bgColor, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px auto', color: stat.color,
            }}>
              {stat.icon}
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)', marginTop: 3 }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {completionPct > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', borderRadius: 10,
          background: 'hsl(103, 10%, 39%, 0.08)',
          border: '1px solid hsl(103, 10%, 39%, 0.15)',
        }}>
          <div style={{ color: 'var(--success)' }}>
            <CheckIcon />
          </div>
          <span style={{ fontSize: 13, color: 'var(--success)', fontWeight: 500 }}>
            {completionPct}% of plan complete
          </span>
        </div>
      )}
    </div>
  );
};
