// src/services/api.ts
import type { HabitsData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://core-tracker-api-tyf8.onrender.com";
const API_PREFIX = '/api'; // Change to '' if your backend doesn't use /api

export const fetchHabits = async (token: string): Promise<HabitsData> => {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/habits`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (response.status === 401) throw new Error('Unauthorized');
  if (!response.ok) throw new Error('Failed to fetch habits');
  
  return response.json();
};

export const toggleHabit = async (token: string, habitType: string, dayNumber: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/habits/toggle`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ habitType, dayNumber })
  });

  if (!response.ok) throw new Error('Failed to toggle habit');
};