// src/utils/dateUtils.ts

export const isPastDate = (dayIndex: number): boolean => {
  const cellDate = new Date(2026, 0, 1 + dayIndex); // Assuming Jan 1st is 0
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return cellDate < today;
};

export const getDayStyles = (isChecked: boolean, isPast: boolean) => {
  const showX = isPast && !isChecked;
  
  return {
    backgroundColor: isChecked ? '#4f46e5' : (showX ? '#1a1a1e' : '#161619'),
    border: isChecked ? '1px solid #6366f1' : (showX ? '1px solid #3f3f46' : '1px solid #27272a'),
    color: isChecked ? '#fff' : (showX ? '#ef4444' : '#52525b'),
    cursor: isPast ? 'not-allowed' : 'pointer'
  };
};