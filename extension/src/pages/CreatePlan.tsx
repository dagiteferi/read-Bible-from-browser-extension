import { useState } from 'react';
import { BookSelector } from '../components/plan/BookSelector';
import { GoalSelector } from '../components/plan/GoalSelector';
import { RhythmSettings } from '../components/plan/RhythmSettings';
import { PlanReview } from '../components/plan/PlanReview';
import { Button } from '../components/common/Button';
import { usePlanContext } from '../contexts/PlanContext';
import { useSettingsContext } from '../contexts/SettingsContext';
import { CreatePlanRequest } from '../types/api';
import { TimeRange } from '../types/storage';

const CreatePlan = () => {
  const { createPlan } = usePlanContext();
  const { settings } = useSettingsContext();

  const [step, setStep] = useState(1);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState('');
  const [maxVersesPerUnit, setMaxVersesPerUnit] = useState(10);
  const [quietHours, setQuietHours] = useState<TimeRange>(settings.quietHours);
  const [workingHours, setWorkingHours] = useState<TimeRange>(settings.workingHours);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const steps = [
    { id: 1, name: 'Selection' },
    { id: 2, name: 'Goal' },
    { id: 3, name: 'Rhythm' },
    { id: 4, name: 'Sanctify' }
  ];

  const handleCreatePlan = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const planData: CreatePlanRequest = {
        books: selectedBooks,
        target_date: targetDate,
        frequency: 'daily',
        max_verses: maxVersesPerUnit,
        boundaries: {
          start_book: selectedBooks[0] || 'Genesis',
          start_chapter: 1,
          start_verse: 1,
          end_book: selectedBooks[selectedBooks.length - 1] || 'Revelation',
          end_chapter: 1,
          end_verse: 1,
        },
        quiet_hours: quietHours,
      };
      const newPlan = await createPlan(planData);
      if (newPlan) {
        setSuccess('እቅድዎ በተሳካ ሁኔታ ተፈጥሯል (Plan created successfully!)');
        setStep(1);
        setSelectedBooks([]);
        setTargetDate('');
        setMaxVersesPerUnit(10);
      } else {
        setError('Failed to create plan.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create plan.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <BookSelector selectedBooks={selectedBooks} onBookSelect={setSelectedBooks} />;
      case 2: return <GoalSelector targetDate={targetDate} onTargetDateChange={setTargetDate} maxVersesPerUnit={maxVersesPerUnit} onMaxVersesChange={setMaxVersesPerUnit} />;
      case 3: return <RhythmSettings quietHours={quietHours} onQuietHoursChange={setQuietHours} workingHours={workingHours} onWorkingHoursChange={setWorkingHours} />;
      case 4: return <PlanReview selectedBooks={selectedBooks} targetDate={targetDate} maxVersesPerUnit={maxVersesPerUnit} quietHours={quietHours} workingHours={workingHours} />;
      default: return null;
    }
  };

  return (
    <div className="p-24 space-y-24 animate-fade-in parchment min-h-screen">
      <header className="space-y-16">
        <h1 className="text-24 font-medium text-indigo-prayer dark:text-night-text">Create Plan</h1>

        {/* Step Indicator */}
        <div className="flex items-center justify-between px-8">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-4">
              <div className={`w-12 h-12 rounded-full transition-all duration-300 ${step >= s.id ? 'bg-amber-spirit scale-110 shadow-amber-glow' : 'bg-border-light dark:bg-night-border'
                }`} />
              <span className={`text-[10px] uppercase tracking-widest font-bold ${step === s.id ? 'text-indigo-prayer dark:text-night-amber' : 'text-text-secondary opacity-50'
                }`}>
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="success-message">
          <p>{success}</p>
        </div>
      )}

      <main className="min-h-[300px]">
        {renderStep()}
      </main>

      <footer className="flex justify-between items-center pt-24 border-t border-border-light dark:border-night-border">
        {step > 1 ? (
          <Button variant="ghost" onClick={() => setStep(prev => prev - 1)} disabled={loading}>
            Back
          </Button>
        ) : <div />}

        {step < 4 ? (
          <Button
            variant="primary"
            onClick={() => setStep(prev => prev + 1)}
            disabled={loading || (step === 1 && selectedBooks.length === 0)}
          >
            Continue
          </Button>
        ) : (
          <Button variant="primary" onClick={handleCreatePlan} loading={loading}>
            Begin Journey
          </Button>
        )}
      </footer>
    </div>
  );
};

export default CreatePlan;