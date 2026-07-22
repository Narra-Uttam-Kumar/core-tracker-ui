import type { HabitsData } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://core-tracker-api-tyf8.onrender.com/api";

const createHeaders = (token: string): HeadersInit => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401 || response.status === 403) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let message = "An error occurred during the request";

    try {
      const error = await response.json();
      message = error.message || message;
    } catch {
      console.log("failed")
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  return {} as T;
}

export const fetchHabits = async (
  token: string
): Promise<HabitsData> => {
  const response = await fetch(`${API_BASE_URL}/habits`, {
    method: "GET",
    headers: createHeaders(token),
  });

  return handleResponse<HabitsData>(response);
};

export const toggleHabit = async (
  token: string,
  habitKey: string,
  dayIndex: number
): Promise<void> => {

  console.log({
    token,
    habitType: habitKey,
    dayNumber: dayIndex + 1,
  });

  const response = await fetch(`${API_BASE_URL}/habits/toggle`, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify({
      habitType: habitKey,
      dayNumber: dayIndex + 1,
    }),
  });

  await handleResponse(response);
};

export const fetchGoals = async (
  token: string
): Promise<Record<string, number>> => {
  const response = await fetch(`${API_BASE_URL}/habits/goals`, {
    method: "GET",
    headers: createHeaders(token),
  });

  return handleResponse<Record<string, number>>(response);
};

export const updateGoal = async (
  token: string,
  habitKey: string,
  targetGoal: number
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/habits/goals`, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify({
      habitType: habitKey,
      targetGoal,
    }),
  });

  await handleResponse(response);
};