import React, { useState } from 'react';
import { formatVerseReference } from '../../utils/verseHelpers';

interface VerseDisplayProps {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  text: string;
}

export const VerseDisplay: React.FC<VerseDisplayProps> = ({ book, chapter, verseStart, verseEnd, text }) => {
  const [copied, setCopied] = useState(false);
  const verseRef = formatVerseReference(book, chapter, verseStart, verseEnd);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${verseRef}\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group animate-fade-in">
      <div className="sacred-card parchment border-l-4 border-l-amber-spirit shadow-inner">
        <div className="flex justify-between items-start mb-16">
          <span className="text-xs uppercase tracking-widest text-indigo-prayer font-semibold dark:text-night-text-muted">
            {verseRef}
          </span>
          <button
            onClick={handleCopy}
            className="p-8 rounded-full hover:bg-amber-spirit hover:bg-opacity-10 text-text-secondary transition-colors"
            title="Copy selection"
          >
            {copied ? (
              <span className="text-[10px] font-bold text-olive-mountain">COPIED</span>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
        </div>
        <p className="verse-text text-text-primary dark:text-night-text select-all" data-amharic="true">
          {text}
        </p>
      </div>
    </div>
  );
};
