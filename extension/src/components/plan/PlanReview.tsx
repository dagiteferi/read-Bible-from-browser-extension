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
    <div className="space-y-24 animate-fade-in">
      <div className="space-y-8">
        <h2 className="text-18 font-medium text-indigo-prayer dark:text-night-text uppercase tracking-widest text-center">
          Review Vow
        </h2>
        <p className="text-text-secondary dark:text-night-text-muted text-sm italic text-center">
          A summary of your sacred commitment.
        </p>
      </div>

      <Card parchment className="space-y-16 py-32 ring-1 ring-amber-spirit ring-opacity-20">
        <div className="space-y-16">
          <div className="flex gap-16 items-start">
            <div className="text-indigo-prayer dark:text-night-amber mt-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Selected Books</p>
              <p className="font-ethiopic text-text-primary dark:text-night-text text-14 leading-relaxed" data-amharic="true">
                {selectedBooks.map(b => (AMHARIC_BOOK_NAMES as any)[b] || b).join('፣ ')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-24">
            <div className="flex gap-12 items-start">
              <div className="text-amber-spirit mt-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Until</p>
                <p className="text-14 font-semibold text-text-primary dark:text-night-text">{targetDate || 'Continuous'}</p>
              </div>
            </div>

            <div className="flex gap-12 items-start">
              <div className="text-olive-mountain mt-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Pace</p>
                <p className="text-14 font-semibold text-text-primary dark:text-night-text">{maxVersesPerUnit} Verses</p>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-border-light dark:border-night-border flex justify-between">
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-burgundy-curtain text-center">Stillness</p>
              <p className="text-12 font-medium dark:text-night-text text-center">{quietHours.start} - {quietHours.end}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold tracking-widest text-olive-mountain text-center">Listening</p>
              <p className="text-12 font-medium dark:text-night-text text-center">{workingHours.start} - {workingHours.end}</p>
            </div>
          </div>
        </div>
      </Card>

      <p className="text-[10px] text-center text-text-secondary dark:text-night-text-muted italic px-32">
        "Speak, Lord, for your servant is listening."
      </p>
    </div>
  );
};
