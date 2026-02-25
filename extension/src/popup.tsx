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

export type Page = 'dashboard' | 'createPlan' | 'progress' | 'settings';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PlanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="3" x2="16" y2="21" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8" y1="8" x2="12" y2="8" />
    <line x1="8" y1="16" x2="12" y2="16" />
  </svg>
);

const GrowthIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const navItems = [
  { id: 'dashboard' as Page, label: 'Home', Icon: HomeIcon },
  { id: 'createPlan' as Page, label: 'Plan', Icon: PlanIcon },
  { id: 'progress' as Page, label: 'Growth', Icon: GrowthIcon },
  { id: 'settings' as Page, label: 'Settings', Icon: SettingsIcon },
];

const Popup = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigate = (page: Page) => setCurrentPage(page);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'createPlan': return <CreatePlan />;
      case 'progress': return <Progress />;
      case 'settings': return <Settings />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <ErrorBoundary>
      <DeviceProvider>
        <SettingsProvider>
          <PlanProvider>
            <div className="app-shell">
              <div className="app-content">
                {renderPage()}
              </div>
              <nav className="bottom-nav">
                {navItems.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    className={`bottom-nav-item${currentPage === id ? ' active' : ''}`}
                    onClick={() => navigate(id)}
                    aria-label={label}
                  >
                    <Icon />
                    <span className="bottom-nav-label">{label}</span>
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