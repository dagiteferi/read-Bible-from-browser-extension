import React from 'react';
import { TimelineChart } from '../components/progress/TimelineChart';
import { UnitList } from '../components/progress/UnitList';
import { Statistics } from '../components/progress/Statistics';

const Progress = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo">Your Progress</h1>
      <TimelineChart />
      <UnitList />
      <Statistics />
    </div>
  );
};

export default Progress;