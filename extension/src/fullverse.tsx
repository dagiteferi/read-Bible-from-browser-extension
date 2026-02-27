import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';
import { DeviceProvider } from './contexts/DeviceContext';
import { SettingsProvider } from './contexts/SettingsContext';
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
  const [copied, setCopied] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const verseId = urlParams.get('id');

  useEffect(() => {
    // Add a class to body for full-page view if needed
    document.body.style.width = '100vw';
    document.body.style.minHeight = '100vh';

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

  const handleShare = async () => {
    if (!verseDetails) return;
    const reference = `${verseDetails.book} ${verseDetails.chapter}:${verseDetails.verse_start}${verseDetails.verse_end && verseDetails.verse_end !== verseDetails.verse_start ? '-' + verseDetails.verse_end : ''}`;
    const extensionUrl = `https://chromewebstore.google.com/detail/${chrome.runtime?.id || 'extension-id'}`;
    const shareText = `"${verseDetails.text}"\n\n— ${reference}\n\nShared via Bible Reading Extension: ${extensionUrl}`;

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse tracking-widest uppercase text-[10px] font-bold">Unrolling Scroll...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcf9f2] dark:bg-[#0d1117] flex flex-col items-center justify-center p-6 md:p-12 animate-fade-in text-foreground">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Navigation / Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => window.close()}
            className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deep Reflection</span>
          </div>

          <button
            onClick={handleShare}
            className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative"
            title="Copy & Share"
          >
            {copied ? (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-success text-white text-[9px] px-2 py-1 rounded font-bold shadow-lg">COPIED</span>
            ) : null}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
        </div>

        {error ? (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-12 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-destructive mb-4">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="text-destructive font-bold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 text-xs underline opacity-70 hover:opacity-100">Try again</button>
          </div>
        ) : verseDetails ? (
          <div className="space-y-8">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-primary">
                {verseDetails.book}
              </h2>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em]">
                Chapter {verseDetails.chapter}
              </p>
            </div>

            <article className="sacred-card parchment-bg dark:bg-card border border-border shadow-2xl rounded-[2rem] p-8 md:p-16 relative overflow-hidden">
              {/* Decorative patterns */}
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" opacity=".2" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="mb-8 flex items-center gap-4">
                  <div className="h-[1px] flex-1 bg-border/50"></div>
                  <span className="text-[12px] font-serif italic text-muted-foreground">
                    Verse {verseDetails.verse_start}{verseDetails.verse_end && verseDetails.verse_end !== verseDetails.verse_start ? `–${verseDetails.verse_end}` : ''}
                  </span>
                  <div className="h-[1px] flex-1 bg-border/50"></div>
                </div>

                <p
                  className="text-2xl md:text-3xl leading-[1.8] text-center amharic-text font-medium select-text"
                  style={{ wordSpacing: '0.1em' }}
                >
                  {verseDetails.text}
                </p>

                <div className="mt-12 flex justify-center">
                  <div className="w-12 h-[2px] bg-primary/20 rounded-full"></div>
                </div>
              </div>
            </article>

            {/* Action Area */}
            <div className="flex flex-col items-center gap-6 pt-8">
              <button
                onClick={handleMarkRead}
                disabled={markingRead || isRead}
                className={`group relative overflow-hidden px-12 py-4 rounded-full font-bold transition-all duration-500 shadow-xl
                  ${isRead
                    ? 'bg-success/20 text-success border border-success/30 cursor-default'
                    : 'bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                <div className="relative z-10 flex items-center gap-3">
                  {markingRead ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isRead ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : null}
                  <span className="uppercase tracking-widest text-xs">
                    {markingRead ? 'Recording...' : isRead ? 'Dwell in the Word' : 'Complete Reflection'}
                  </span>
                </div>
                {!isRead && !markingRead && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}
              </button>

              <p className="text-[10px] text-muted-foreground italic uppercase tracking-wider">
                {isRead ? "Successfully completed your portion for today." : "Take a moment to let the scripture sink in."}
              </p>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-20 text-center opacity-30 select-none">
          <p className="text-[9px] uppercase font-black tracking-[0.4em] text-foreground">
            Bible Reading Extension • Amharic V1.0
          </p>
        </div>
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
