import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AuthPortal from './components/AuthPortal';
import DashboardView from './components/DashboardView';
import HabitSheetView from './components/HabitSheetView';
import PlanView from './components/PlanView';
import HabitGridView from './components/HabitGridView';
import { fetchHabits, toggleHabit } from './utils/api';
import type { HabitKey, ViewType, AuthMode, HabitsData } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://core-tracker-api-tyf8.onrender.com/api";
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const INITIAL_HABITS_STATE = (): HabitsData => ({
  wakeup: Array(365).fill(false),
  nosnooze: Array(365).fill(false),
  water: Array(365).fill(false),
  gym: Array(365).fill(false),
  stretching: Array(365).fill(false),
  read: Array(365).fill(false),
  meditation: Array(365).fill(false),
  study: Array(365).fill(false),
  skincare: Array(365).fill(false),
  socialmedia: Array(365).fill(false),
  noalcohol: Array(365).fill(false),
  expenses: Array(365).fill(false)
});

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('auth_username'));
  const [currentView, setCurrentView] = useState<ViewType>('tracker-sheet'); 
  const [habitsData, setHabitsData] = useState<HabitsData>(INITIAL_HABITS_STATE());

  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_username');
    setToken(null);
    setUsername(null);
    setHabitsData(INITIAL_HABITS_STATE());
    setCurrentView('tracker-sheet');
  }, []);

  useEffect(() => {
    let active = true;
    if (!token) return;

    const loadData = async () => {
      try {
        const data = await fetchHabits(token);
        if (active) setHabitsData(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === 'Unauthorized') {
          handleLogout();
        }
      }
    };

    loadData();
    return () => { active = false; };
  }, [token, handleLogout]);

  const handleAuthSubmit = async (mode: AuthMode, usernameInput: string, passwordInput: string) => {
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Server Error:", text);
        alert(`Request failed (Status ${response.status}). Please check your credentials and connection.`);
        return;
      }

      const data = await response.json();
      if (mode === 'login' && data.token) {
        localStorage.setItem('auth_token', data.token);
        const loggedInUser = data.username || usernameInput;
        localStorage.setItem('auth_username', loggedInUser);
        
        setToken(data.token);
        setUsername(loggedInUser);
      } else {
        alert("Registration successful! Please log in with your credentials.");
      }
    } catch (err: unknown) {
      console.error("Network fault:", err);
      alert("Network server communication fault. Ensure backend service is running.");
    }
  };

const toggleDay = useCallback(
  async (habitKey: HabitKey, index: number) => {

    // optimistic update
    setHabitsData(prev => ({
      ...prev,
      [habitKey]: prev[habitKey].map((value, i) =>
        i === index ? !value : value
      ),
    }));

    try {
      if (!token) return;

      await toggleHabit(token, habitKey, index);

    } catch (err) {

      console.error("Toggle failed", err);

      if (err instanceof Error && err.message === "Unauthorized") {
        handleLogout();
        return;
      }

      // rollback
      setHabitsData(prev => ({
        ...prev,
        [habitKey]: prev[habitKey].map((value, i) =>
          i === index ? !value : value
        ),
      }));
    }
  },
  [token, handleLogout]
);

  if (!token) {
    return <AuthPortal handleAuthSubmit={handleAuthSubmit} />;
  }

  return (
    <div className="d-flex flex-column w-100 min-vh-100 text-light" style={{ backgroundColor: '#09090b' }}>
      <Header 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        handleLogout={handleLogout} 
        username={username || undefined}
      />
      
      <main className="flex-grow-1 p-4 md:p-5 overflow-auto">
        {currentView === 'dashboard' && (
          <DashboardView habitsData={habitsData} />
        )}
        
        {currentView === 'tracker-sheet' && (
          <HabitSheetView habitsData={habitsData} toggleDay={toggleDay} />
        )}
        
        {currentView === '12-month' && (
          <PlanView habitsData={habitsData} toggleDay={toggleDay} />
        )}
        
        {!['dashboard', 'tracker-sheet', '12-month'].includes(currentView) && (
          <HabitGridView 
            currentView={currentView as HabitKey}
            habitData={habitsData[currentView as HabitKey] || Array(365).fill(false)}
            toggleDay={toggleDay}
            months={MONTHS}
          />
        )}
      </main>
    </div>
  );
}