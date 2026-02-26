import React from 'react';
import { TimePicker } from '../common/TimePicker';
import { useSettingsContext } from '../../contexts/SettingsContext';

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useSettingsContext();

  if (loading) {
    return <div className="skeleton" style={{ height: 120, borderRadius: 14 }} />;
  }

  const handleQuiet = (type: 'start' | 'end', value: string) =>
    updateSettings({ quietHours: { ...settings.quietHours, [type]: value } });

  const handleWorking = (type: 'start' | 'end', value: string) =>
    updateSettings({ workingHours: { ...settings.workingHours, [type]: value } });

  const TimeRow = ({
    icon, title, subtitle, iconBg, iconColor, values, onChange,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    iconBg: string;
    iconColor: string;
    values: { start: string; end: string };
    onChange: (type: 'start' | 'end', v: string) => void;
  }) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: iconBg, color: iconColor,
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{title}</p>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>{subtitle}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingLeft: 42 }}>
        <div>
          <label className="label">From</label>
          <TimePicker value={values.start} onChange={e => onChange('start', e.target.value)} />
        </div>
        <div>
          <label className="label">Until</label>
          <TimePicker value={values.end} onChange={e => onChange('end', e.target.value)} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <p className="section-header">Notification Hours</p>

      <TimeRow
        icon={<MoonIcon />}
        title="Quiet Hours"
        subtitle="Pause notifications"
        iconBg="hsl(211,52%,25%,0.1)"
        iconColor="var(--primary)"
        values={settings.quietHours}
        onChange={handleQuiet}
      />

      <div style={{ height: 1, background: 'var(--border)' }} />

      <TimeRow
        icon={<VolumeIcon />}
        title="Active Hours"
        subtitle="Deliver readings"
        iconBg="hsl(27,55%,51%,0.1)"
        iconColor="var(--accent)"
        values={settings.workingHours}
        onChange={handleWorking}
      />
    </div>
  );
};
