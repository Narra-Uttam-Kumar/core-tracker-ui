import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthPortal from './components/AuthPortal';
import DashboardView from './components/DashboardView';
import HabitSheetView from './components/HabitSheetView';
import PlanView from './components/PlanView';
import HabitGridView from './components/HabitGridView';
import { fetchHabits, toggleHabit } from './utils/api';
import type { HabitKey, ViewType, AuthMode, HabitsData } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const INITIAL_HABITS_STATE = (): HabitsData => ({
  wakeup: Array(365).fill(false), nosnooze: Array(365).fill(false),
  water: Array(365).fill(false), gym: Array(365).fill(false),
  stretching: Array(365).fill(false), read: Array(365).fill(false),
  meditation: Array(365).fill(false), study: Array(365).fill(false),
  skincare: Array(365).fill(false), socialmedia: Array(365).fill(false),
  noalcohol: Array(365).fill(false), expenses: Array(365).fill(false)
});

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [currentView, setCurrentView] = useState<ViewType>('tracker-sheet'); 
  const [habitsData, setHabitsData] = useState<HabitsData>(INITIAL_HABITS_STATE());

  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setHabitsData(INITIAL_HABITS_STATE());
    setCurrentView('tracker-sheet');
  }, []);

  const getHabitColorClass = useCallback((_habitKey: HabitKey, isCompleted: boolean): string => {
    return isCompleted 
      ? 'bg-primary text-white border-primary shadow-sm' 
      : 'bg-transparent border border-zinc-800 text-zinc-500';
  }, []);

  useEffect(() => {
    let active = true;
    if (!token) return;

    const loadData = async () => {
      try {
        const data = await fetchHabits(token);
        if (active) setHabitsData(data);
      } catch (err: unknown) {
        console.error("Fetch Error:", err);
        if (err instanceof Error && err.message === 'Unauthorized') handleLogout();
      }
    };
    loadData();
    return () => { active = false; };
  }, [token, handleLogout]);

  const handleAuthSubmit = async (mode: AuthMode, username: string, password: string) => {
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        if (mode === 'login' && data.token) {
          localStorage.setItem('auth_token', data.token);
          setToken(data.token);
        } else {
          alert("Success! Please proceed to login.");
        }
      } else {
        alert(data.message || "Authentication error.");
      }
    } catch (err: unknown) {
      console.error("Network fault:", err);
      alert("Network server communication fault.");
    }
  };

  const toggleDay = useCallback(async (habitKey: HabitKey, index: number) => {
    setHabitsData(prev => ({
      ...prev,
      [habitKey]: prev[habitKey].map((val, idx) => idx === index ? !val : val)
    }));
    try {
      if (token) await toggleHabit(token, habitKey, index + 1);
    } catch (err: unknown) {
      console.error("Toggle error, reverting state:", err);
      setHabitsData(prev => ({
        ...prev,
        [habitKey]: prev[habitKey].map((val, idx) => idx === index ? !val : val)
      }));
    }
  }, [token]);

  if (!token) return <AuthPortal handleAuthSubmit={handleAuthSubmit} />;

  return (
    <div className="d-flex flex-column w-100 min-vh-100 text-light" style={{ backgroundColor: '#09090b' }}>
      <Header currentView={currentView} setCurrentView={setCurrentView} handleLogout={handleLogout} />
      <main className="flex-grow-1 p-4 md:p-5 overflow-auto">
        {currentView === 'dashboard' && <DashboardView habitsData={habitsData} />}
        {currentView === 'tracker-sheet' && <HabitSheetView habitsData={habitsData} toggleDay={toggleDay} />}
        {currentView === '12-month' && <PlanView habitsData={habitsData} toggleDay={toggleDay} />}
        
        {!['dashboard', 'tracker-sheet', '12-month'].includes(currentView) && (
          <HabitGridView 
            currentView={currentView as HabitKey}
            habitData={habitsData[currentView as HabitKey] || Array(365).fill(false)}
            toggleDay={toggleDay}
            getHabitColorClass={getHabitColorClass}
            months={MONTHS}
          />
        )}
      </main>
    </div>
  );
}