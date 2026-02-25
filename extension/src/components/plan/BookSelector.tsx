import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
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
        }, {});
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

  if (loading) return <Card><p>Loading books...</p></Card>;
  if (error) return <Card><p className="text-burgundy-curtain">{error}</p></Card>;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Select Books</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Choose the books you wish to include in your reading plan.
      </p>
      <div className="mt-4 space-y-4">
        {Object.entries(BOOK_GROUPS).map(([groupName, booksInGroup]) => (
          <div key={groupName}>
            <h3 className="font-medium text-indigo-deep dark:text-dark-indigo mb-2">{groupName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {booksInGroup.filter(book => availableBooks.includes(book)).map(book => (
                <button
                  key={book}
                  onClick={() => handleToggleBook(book)}
                  className={`book-option p-2 rounded-md text-left transition-colors
                    ${selectedBooks.includes(book)
                      ? 'bg-amber-warm text-white'
                      : 'bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-gray-600 text-text-primary dark:text-dark-text'
                    }`}
                >
                  {AMHARIC_BOOK_NAMES[book] || book}
                  {bookMetadata[book] && (
                    <span className="block text-xs opacity-75">
                      {bookMetadata[book].chapter_count} chapters
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
