export interface BookMetadata {
  book: string;
  chapter_count: number;
  verse_counts: number[];
}

export interface CreatePlanRequest {
  books: string[];
  target_date?: string;
  frequency?: 'daily' | 'weekly';
  max_verses_per_unit?: number;
  time_lap_minutes?: number;
  quiet_hours?: { start: string; end: string };
  working_hours?: { start: string; end: string };
  boundaries?: {
    chapter_start: number;
    verse_start: number;
    chapter_end?: number;
    verse_end?: number;
  };
}

export interface CreatePlanResponse {
  plan_id: string;
}

export interface Unit {
  id: string;
  book: string;
  chapter: number;
  verse_start: number;
  verse_end: number;
  text: string;
  unit_index: number;
  state: 'pending' | 'read';
}

export interface PlanProgress {
  completed_units: number;
  total_units: number;
  completed_verses: number;
  total_verses: number;
  daily_history: Array<{ date: string; verses_read: number }>;
}

export interface RandomVerseResponse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}
