import { PlanProgress } from './api';

export interface Plan {
  id: string;
  books: string[];
  target_date?: string;
  frequency?: 'daily' | 'weekly';
  max_verses_per_unit: number;
  deliveries_per_day: number;
  boundaries?: {
    chapter_start: number;
    verse_start: number;
    chapter_end?: number;
    verse_end?: number;
  };
  quiet_hours?: { start: string; end: string };
  created_at: string;
  updated_at: string;
}

export interface Progress extends PlanProgress { }
