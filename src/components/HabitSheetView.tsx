import React, { useState } from 'react';
import type { HabitsData, HabitKey } from '../types';
import { isPastDate, getDayStyles } from '../utils/dateUtils';

const HABIT_CONFIG: { key: HabitKey; name: string; icon: string }[] = [
  { key: 'wakeup', name: 'Wake', icon: 'bi-alarm' },
  { key: 'nosnooze', name: 'NoSnooze', icon: 'bi-x-circle' },
  { key: 'water', name: 'Water', icon: 'bi-droplet' },
  { key: 'gym', name: 'Gym', icon: 'bi-lightning' },
  { key: 'stretching', name: 'Stretch', icon: 'bi-body-text' },
  { key: 'read', name: 'Read', icon: 'bi-book' },
  { key: 'meditation', name: 'Meditate', icon: 'bi-moon-stars' },
  { key: 'study', name: 'Study', icon: 'bi-mortarboard' },
  { key: 'skincare', name: 'Skin', icon: 'bi-sparkles' },
  { key: 'socialmedia', name: 'Social', icon: 'bi-phone-mute' },
  { key: 'noalcohol', name: 'NoAlc', icon: 'bi-ban' },
  { key: 'expenses', name: 'Fin', icon: 'bi-cash-coin' },
];

const MONTH_DETAILS = [
  { name: 'JAN', daysCount: 31 }, { name: 'FEB', daysCount: 28 }, { name: 'MAR', daysCount: 31 },
  { name: 'APR', daysCount: 30 }, { name: 'MAY', daysCount: 31 }, { name: 'JUN', daysCount: 30 },
  { name: 'JUL', daysCount: 31 }, { name: 'AUG', daysCount: 31 }, { name: 'SEP', daysCount: 30 },
  { name: 'OCT', daysCount: 31 }, { name: 'NOV', daysCount: 30 }, { name: 'DEC', daysCount: 31 }
];

interface HabitSheetViewProps {
  readonly habitsData: HabitsData;
  readonly toggleDay: (habitKey: HabitKey, index: number) => Promise<void>;
}

export default function HabitSheetView({ habitsData, toggleDay }: HabitSheetViewProps): React.ReactNode {
  const [activeMonthIdx, setActiveMonthIdx] = useState<number>(6);
  const start = MONTH_DETAILS.slice(0, activeMonthIdx).reduce((a, b) => a + b.daysCount, 0);

  return (
    <div className="container-fluid p-0 w-100 overflow-hidden">
      {/* Responsive Month Selector Container */}
      <div className="d-flex gap-1 mb-3 w-100 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {MONTH_DETAILS.map((m, i) => (
          <button 
            key={m.name} 
            onClick={() => setActiveMonthIdx(i)} 
            className={`btn btn-sm py-1 flex-fill ${activeMonthIdx === i ? 'btn-primary' : 'btn-dark'}`} 
            style={{ 
              flex: '1 0 auto',
              minWidth: '45px',
              fontSize: '10px', 
              fontWeight: '600', 
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Main Grid Wrapper */}
      <div className="bg-zinc-950 p-2 rounded border border-zinc-900 w-100 overflow-x-auto">
        <div style={{ minWidth: '700px' }}> {/* Enforces consistent column flow down to mobile viewports */}
          {HABIT_CONFIG.map((habit) => (
            <div key={habit.key} className="d-flex align-items-center border-bottom border-zinc-900 py-2 w-100" style={{ minHeight: '45px' }}>
              
              <div 
                className="ps-2 text-start" 
                style={{ 
                  width: '140px', 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: '#f4f4f5', 
                  letterSpacing: '0.5px',
                  flexShrink: 0 
                }}
              >
                {habit.name}
              </div>
              
              <div className="d-flex gap-1 w-100 flex-fill">
                {Array.from({ length: MONTH_DETAILS[activeMonthIdx].daysCount }).map((_, i) => {
                  const idx = start + i;
                  const habitList = habitsData[habit.key] || [];
                  const done = !!habitList[idx];
                  const past = isPastDate(idx);
                  
                  return (
                    <button 
                      key={idx} 
                      onClick={() => !past && toggleDay(habit.key, idx)} 
                      style={{ 
                        flex: 1, 
                        height: '32px', 
                        fontSize: '10px', 
                        ...getDayStyles(done, past),
                        border: 'none',
                        borderRadius: '4px',
                        transition: 'all 0.15s',
                        minWidth: '20px'
                      }}
                    >
                      {(past && !done) ? 'X' : i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}