import { useState, useEffect } from 'react';
import { getBooks, getBookMetadata } from '../../services/api/bible';
import { AMHARIC_BOOK_NAMES, BOOK_GROUPS } from '../../constants/books';
import { BookMetadata } from '../../types/api';

interface BookSelectorProps {
  selectedBooks: string[];
  onBookSelect: (books: string[]) => void;
}

export const BookSelector: React.FC<BookSelectorProps> = ({ selectedBooks, onBookSelect }) => {
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [bookMetadata, setBookMetadata] = useState<Record<string, BookMetadata>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getBooks();
        setAvailableBooks(books);

        const metadataPromises = books.map(book => getBookMetadata(book));
        const metadataResults = await Promise.all(metadataPromises);
        const metadataMap = metadataResults.reduce((acc, meta) => {
          acc[meta.book] = meta;
          return acc;
        }, {} as Record<string, BookMetadata>);
        setBookMetadata(metadataMap);
      } catch (err) {
        setError('Failed to load Bible books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleToggleBook = (book: string) => {
    const newSelection = selectedBooks.includes(book)
      ? selectedBooks.filter(b => b !== book)
      : [...selectedBooks, book];
    onBookSelect(newSelection);
  };

  if (loading) return <div className="loading-pulse h-[400px] w-full" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="space-y-24 animate-fade-in">
      <div className="space-y-8">
        <h2 className="text-18 font-medium text-indigo-prayer dark:text-night-text uppercase tracking-widest">
          The Word
        </h2>
        <p className="text-text-secondary dark:text-night-text-muted text-sm italic">
          Select the scrolls you wish to meditate upon.
        </p>
      </div>

      <div className="h-[400px] overflow-y-auto pr-8 space-y-24 custom-scrollbar">
        {Object.entries(BOOK_GROUPS).map(([groupName, booksInGroup]) => (
          <div key={groupName} className="space-y-12">
            <h3 className="text-12 font-bold text-amber-spirit dark:text-night-amber uppercase tracking-wider border-b border-border-light dark:border-night-border pb-4">
              {groupName}
            </h3>
            <div className="grid grid-cols-2 gap-8">
              {booksInGroup.filter(book => availableBooks.includes(book)).map(book => {
                const isSelected = selectedBooks.includes(book);
                return (
                  <button
                    key={book}
                    onClick={() => handleToggleBook(book)}
                    className={`flex flex-col p-12 rounded-sacred text-left transition-all duration-200 group
                      ${isSelected
                        ? 'bg-indigo-prayer text-white shadow-sacred ring-2 ring-amber-spirit ring-offset-1 dark:ring-offset-night-bg'
                        : 'bg-white dark:bg-night-surface border border-border-light dark:border-night-border hover:border-amber-spirit'
                      }`}
                  >
                    <span className={`font-ethiopic text-16 ${isSelected ? 'text-white' : 'text-text-primary dark:text-night-text group-hover:text-amber-spirit'}`}>
                      {(AMHARIC_BOOK_NAMES as any)[book] || book}
                    </span>
                    {bookMetadata[book] && (
                      <span className={`text-[10px] uppercase font-bold tracking-tighter opacity-70 ${isSelected ? 'text-cream' : 'text-text-secondary'}`}>
                        {bookMetadata[book].chapter_count} chapters
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
