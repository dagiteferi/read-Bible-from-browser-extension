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

      <div className="space-y-16 mt-6">
        <div className="bg-white dark:bg-night-surface border border-border-light dark:border-night-border rounded-sacred p-16 shadow-sm">
          <div className="flex items-center gap-12 mb-12">
            <div className="w-10 h-10 rounded-full bg-indigo-prayer/10 flex items-center justify-center text-indigo-prayer shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-text-secondary">Selected Books</p>
              <p className="font-ethiopic text-text-primary dark:text-night-text text-[15px] font-semibold leading-relaxed mt-1" data-amharic="true">
                {selectedBooks.length > 0 ? selectedBooks.map(b => (AMHARIC_BOOK_NAMES as any)[b] || b).join('፣ ') : 'None selected'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div className="bg-white dark:bg-night-surface border border-border-light dark:border-night-border rounded-sacred p-16 shadow-sm flex items-center gap-10">
            <div className="w-8 h-8 rounded-full bg-amber-spirit/10 flex items-center justify-center text-amber-spirit shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Until</p>
              <p className="text-[13px] font-bold text-text-primary dark:text-night-text mt-0.5">{targetDate || 'Continuous'}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-night-surface border border-border-light dark:border-night-border rounded-sacred p-16 shadow-sm flex items-center gap-10">
            <div className="w-8 h-8 rounded-full bg-olive-mountain/10 flex items-center justify-center text-olive-mountain shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold tracking-widest text-text-secondary">Pace</p>
              <p className="text-[13px] font-bold text-text-primary dark:text-night-text mt-0.5">{maxVersesPerUnit} Verses</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-night-surface border border-border-light dark:border-night-border rounded-sacred p-16 shadow-sm">
          <div className="flex divide-x divide-border-light dark:divide-night-border">
            <div className="flex-1 pr-12">
              <div className="flex items-center gap-8 mb-3">
                <div className="w-6 h-6 rounded-full bg-burgundy-curtain/10 flex items-center justify-center text-burgundy-curtain shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-burgundy-curtain">Stillness</p>
              </div>
              <p className="text-[13px] font-bold text-text-primary dark:text-night-text">{quietHours.start} - {quietHours.end}</p>
            </div>
            <div className="flex-1 pl-12">
              <div className="flex items-center gap-8 mb-3">
                <div className="w-6 h-6 rounded-full bg-olive-mountain/10 flex items-center justify-center text-olive-mountain shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-olive-mountain">Listening</p>
              </div>
              <p className="text-[13px] font-bold text-text-primary dark:text-night-text">{workingHours.start} - {workingHours.end}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-center text-text-secondary dark:text-night-text-muted italic px-32">
        "Speak, Lord, for your servant is listening."
      </p>
    </div>
  );
};
