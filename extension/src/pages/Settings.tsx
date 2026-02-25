import { NotificationSettings } from '../components/settings/NotificationSettings';
import { DisplaySettings } from '../components/settings/DisplaySettings';
import { DataManagement } from '../components/settings/DataManagement';

const Settings = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Page header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
      }}>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>Settings</h1>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
          Customize your reading experience
        </p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DisplaySettings />
        <NotificationSettings />
        <DataManagement />
      </div>
    </div>
  );
};

export default Settings;