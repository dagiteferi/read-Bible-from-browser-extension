import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { DeviceProvider } from './contexts/DeviceContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { VerseDisplay } from './components/common/VerseDisplay';
import apiClient from './services/api/client';
import ErrorBoundary from './components/common/ErrorBoundary';

interface VerseDetails {
  book: string;
  chapter: number;
  verse_start: number;
  verse_end?: number;
  text: string;
}

import { PlanProvider, usePlanContext } from './contexts/PlanContext';

const FullVerseContent = () => {
  const { markUnitRead } = usePlanContext();
  const [verseDetails, setVerseDetails] = useState<VerseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState(false);
  const [isRead, setIsRead] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const verseId = urlParams.get('id');

  useEffect(() => {
    const fetchVerse = async () => {
      if (!verseId) {
        setError('No verse ID provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/unit/${verseId}`);
        setVerseDetails(response.data);
        if (response.data.state === 'read') {
          setIsRead(true);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch verse details.');
      } finally {
        setLoading(false);
      }
    };
    fetchVerse();
  }, [verseId]);

  const handleMarkRead = async () => {
    if (!verseId) return;
    setMarkingRead(true);
    try {
      await markUnitRead(verseId);
      setIsRead(true);
    } catch (err) {
      console.error('Failed to mark as read:', err);
    } finally {
      setMarkingRead(false);
    }
  };

  return (
    <div className="min-h-screen parchment flex flex-col items-center justify-center p-24 animate-fade-in">
      <div className="w-full max-w-[600px] space-y-32">
        <header className="text-center space-y-8">
          <div className="inline-block px-12 py-4 rounded-full bg-amber-spirit bg-opacity-10 text-amber-spirit text-[10px] font-bold uppercase tracking-widest border border-amber-spirit border-opacity-20">
            Daily Bread
          </div>
          <h1 className="text-28 font-medium text-indigo-prayer dark:text-night-text">
            Sacred Reflection
          </h1>
        </header>

        <main className="space-y-24">
          {loading && (
            <div className="sacred-card parchment flex items-center justify-center h-[200px]">
              <div className="loading-pulse w-full h-full" />
            </div>
          )}
          {error && (
            <div className="error-message text-center">
              <p>{error}</p>
            </div>
          )}
          {verseDetails && (
            <>
              <VerseDisplay
                book={verseDetails.book}
                chapter={verseDetails.chapter}
                verseStart={verseDetails.verse_start}
                verseEnd={verseDetails.verse_end}
                text={verseDetails.text}
              />

              <div className="flex justify-center pt-8">
                <button
                  onClick={handleMarkRead}
                  disabled={markingRead || isRead}
                  className={`btn btn-lg min-w-[200px] shadow-sacred transition-all duration-500
                    ${isRead
                      ? 'bg-olive-mountain text-white opacity-80 cursor-default'
                      : 'btn-accent hover:scale-105 active:scale-95'}`}
                >
                  {markingRead ? (
                    <div className="flex items-center gap-8">
                      <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : isRead ? (
                    '✓ Contemplated'
                  ) : (
                    'Mark as Contemplated'
                  )}
                </button>
              </div>
            </>
          )}
        </main>

        <footer className="text-center opacity-50">
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-secondary">
            Bible Reading Extension
          </p>
        </footer>
      </div>
    </div>
  );
};

const FullVersePage = () => {
  return (
    <ErrorBoundary>
      <DeviceProvider>
        <SettingsProvider>
          <PlanProvider>
            <FullVerseContent />
          </PlanProvider>
        </SettingsProvider>
      </DeviceProvider>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FullVersePage />
  </React.StrictMode>
);
