import type { HabitsData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://core-tracker-api-tyf8.onrender.com/api";

/**
 * Creates common headers including Bearer Auth token.
 */
const createHeaders = (token: string): HeadersInit => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Helper to process response and handle authentication or server errors consistently.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred during the request';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Fallback if response body isn't JSON
    }
    throw new Error(errorMessage);
  }

  // Safely parse JSON if response body exists
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json() as T;
  }

  return {} as T;
}

/**
 * Fetches all habit data for the authenticated user.
 * Throws 'Unauthorized' if the server returns 401/403.
 */
export const fetchHabits = async (token: string): Promise<HabitsData> => {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: 'GET',
    headers: createHeaders(token),
  });

  return handleResponse<HabitsData>(response);
};

/**
 * Toggles a habit status on the server.
 * Expects habitKey (string) and dayIndex (number).
 */
export const toggleHabit = async (
  token: string, 
  habitKey: string, 
  dayIndex: number
): Promise<HabitsData> => {
  const response = await fetch(`${API_BASE_URL}/habits/toggle`, {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify({ 
      habitKey, 
      dayIndex 
    }),
  });

  return handleResponse<HabitsData>(response);
};