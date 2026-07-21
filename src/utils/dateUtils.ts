import type { CSSProperties } from 'react';

/**
 * Determines if a given day index (0 to 364/365) falls before today's date.
 * 
 * @param dayIndex 0-indexed day of the year (0 = Jan 1)
 * @param year Target year, defaults to 2026
 */
export const isPastDate = (dayIndex: number, year: number = 2026): boolean => {
  const cellDate = new Date(year, 0, 1 + dayIndex);
  cellDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return cellDate < today;
};

/**
 * Computes dynamic inline styles for day cells/buttons based on check status and historical date status.
 */
export const getDayStyles = (isChecked: boolean, isPast: boolean): CSSProperties => {
  const showX = isPast && !isChecked;

  return {
    backgroundColor: isChecked ? '#4f46e5' : (showX ? '#1a1a1e' : '#161619'),
    border: isChecked ? '1px solid #6366f1' : (showX ? '1px solid #3f3f46' : '1px solid #27272a'),
    color: isChecked ? '#ffffff' : (showX ? '#ef4444' : '#52525b'),
    cursor: isPast ? 'not-allowed' : 'pointer'
  };
};