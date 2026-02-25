export interface BookMetadata {
  book: string;
  chapter_count: number;
  verse_counts: number[];
}

export interface CreatePlanRequest {
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
