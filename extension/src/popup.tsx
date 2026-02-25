import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import Dashboard from './pages/Dashboard';
import CreatePlan from './pages/CreatePlan';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { PlanProvider } from './contexts/PlanContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { Button } from './components/common/Button';
import ErrorBoundary from './components/common/ErrorBoundary'; // Import ErrorBoundary

type Page = 'dashboard' | 'createPlan' | 'progress' | 'settings';

const Popup = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'createPlan':
        return <CreatePlan />;
      case 'progress':
        return <Progress />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary> {/* Wrap the entire application with ErrorBoundary */}
      <DeviceProvider>
        <SettingsProvider>
          <PlanProvider>
            <div className="w-80 h-96 flex flex-col bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
              <nav className="flex justify-around p-2 border-b border-border-light dark:border-dark-border">
                <Button onClick={() => setCurrentPage('dashboard')} className="bg-transparent text-indigo-deep dark:text-dark-indigo hover:bg-gray-100 dark:hover:bg-dark-surface-light">Dashboard</Button>
                <Button onClick={() => setCurrentPage('createPlan')} className="bg-transparent text-indigo-deep dark:text-dark-indigo hover:bg-gray-100 dark:hover:bg-dark-surface-light">Create Plan</Button>
                <Button onClick={() => setCurrentPage('progress')} className="bg-transparent text-indigo-deep dark:text-dark-indigo hover:bg-gray-100 dark:hover:bg-dark-surface-light">Progress</Button>
                <Button onClick={() => setCurrentPage('settings')} className="bg-transparent text-indigo-deep dark:text-dark-indigo hover:bg-gray-100 dark:hover:bg-dark-surface-light">Settings</Button>
              </nav>
              <div className="flex-grow overflow-y-auto">
                {renderPage()}
              </div>
            </div>
          </PlanProvider>
        </SettingsProvider>
      </DeviceProvider>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);