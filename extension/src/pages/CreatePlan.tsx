import React, { useState } from 'react';
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
  const { createPlan, setActivePlan } = usePlanContext();
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

  const handleCreatePlan = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // TODO: Implement proper boundaries selection
      const planData: CreatePlanRequest = {
        books: selectedBooks,
        target_date: targetDate,
        frequency: 'daily', // Assuming daily for now
        max_verses: maxVersesPerUnit,
        boundaries: {
          start_book: selectedBooks[0] || 'Genesis',
          start_chapter: 1,
          start_verse: 1,
          end_book: selectedBooks[selectedBooks.length - 1] || 'Revelation',
          end_chapter: 1, // Placeholder
          end_verse: 1,   // Placeholder
        },
        quiet_hours: quietHours,
      };
      const newPlan = await createPlan(planData);
      if (newPlan) {
        setSuccess('Plan created successfully!');
        // Reset form
        setStep(1);
        setSelectedBooks([]);
        setTargetDate('');
        setMaxVersesPerUnit(10);
        setQuietHours(settings.quietHours);
        setWorkingHours(settings.workingHours);
      } else {
        setError('Failed to create plan. Check console for details.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create plan.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BookSelector
            selectedBooks={selectedBooks}
            onBookSelect={setSelectedBooks}
          />
        );
      case 2:
        return (
          <GoalSelector
            targetDate={targetDate}
            onTargetDateChange={setTargetDate}
            maxVersesPerUnit={maxVersesPerUnit}
            onMaxVersesChange={setMaxVersesPerUnit}
          />
        );
      case 3:
        return (
          <RhythmSettings
            quietHours={quietHours}
            onQuietHoursChange={setQuietHours}
            workingHours={workingHours}
            onWorkingHoursChange={setWorkingHours}
          />
        );
      case 4:
        return (
          <PlanReview
            selectedBooks={selectedBooks}
            targetDate={targetDate}
            maxVersesPerUnit={maxVersesPerUnit}
            quietHours={quietHours}
            workingHours={workingHours}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo">Create New Plan</h1>
      {error && <p className="text-burgundy-curtain">{error}</p>}
      {success && <p className="text-olive-mountain">{success}</p>}
      {renderStep()}
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <Button onClick={() => setStep(prev => prev - 1)} disabled={loading}>
            Previous
          </Button>
        )}
        {step < 4 && (
          <Button onClick={() => setStep(prev => prev + 1)} disabled={loading || selectedBooks.length === 0}>
            Next
          </Button>
        )}
        {step === 4 && (
          <Button onClick={handleCreatePlan} disabled={loading}>
            {loading ? 'Creating...' : 'Create Plan'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatePlan;