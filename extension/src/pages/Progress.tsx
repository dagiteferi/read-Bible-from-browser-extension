import { TimelineChart } from '../components/progress/TimelineChart';
import { UnitList } from '../components/progress/UnitList';
import { Statistics } from '../components/progress/Statistics';

const Progress = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Page header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--card)',
      }}>
        <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>Growth</h1>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
          Your journey through the Word
        </p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Statistics />
        <TimelineChart />
        <UnitList />
      </div>
    </div>
  );
};

export default Progress;