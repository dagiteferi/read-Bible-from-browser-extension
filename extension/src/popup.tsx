import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import Dashboard from './pages/Dashboard'; // Assuming Dashboard is the default view
import { PlanProvider } from './contexts/PlanContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { DeviceProvider } from './contexts/DeviceContext';

const Popup = () => {
  return (
    <DeviceProvider>
      <SettingsProvider>
        <PlanProvider>
          <div className="w-80 h-96 flex flex-col bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
            <Dashboard />
          </div>
        </PlanProvider>
      </SettingsProvider>
    </DeviceProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);