export type DrinkType = 'water' | 'coffee' | 'soda' | 'alcohol' | 'other';
export type BathroomType = 'pee' | 'poop';

export interface DrinkLog {
  id: string;
  user_id: string;
  drink_type: DrinkType;
  amount_ml: number;
  logged_at: string;
  created_at: string;
}

export interface BathroomLog {
  id: string;
  user_id: string;
  bathroom_type: BathroomType;
  note?: string;
  logged_at: string;
  created_at: string;
}

export interface Profile {
  id: string;
  daily_goal_ml: number;
  created_at: string;
}

export const DRINK_TYPES = {
  water: { label: 'Water', emoji: '💧', color: '#6BBF4E' },
  coffee: { label: 'Coffee/Tea', emoji: '☕', color: '#8B4513' },
  soda: { label: 'Soda/Juice', emoji: '🥤', color: '#D55A32' },
  alcohol: { label: 'Alcohol', emoji: '🍺', color: '#DAA520' },
  other: { label: 'Other', emoji: '🧃', color: '#666666' },
} as const;

export const AMOUNT_PRESETS = [250, 500, 1000] as const;

export const DEFAULT_DAILY_GOAL = 2000;

export const BATHROOM_TYPES = {
  pee: { label: 'Pee', emoji: '🚽' },
  poop: { label: 'Poop', emoji: '💩' },
} as const;
