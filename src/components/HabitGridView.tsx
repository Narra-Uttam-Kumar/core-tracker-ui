import React from 'react';
import type { HabitKey } from '../types';
import { isPastDate, getDayStyles } from '../utils/dateUtils';

interface GridProps {
  readonly currentView: HabitKey;
  readonly habitData: boolean[];
  readonly toggleDay: (key: HabitKey, i: number) => Promise<void>;
  readonly getHabitColorClass: (habitKey: HabitKey, isCompleted: boolean) => string;
  readonly months: string[];
}

const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export default function HabitGridView({ 
  currentView, 
  habitData, 
  toggleDay, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getHabitColorClass, 
  months 
}: GridProps): React.ReactNode {
  return (
    <div className="custom-card p-3 w-100">
      <div className="border-bottom border-zinc-800 pb-3 mb-4">
        <h3 className="fs-4 fw-extrabold text-white text-uppercase m-0">{currentView}</h3>
      </div>
      
      {/* Changed responsive grid layouts to give each card more space (col-lg-4 and col-md-6) */}
      <div className="row g-3 w-100 m-0">
        {months.map((m, mIdx) => {
          const currentStartOffset = DAYS_PER_MONTH.slice(0, mIdx).reduce((sum, d) => sum + d, 0);
          return (
            <div key={m} className="col-12 col-md-6 col-lg-4 p-2">
              <div className="card p-3 border-zinc-800" style={{ backgroundColor: '#111114' }}>
                
                {/* Scaled up the Month label size */}
                <span 
                  className="font-code text-white fw-bold mb-3 d-block border-bottom border-zinc-800 pb-2 text-uppercase" 
                  style={{ fontSize: '14px', letterSpacing: '0.5px' }}
                >
                  {m}
                </span>
                
                {/* Flex layout for day items */}
                <div className="d-flex flex-wrap gap-1.5 justify-content-start">
                  {Array.from({ length: DAYS_PER_MONTH[mIdx] }).map((_, dIdx) => {
                    const idx = currentStartOffset + dIdx;
                    const isChecked = habitData[idx];
                    const isPast = isPastDate(idx);
                    
                    return (
                      <button 
                        key={idx} 
                        onClick={() => !isPast && toggleDay(currentView, idx)} 
                        className="btn p-0 rounded font-code fw-bold text-center" 
                        style={{ 
                          width: '28px', // Increased from 22px
                          height: '28px', // Increased from 22px
                          fontSize: '10px', // Increased from 8px
                          ...getDayStyles(isChecked, isPast),
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