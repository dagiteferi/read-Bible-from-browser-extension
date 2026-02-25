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
    navigator.clipboard.writeText(`${verseRef} ${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
  };

  return (
    <div className="verse-text p-4 bg-bg-cream dark:bg-dark-bg rounded-md shadow-inner border border-border-light dark:border-dark-border">
      <p className="text-right text-sm text-text-secondary dark:text-dark-text-secondary mb-2">
        {verseRef}
      </p>
      <p className="text-lg leading-relaxed">
        {text}
      </p>
      <button 
        onClick={handleCopy} 
        className="mt-4 px-3 py-1 bg-indigo-deep dark:bg-dark-indigo text-white text-sm rounded-md hover:opacity-90 transition-opacity"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
