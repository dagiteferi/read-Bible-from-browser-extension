export const VerseDisplay = ({ book, chapter, verseStart, verseEnd, text }) => {
  const verseRef = `${book} ${chapter}:${verseStart}${verseEnd ? '-' + verseEnd : ''}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`${verseRef} ${text}`);
    // TODO: Add "Copied!" feedback
  };

  return (
    <div className="verse-text p-4 bg-bg-cream dark:bg-dark-bg rounded-md shadow-inner">
      <p className="text-right text-sm text-text-secondary dark:text-dark-text-secondary mb-2">
        {verseRef}
      </p>
      <p className="text-lg leading-relaxed">
        {text}
      </p>
      <button 
        onClick={handleCopy} 
        className="mt-4 px-3 py-1 bg-indigo-deep dark:bg-dark-indigo text-white text-sm rounded-md hover:opacity-90"
      >
        Copy
      </button>
    </div>
  );
};