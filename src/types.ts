export const HABIT_KEYS = [
  'wakeup',
  'nosnooze',
  'water',
  'gym',
  'stretching',
  'read',
  'meditation',
  'study',
  'skincare',
  'socialmedia',
  'noalcohol',
  'expenses',
] as const;

export type HabitKey = typeof HABIT_KEYS[number];

export type StructuralView = 'dashboard' | 'tracker-sheet' | '12-month';
export type ViewType = StructuralView | HabitKey;

export type AuthMode = 'login' | 'register';

/**
 * Maps each habit key to a boolean array representing daily completion (365 days).
 */
export type HabitsData = Record<HabitKey, boolean[]>;