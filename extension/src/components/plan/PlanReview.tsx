import React from 'react';
import { Card } from '../common/Card';
import { TimeRange } from '../../types/storage';
import { AMHARIC_BOOK_NAMES } from '../../constants/books';

interface PlanReviewProps {
  selectedBooks: string[];
  targetDate: string;
  maxVersesPerUnit: number;
  quietHours: TimeRange;
  workingHours: TimeRange;
}

export const PlanReview: React.FC<PlanReviewProps> = ({
  selectedBooks,
  targetDate,
  maxVersesPerUnit,
  quietHours,
  workingHours,
}) => {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-indigo-deep dark:text-dark-indigo">Review Your Plan</h2>
      <p className="mt-2 text-text-secondary dark:text-dark-text-secondary">
        Please review the details of your spiritual journey before creation.
      </p>

      <div className="mt-4 space-y-3 text-text-primary dark:text-dark-text">
        <div>
          <p className="font-medium">Selected Books:</p>
          <ul className="list-disc list-inside ml-2 text-sm">
            {selectedBooks.length > 0 ? (
              selectedBooks.map((book) => (
                <li key={book} className="book-option">{AMHARIC_BOOK_NAMES[book] || book}</li>
              ))
            ) : (
              <li>No books selected</li>
            )}
          </ul>
        </div>

        <div>
          <p className="font-medium">Target Completion Date:</p>
          <p className="ml-2 text-sm">{targetDate || 'Not set'}</p>
        </div>

        <div>
          <p className="font-medium">Max Verses per Reading Unit:</p>
          <p className="ml-2 text-sm">{maxVersesPerUnit || 'Not set'}</p>
        </div>

        <div>
          <p className="font-medium">Quiet Hours (Stillness):</p>
          <p className="ml-2 text-sm">{quietHours.start} - {quietHours.end}</p>
        </div>

        <div>
          <p className="font-medium">Working Hours (Listening):</p>
          <p className="ml-2 text-sm">{workingHours.start} - {workingHours.end}</p>
        </div>
      </div>
    </Card>
  );
};
