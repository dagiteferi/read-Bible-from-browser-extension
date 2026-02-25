import React from 'react';
import { ActivePlanCard } from '../components/dashboard/ActivePlanCard';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { NextNotification } from '../components/dashboard/NextNotification';

const Dashboard = () => {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo">Dashboard</h1>
      <ActivePlanCard />
      <StatsOverview />
      <NextNotification />
    </div>
  );
};

export default Dashboard;