import React from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

const Popup = () => {
  return (
    <div className="w-80 h-96 p-4 bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
      <h1 className="text-xl font-bold text-indigo-deep dark:text-dark-indigo">Bible Extension Popup</h1>
      <p className="mt-2">Welcome to your spiritual journey!</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
