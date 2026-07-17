export type HabitKey = 
  | 'wakeup' | 'nosnooze' | 'water' | 'gym' 
  | 'stretching' | 'read' | 'meditation' | 'study' 
  | 'skincare' | 'socialmedia' | 'noalcohol' | 'expenses';

export type ViewType = 'dashboard' | 'tracker-sheet' | '12-month' | HabitKey;
export type AuthMode = 'login' | 'register';
export type HabitsData = Record<HabitKey, boolean[]>;