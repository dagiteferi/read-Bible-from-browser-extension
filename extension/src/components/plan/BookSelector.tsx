import React, { useState, useEffect } from 'react';
import { getBooks } from '../../services/api/bible';

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

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

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-muted rounded-md w-1/3"></div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center bg-destructive/5 rounded-xl border border-destructive/20 text-destructive">
        <p className="font-semibold mb-2">Something went wrong</p>
        <p className="text-sm opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">Select Scripture</h2>
          <p className="text-sm text-muted-foreground italic">"Thy word is a lamp unto my feet..."</p>
        </div>
        <button
          onClick={() => onBookSelect(selectedBooks.length === availableBooks.length ? [] : [...availableBooks])}
          className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-all"
        >
          {selectedBooks.length === availableBooks.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto pr-2 custom-scrollbar pb-2">
        <div className="grid grid-cols-2 gap-3">
          {availableBooks.map(book => {
            const isSelected = selectedBooks.includes(book);
            return (
              <button
                key={book}
                onClick={() => handleToggleBook(book)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left
                  ${isSelected
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]'
                    : 'bg-card border-border hover:border-primary/50 text-foreground'
                  }`}
              >
                <div className={`shrink-0 p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-muted'}`}>
                  <BookIcon />
                </div>
                <span className="font-ethiopic text-[13px] font-medium truncate" data-amharic="true">
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
