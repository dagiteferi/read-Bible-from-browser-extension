import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const FullVerse = () => {
  return (
    <div className="min-h-screen p-8 bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
      <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo mb-4">Full Verse View</h1>
      <p className="verse-text">
        ይህ ሙሉ ጥቅስ የሚታይበት ገጽ ነው። ማሳወቂያ ሲጫን እዚህ ይታያል።
      </p>
      <p className="mt-4 text-text-secondary dark:text-dark-text-secondary">
        (This is the page where the full verse will be displayed when a notification is clicked.)
      </p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FullVerse />
  </React.StrictMode>
);
