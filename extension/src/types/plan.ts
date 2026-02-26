import { Unit, PlanProgress } from './api';

export interface Plan {
  id: string;
  books: string[];
  target_date: string;
  frequency: 'daily' | 'weekly';
  max_verses: number;
  boundaries: {
    start_book: string;
    start_chapter: number;
    start_verse: number;
    end_book: string;
    end_chapter: number;
    end_verse: number;
  };
  quiet_hours: { start: string; end: string };
  created_at: string;
  updated_at: string;
}

export interface Progress extends PlanProgress {}
