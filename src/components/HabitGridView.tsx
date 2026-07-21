import React, { useMemo } from 'react';
import type { HabitKey } from '../types';
import { isPastDate, getDayStyles } from '../utils/dateUtils';

interface GridProps {
  readonly currentView: HabitKey;
  readonly habitData: boolean[];
  readonly toggleDay: (key: HabitKey, i: number) => Promise<void>;
  readonly months: string[];
}

const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function HabitGridView({ 
  currentView, 
  habitData = [], 
  toggleDay, 
  months 
}: GridProps): React.ReactNode {
  
  // FIX 2: Pure functional calculation without mutating outer scope variables
  const monthOffsets = useMemo(() => {
    return DAYS_PER_MONTH.map((_, idx) => 
      DAYS_PER_MONTH.slice(0, idx).reduce((sum, days) => sum + days, 0)
    );
  }, []);

  return (
    <div className="custom-card p-3 w-100">
      <div className="border-bottom border-zinc-800 pb-3 mb-4">
        <h3 className="fs-4 fw-extrabold text-white text-uppercase m-0">{currentView}</h3>
      </div>
      
      <div className="row g-3 w-100 m-0">
        {months.map((m, mIdx) => {
          const currentStartOffset = monthOffsets[mIdx];
          
          return (
            <div key={m} className="col-12 col-md-6 col-lg-4 p-2">
              <div className="card p-3 border-zinc-800" style={{ backgroundColor: '#111114' }}>
                
                <span 
                  className="font-code text-white fw-bold mb-3 d-block border-bottom border-zinc-800 pb-2 text-uppercase" 
                  style={{ fontSize: '14px', letterSpacing: '0.5px' }}
                >
                  {m}
                </span>
                
                <div className="d-flex flex-wrap justify-content-start" style={{ gap: '6px' }}>
                  {Array.from({ length: DAYS_PER_MONTH[mIdx] }).map((_, dIdx) => {
                    const idx = currentStartOffset + dIdx;
                    const isChecked = Boolean(habitData[idx]);
                    const isPast = isPastDate(idx);
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => toggleDay(currentView, idx)}
                        disabled={isPast} 
                        className="btn p-0 rounded font-code fw-bold text-center" 
                        style={{ 
                          // FIX 1: Spread getDayStyles FIRST so explicit overrides take priority without ts(2783)
                          ...getDayStyles(isChecked, isPast),
                          width: '28px',
                          height: '28px',
                          fontSize: '10px',
                          cursor: isPast ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {(isPast && !isChecked) ? 'X' : (dIdx + 1).toString().padStart(2, '0')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}