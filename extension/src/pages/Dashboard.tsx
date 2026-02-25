import React from 'react';
import { ActivePlanCard } from '../components/dashboard/ActivePlanCard';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { NextNotification } from '../components/dashboard/NextNotification';

const Dashboard = () => {
  return (
    <div className="p-24 space-y-24 animate-fade-in parchment min-h-screen">
      <header className="flex justify-between items-center">
        <h1 className="text-24 font-medium text-indigo-prayer dark:text-night-text">
          My Journey
        </h1>
        <NextNotification />
      </header>

      <main className="space-y-24">
        <ActivePlanCard />
        <StatsOverview />
      </main>
    </div>
  );
};

export default Dashboard;