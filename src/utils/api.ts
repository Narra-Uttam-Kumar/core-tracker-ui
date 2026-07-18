const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://core-tracker-api-tyf8.onrender.com/api";

/**
 * Fetches all habit data for the authenticated user.
 * Throws 'Unauthorized' if the server returns 401/403.
 */
export const fetchHabits = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Header required to pass SecurityConfig
      'Content-Type': 'application/json'
    }
  });

  // Handle Auth errors specifically to trigger handleLogout in App.tsx
  if (response.status === 401 || response.status === 403) {
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch habits');
  }

  return await response.json();
};

/**
 * Toggles a habit status on the server.
 * Expects habitKey (string) and dayIndex (number).
 */
export const toggleHabit = async (token: string, habitKey: string, dayIndex: number) => {
  const response = await fetch(`${API_BASE_URL}/habits/toggle`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // Header required to pass SecurityConfig
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      habitKey, 
      dayIndex // The App.tsx passes index + 1
    })
  });

  if (!response.ok) {
    // This will trigger the catch block in your App.tsx toggleDay function
    throw new Error('Failed to toggle habit');
  }

  return await response.json();
};