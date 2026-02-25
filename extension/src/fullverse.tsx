import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { DeviceProvider } from './contexts/DeviceContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { VerseDisplay } from './components/common/VerseDisplay';
import apiClient from './services/api/client';
import ErrorBoundary from './components/common/ErrorBoundary'; // Import ErrorBoundary

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
          <div className="min-h-screen p-8 bg-bg-cream dark:bg-dark-bg text-text-primary dark:text-dark-text">
            <h1 className="text-2xl font-bold text-indigo-deep dark:text-dark-indigo mb-4">Full Verse View</h1>
            {loading && <p>Loading verse...</p>}
            {error && <p className="text-burgundy-curtain">{error}</p>}
            {verseDetails && (
              <VerseDisplay
                book={verseDetails.book}
                chapter={verseDetails.chapter}
                verseStart={verseDetails.verse_start}
                verseEnd={verseDetails.verse_end}
                text={verseDetails.text}
              />
            )}
            {!loading && !error && !verseDetails && (
              <p className="verse-text">
                ይህ ሙሉ ጥቅስ የሚታይበት ገጽ ነው። ማሳወቂያ ሲጫን እዚህ ይታያል።
              </p>
            )}
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
