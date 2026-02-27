import { useState, useEffect } from 'react';
import { getBooks } from '../../services/api/bible';

interface BookSelectorProps {
  selectedBooks: string[];
  onBookSelect: (books: string[]) => void;
}

export const BookSelector: React.FC<BookSelectorProps> = ({ selectedBooks, onBookSelect }) => {
  const [availableBooks, setAvailableBooks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getBooks();
        setAvailableBooks(books);
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
      <div className="flex justify-between items-end pb-4 border-b border-border-light dark:border-night-border mb-4">
        <div className="space-y-2">
          <h2 className="text-18 font-medium text-indigo-prayer dark:text-night-text uppercase tracking-widest leading-none">
            The Word
          </h2>
          <p className="text-text-secondary dark:text-night-text-muted text-[12px] italic">
            Select the scrolls you wish to meditate upon.
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedBooks.length === availableBooks.length) {
              onBookSelect([]);
            } else {
              onBookSelect([...availableBooks]);
            }
          }}
          className="text-[11px] uppercase tracking-wider font-bold text-amber-spirit dark:text-night-amber hover:opacity-80 transition-opacity whitespace-nowrap px-3 py-1.5 bg-amber-spirit/10 rounded-full"
        >
          {selectedBooks.length === availableBooks.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="h-[400px] overflow-y-auto pr-8 custom-scrollbar">
        <div className="grid grid-cols-2 gap-8">
          {availableBooks.map(book => {
            const isSelected = selectedBooks.includes(book);
            return (
              <button
                key={book}
                onClick={() => handleToggleBook(book)}
                className={`flex items-center justify-center p-3 rounded-sacred text-center transition-all duration-200 group min-h-[44px]
                  ${isSelected
                    ? 'bg-indigo-prayer text-white shadow-sacred ring-2 ring-amber-spirit ring-offset-1 dark:ring-offset-night-bg'
                    : 'bg-white dark:bg-night-surface border border-border-light dark:border-night-border hover:border-amber-spirit'
                  }`}
              >
                <span className={`font-ethiopic text-[14px] leading-tight ${isSelected ? 'text-white' : 'text-text-primary dark:text-night-text group-hover:text-amber-spirit'}`}>
                  {book}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
