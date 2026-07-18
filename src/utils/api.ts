// Read the variable from your .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchHabits = async () => {
  // Use the variable in your fetch/axios call
  const response = await fetch(`${API_BASE_URL}/api/habits`);
  return response.json();
};