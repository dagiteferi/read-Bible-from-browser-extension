import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { DeviceProvider } from './contexts/DeviceContext';
import { SettingsProvider } from './contexts/SettingsContext';

const FullVersePage = () => {
  // In a real implementation, you would parse the verse ID from the URL
  // and fetch the verse details to display here.
  const urlParams = new URLSearchParams(window.location.search);
  const verseId = urlParams.get('id');

  return (
    <DeviceProvider>
      <SettingsProvider>
        <div className="min-h-screen p-8 bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
          <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo mb-4">Full Verse View</h1>
          {verseId ? (
            <p className="verse-text">
              Displaying verse with ID: {verseId}
              {/* Fetch and display actual verse content here */}
            </p>
          ) : (
            <p className="verse-text">
              ይህ ሙሉ ጥቅስ የሚታይበት ገጽ ነው። ማሳወቂያ ሲጫን እዚህ ይታያል።
            </p>
          )}
          <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">
            (This is the page where the full verse will be displayed when a notification is clicked.)
          </p>
        </div>
      </SettingsProvider>
    </DeviceProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FullVersePage />
  </React.StrictMode>
);
