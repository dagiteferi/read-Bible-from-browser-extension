import { useState } from 'react';
import { BookSelector } from '../components/plan/BookSelector';
import { GoalSelector } from '../components/plan/GoalSelector';
import { RhythmSettings } from '../components/plan/RhythmSettings';
import { PlanReview } from '../components/plan/PlanReview';
import { usePlanContext } from '../contexts/PlanContext';
import { useSettingsContext } from '../contexts/SettingsContext';
import { CreatePlanRequest } from '../types/api';
import { TimeRange } from '../types/storage';


const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ShuffleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8" />
    <line x1="4" y1="20" x2="21" y2="3" />
    <polyline points="21 16 21 21 16 21" />
    <line x1="15" y1="15" x2="21" y2="21" />
    <line x1="4" y1="4" x2="9" y2="9" />
  </svg>
);

const ListIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

type PlanMode = 'random' | 'planned' | null;


const PLANNED_STEPS = [
  { id: 1, label: 'Books' },
  { id: 2, label: 'Goal' },
  { id: 3, label: 'Hours' },
  { id: 4, label: 'Review' },
];


interface ModeCardProps {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}

const ModeCard = ({ selected, onClick, icon, title, description, badge, badgeColor }: ModeCardProps) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', textAlign: 'left', padding: '16px',
      borderRadius: 14, cursor: 'pointer',
      border: selected ? '2px solid var(--accent)' : '2px solid var(--border)',
      background: selected ? 'hsl(27,55%,51%,0.07)' : 'var(--card)',
      transition: 'all 0.2s ease',
      position: 'relative',
      outline: 'none',
    }}
  >
    {/* Selected checkmark */}
    {selected && (
      <div style={{
        position: 'absolute', top: 12, right: 12,
        width: 22, height: 22, borderRadius: '50%',
        background: 'var(--accent)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        color: 'white',
      }}>
        <CheckIcon />
      </div>
    )}

    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
      {/* Icon box */}
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? 'var(--gradient-amber)' : 'var(--secondary)',
        color: selected ? 'white' : 'var(--accent)',
        transition: 'all 0.2s ease',
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--foreground)' }}>
            {title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.05em', padding: '2px 7px', borderRadius: 99,
            background: `${badgeColor}20`, color: badgeColor,
          }}>
            {badge}
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted-foreground)', lineHeight: 1.55 }}>
          {description}
        </p>
      </div>
    </div>
  </button>
);

const CreatePlan = () => {
  const { createPlan } = usePlanContext();
  const { settings } = useSettingsContext();

  /* mode: null = mode selection screen, 'random' | 'planned' = in wizard */
  const [mode, setMode] = useState<PlanMode>(null);
  const [pendingMode, setPendingMode] = useState<'random' | 'planned'>('planned');

  /* Planned-mode wizard state */
  const [step, setStep] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [maxVersesPerUnit, setMaxVersesPerUnit] = useState(10);
  const [timeLapMinutes, setTimeLapMinutes] = useState(60);
  const [quietHours, setQuietHours] = useState<TimeRange>(settings.quietHours);
  const [workingHours, setWorkingHours] = useState<TimeRange>(settings.workingHours);



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);


  const handleConfirmMode = () => setMode(pendingMode);

  const handleCreatePlannedPlan = async () => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      const planData: CreatePlanRequest = {
        books: selectedBooks,
        target_date: targetDate || undefined,
        frequency: 'daily',
        max_verses_per_unit: maxVersesPerUnit,
        time_lap_minutes: timeLapMinutes,
        quiet_hours: quietHours,
        working_hours: workingHours,
      };
      if (selectedBooks.length > 0) {
        planData.boundaries = {
          chapter_start: 1,
          verse_start: 1,
        };
      }
      const newPlan = await createPlan(planData);
      if (newPlan) {
        setIsVerified(true);
        setSelectedBooks([]); setTargetDate(''); setMaxVersesPerUnit(10); setTimeLapMinutes(60);
      } else { setError('Failed to create plan. Please try again.'); }
    } catch (err: any) {
      setError(err.message || 'Failed to create plan.');
    } finally { setLoading(false); }
  };

  const handleCreateRandomPlan = async () => {
    setLoading(true); setError(null); setSuccess(null);
    try {
      // For random mode we create a plan with no specific books (backend picks)
      const planData: CreatePlanRequest = {
        books: ['ኦሪት ዘፍጥረት'], // Backend requires at least one book
        target_date: undefined,
        frequency: 'daily',
        max_verses_per_unit: maxVersesPerUnit,
        time_lap_minutes: timeLapMinutes,
        quiet_hours: settings.quietHours,
        working_hours: settings.workingHours,
      };
      const newPlan = await createPlan(planData);
      if (newPlan) {
        setIsVerified(true);
      } else { setError('Failed to create plan. Please try again.'); }
    } catch (err: any) {
      setError(err.message || 'Failed to create plan.');
    } finally { setLoading(false); }
  };


  if (mode === null) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--card)',
        }}>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: 'var(--foreground)' }}>New Reading Plan</h1>
          <p style={{ fontSize: 12, color: 'var(--muted-foreground)', marginTop: 2 }}>
            Choose how you want to receive the Word
          </p>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>

          {/* Success / Error messages */}
          {success && (
            <div className="alert alert-success">
              <span>✓</span> <span>{success}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error">
              <span>!</span> <span>{error}</span>
            </div>
          )}

          {/* Mode cards */}
          <ModeCard
            selected={pendingMode === 'random'}
            onClick={() => setPendingMode('random')}
            icon={<ShuffleIcon />}
            title="Random Verses"
            badge="Spontaneous"
            badgeColor="var(--accent)"
            description="Receive a fresh, Spirit-led verse each day — no planning needed. The backend picks from all books."
          />

          <ModeCard
            selected={pendingMode === 'planned'}
            onClick={() => setPendingMode('planned')}
            icon={<ListIcon />}
            title="Planned Reading"
            badge="Structured"
            badgeColor="var(--primary)"
            description="Choose your books, set a goal date, and read through Scripture at your own pace with daily deliveries."
          />

          {/* Feature comparison */}
          <div style={{
            background: 'var(--secondary)', borderRadius: 12,
            padding: '12px 14px', marginTop: 4,
          }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              What's included
            </p>
            {[
              { feature: 'Daily notifications', random: true, planned: true },
              { feature: 'Quiet hours', random: true, planned: true },
              { feature: 'Progress tracking', random: false, planned: true },
              { feature: 'Book selection', random: false, planned: true },
              { feature: 'Target date', random: false, planned: true },
            ].map(({ feature, random, planned }) => (
              <div key={feature} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: '5px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 12, color: 'var(--foreground)' }}>{feature}</span>
                <div style={{ display: 'flex', gap: 24 }}>
                  <span style={{ fontSize: 11, width: 52, textAlign: 'center', color: random ? 'var(--success)' : 'var(--muted-foreground)' }}>
                    {random ? '✓' : '—'}
                  </span>
                  <span style={{ fontSize: 11, width: 52, textAlign: 'center', color: planned ? 'var(--success)' : 'var(--muted-foreground)' }}>
                    {planned ? '✓' : '—'}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 24, marginTop: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, width: 52, textAlign: 'center', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Random</span>
              <span style={{ fontSize: 10, fontWeight: 700, width: 52, textAlign: 'center', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>Planned</span>
            </div>
          </div>

          {/* Confirm button */}
          <button
            className="btn btn-accent btn-full btn-lg"
            style={{ marginTop: 'auto' }}
            onClick={pendingMode === 'random' ? handleCreateRandomPlan : handleConfirmMode}
            disabled={loading}
          >
            {loading ? (
              <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : pendingMode === 'random' ? 'Deliver Random Verses' : 'Set Up Planned Reading →'}
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     RENDER — RANDOM MODE (minimal config)
  ═══════════════════════════════════════ */
  if (mode === 'random') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--border)', background: 'var(--card)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => setMode(null)} style={{ flexShrink: 0 }}>
            <BackIcon />
          </button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--foreground)' }}>Random Verses</h1>
            <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Configure your daily delivery</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          {error && <div className="alert alert-error"><span>!</span><span>{error}</span></div>}

          {/* Verses per day */}
          <div className="card">
            <p className="section-header">Daily Verses</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: 'var(--foreground)' }}>Verses per delivery</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)' }}>{maxVersesPerUnit}</span>
            </div>
            <input
              type="range" min={1} max={10} value={maxVersesPerUnit}
              onChange={e => setMaxVersesPerUnit(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Short</span>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Deep</span>
            </div>
          </div>

          {/* Quiet hours */}
          <div className="card">
            <p className="section-header">Quiet Hours</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="label">From</label>
                <input type="time" className="input" value={quietHours.start}
                  onChange={e => setQuietHours(h => ({ ...h, start: e.target.value }))} />
              </div>
              <div>
                <label className="label">Until</label>
                <input type="time" className="input" value={quietHours.end}
                  onChange={e => setQuietHours(h => ({ ...h, end: e.target.value }))} />
              </div>
            </div>
          </div>

          <button className="btn btn-accent btn-full btn-lg" onClick={handleCreateRandomPlan} disabled={loading} style={{ marginTop: 'auto' }}>
            {loading
              ? <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : 'Start Random Delivery'}
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════
     RENDER — PLANNED WIZARD
  ═══════════════════════════════════════ */
  const totalSteps = PLANNED_STEPS.length;
  const canProceed = step === 1 ? selectedBooks.length > 0 : true;

  const renderStep = () => {
    switch (step) {
      case 1: return <BookSelector selectedBooks={selectedBooks} onBookSelect={setSelectedBooks} />;
      case 2: return (
        <GoalSelector
          targetDate={targetDate}
          onTargetDateChange={setTargetDate}
          maxVersesPerUnit={maxVersesPerUnit}
          onMaxVersesChange={setMaxVersesPerUnit}
          timeLapMinutes={timeLapMinutes}
          onTimeLapMinutesChange={setTimeLapMinutes}
        />
      );
      case 3: return <RhythmSettings quietHours={quietHours} onQuietHoursChange={setQuietHours} workingHours={workingHours} onWorkingHoursChange={setWorkingHours} />;
      case 4: return <PlanReview selectedBooks={selectedBooks} targetDate={targetDate} maxVersesPerUnit={maxVersesPerUnit} timeLapMinutes={timeLapMinutes} quietHours={quietHours} workingHours={workingHours} />;
      default: return null;
    }
  };

  if (isVerified) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[500px] p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-4">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-primary">Vow Verified</h1>
        <p className="text-muted-foreground italic">"Your word is a lamp to my feet and a light to my path."</p>

        <div className="w-full bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-border/50 pb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Version</span>
            <span className="text-sm font-bold text-foreground">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Heartbeat Gap</span>
            <span className="text-sm font-bold text-foreground">15 Minutes</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed px-4">
          The system will now quietly watch for the right moment to deliver your scripture based on your sacred rhythm.
        </p>

        <button
          className="btn btn-primary btn-full mt-8"
          onClick={() => {
            setIsVerified(false);
            setMode(null);
            setStep(1);
          }}
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Header with back + step label */}
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--border)',
        background: 'var(--card)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <button className="btn btn-ghost btn-icon" onClick={() => step > 1 ? setStep(s => s - 1) : setMode(null)}>
          <BackIcon />
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1 }}>
            Step {step} of {totalSteps}
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', marginTop: 2 }}>
            {PLANNED_STEPS[step - 1].label}
          </p>
        </div>
      </div>

      {/* Step indicator bar */}
      <div style={{
        display: 'flex', gap: 4, padding: '10px 16px',
        background: 'var(--card)', borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        {PLANNED_STEPS.map((s) => (
          <div
            key={s.id}
            style={{
              flex: 1, height: 4, borderRadius: 99,
              background: s.id <= step ? 'var(--accent)' : 'var(--border)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Alert messages */}
      <div style={{ padding: '0 16px' }}>
        {error && <div className="alert alert-error" style={{ marginTop: 12 }}><span>!</span><span>{error}</span></div>}
        {success && <div className="alert alert-success" style={{ marginTop: 12 }}><span>✓</span><span>{success}</span></div>}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        {renderStep()}
      </div>

      {/* Navigation footer */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--card)', display: 'flex', justifyContent: 'flex-end', flexShrink: 0,
      }}>
        {step < totalSteps ? (
          <button
            className="btn btn-primary"
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed || loading}
          >
            Continue →
          </button>
        ) : (
          <button
            className="btn btn-accent"
            onClick={handleCreatePlannedPlan}
            disabled={loading}
          >
            {loading
              ? <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : 'Begin Journey ✦'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePlan;