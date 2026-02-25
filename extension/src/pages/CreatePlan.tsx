import React from 'react';
import { BookSelector } from '../components/plan/BookSelector';
import { GoalSelector } from '../components/plan/GoalSelector';
import { RhythmSettings } from '../components/plan/RhythmSettings';
import { PlanReview } from '../components/plan/PlanReview';

const CreatePlan = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo">Create New Plan</h1>
      <BookSelector />
      <GoalSelector />
      <RhythmSettings />
      <PlanReview />
    </div>
  );
};

export default CreatePlan;