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

const FullVersePage = () => {
  const [verseDetails, setVerseDetails] = useState<VerseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerse = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const verseId = urlParams.get('id');

      if (!verseId) {
        setError('No verse ID provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get(`/unit/${verseId}`); // Placeholder API call
        setVerseDetails(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch verse details.');
        console.error('Error fetching verse:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerse();
  }, []);

  return (
    <ErrorBoundary> {/* Wrap the application with ErrorBoundary */}
      <DeviceProvider>
        <SettingsProvider>
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

              <main>
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
                {verseDetails ? (
                  <VerseDisplay
                    book={verseDetails.book}
                    chapter={verseDetails.chapter}
                    verseStart={verseDetails.verse_start}
                    verseEnd={verseDetails.verse_end}
                    text={verseDetails.text}
                  />
                ) : !loading && !error && (
                  <div className="sacred-card parchment p-32 text-center">
                    <p className="verse-text text-text-primary dark:text-night-text text-20 leading-relaxed italic" data-amharic="true">
                      ይህ ሙሉ ጥቅስ የሚታይበት ገጽ ነው። ማሳወቂያ ሲጫን እዚህ ይታያል።
                    </p>
                  </div>
                )}
              </main>

              <footer className="text-center opacity-50">
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-secondary">
                  Bible Reading Extension
                </p>
              </footer>
            </div>
          </div>
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
