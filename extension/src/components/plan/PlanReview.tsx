import React from 'react';
import { TimeRange } from '../../types/storage';
import { AMHARIC_BOOK_NAMES } from '../../constants/books';

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const ScrollIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

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
    <div className="space-y-6 animate-fade-in pb-4">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-primary mb-1">A Sacred Commitment</h2>
        <p className="text-sm text-muted-foreground italic">"Heaven and earth will pass away, but my words will never pass away." — Matthew 24:35</p>
      </div>

      <div className="space-y-4">
        {/* Books Section */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <BookOpenIcon />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Selected Scripture</h3>
          </div>
          <p className="font-ethiopic text-text-primary dark:text-night-text text-[15px] font-semibold leading-relaxed pl-1" data-amharic="true">
            {selectedBooks.length > 0 ? selectedBooks.map(b => (AMHARIC_BOOK_NAMES as any)[b] || b).join('፣ ') : 'None selected'}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Completion</p>
            <p className="text-[14px] font-bold text-foreground">{targetDate || 'Continuous'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">Meditative Pace</p>
            <p className="text-[14px] font-bold text-foreground">{maxVersesPerUnit} Verses / unit</p>
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-accent/10 text-accent rounded-lg">
              <ScrollIcon />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Delivery Vow</h3>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[10px] font-bold text-destructive/70 uppercase">Quiet</span>
              <span className="text-lg font-bold text-foreground">{quietHours.start}</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="w-[1px] h-8 bg-border"></div>
              <span className="text-[10px] my-1 text-muted-foreground">TO</span>
              <div className="w-[1px] h-8 bg-border"></div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[10px] font-bold text-success/70 uppercase">Active</span>
              <span className="text-lg font-bold text-foreground">{workingHours.start}</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-muted-foreground mt-4 italic">
            Scripture will find you gently between {workingHours.start} and {workingHours.end}.
          </p>
        </div>

        <div className="py-6 border-t border-dashed border-border flex justify-center">
          <div className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-border">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <p className="text-[12px] text-center text-primary font-medium tracking-tight mt-4">
              "Speak, Lord, for your servant is listening."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
