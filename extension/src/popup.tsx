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
import ErrorBoundary from './components/common/ErrorBoundary';

type Page = 'dashboard' | 'createPlan' | 'progress' | 'settings';

const Popup = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    },
    {
      id: 'createPlan',
      label: 'Plan',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
    },
    {
      id: 'progress',
      label: 'Growth',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
    },
    {
      id: 'settings',
      label: 'Sanctuary',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    },
  ];

  return (
    <ErrorBoundary>
      <DeviceProvider>
        <SettingsProvider>
          <PlanProvider>
            <div className="w-[400px] h-[600px] flex flex-col parchment shadow-2xl relative overflow-hidden">
              <main className="flex-grow overflow-y-auto custom-scrollbar">
                {(() => {
                  switch (currentPage) {
                    case 'dashboard': return <Dashboard />;
                    case 'createPlan': return <CreatePlan />;
                    case 'progress': return <Progress />;
                    case 'settings': return <Settings />;
                    default: return <Dashboard />;
                  }
                })()}
              </main>

              <nav className="flex justify-around items-center px-16 py-8 bg-white dark:bg-night-surface border-t border-border-light dark:border-night-border z-50">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex flex-col items-center gap-4 px-12 py-8 rounded-sacred transition-all duration-300 ${currentPage === item.id
                        ? 'text-amber-spirit bg-amber-spirit bg-opacity-10'
                        : 'text-text-secondary dark:text-night-text-muted hover:bg-indigo-prayer hover:bg-opacity-5'
                      }`}
                  >
                    <div className={`${currentPage === item.id ? 'scale-110 shadow-amber-glow' : ''}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
                  </button>
                ))}
              </nav>
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