// src/services/api.ts
import type { HabitsData } from '../types'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHabits = async (): Promise<HabitsData> => {
  const response = await fetch(`${API_BASE_URL}/api/habits`, {
    headers: {
      'Content-Type': 'application/json',
      // Add your Auth token here later if needed
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};