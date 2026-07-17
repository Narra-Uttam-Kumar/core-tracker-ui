import React from 'react';
import type { HabitsData, HabitKey } from '../types';
import { isPastDate } from '../utils/dateUtils';

interface PlanProps {
  readonly habitsData: HabitsData;
  readonly toggleDay: (key: HabitKey, i: number) => Promise<void>;
}

const MONTH_INFOS = [
  { name: 'JAN', daysCount: 31 }, { name: 'FEB', daysCount: 28 }, { name: 'MAR', daysCount: 31 },
  { name: 'APR', daysCount: 30 }, { name: 'MAY', daysCount: 31 }, { name: 'JUN', daysCount: 30 },
  { name: 'JUL', daysCount: 31 }, { name: 'AUG', daysCount: 31 }, { name: 'SEP', daysCount: 30 },
  { name: 'OCT', daysCount: 31 }, { name: 'NOV', daysCount: 30 }, { name: 'DEC', daysCount: 31 }
];

export default function PlanView({ habitsData, toggleDay }: PlanProps): React.ReactNode {
  return (
    <div className="container-fluid p-2 w-100 overflow-hidden">
      <h3 className="text-white fw-extrabold fs-6 mb-3"> 365_DAYS_MATRIX</h3>
      
      <div className="row g-3 w-100 m-0">
        {Object.keys(habitsData).map((key) => {
          const habitKey = key as HabitKey;
          const dataRowArray = habitsData[habitKey] || Array(365).fill(false);
          
          return (
            <div key={habitKey} className="col-12 col-md-6 col-lg-4 p-1">
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800 h-100 d-flex flex-column">
                
                <span 
                  className="font-code text-white fw-bold d-block mb-3 ps-1 text-uppercase" 
                  style={{ fontSize: '14px', letterSpacing: '0.5px' }}
                >
                  {habitKey}
                </span>

                {/* Horizontal Scroll wrapper enabled for smaller screen boundaries */}
                <div className="w-100 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                  <div className="d-flex gap-2 justify-content-between" style={{ minWidth: '340px' }}>
                    {MONTH_INFOS.map((m, mIdx) => {
                      const start = MONTH_INFOS.slice(0, mIdx).reduce((sum, m) => sum + m.daysCount, 0);
                      return (
                        <div key={m.name} className="d-flex flex-column align-items-center" style={{ flex: 1, minWidth: '24px' }}>
                          
                          <div className="text-zinc-500 font-code mb-2 text-center fw-bold" style={{ fontSize: '8px' }}>
                            {m.name}
                          </div>

                          <div 
                            className="d-grid gap-1 justify-content-center"
                            style={{ 
                              gridTemplateColumns: 'repeat(2, 6px)',
                              rowGap: '3px'
                            }}
                          >
                            {Array.from({ length: m.daysCount }).map((_, dIdx) => {
                              const idx = start + dIdx;
                              const done = !!dataRowArray[idx];
                              const isPast = isPastDate(idx);
                              
                              return (
                                <div 
                                  key={idx} 
                                  onClick={() => !isPast && toggleDay(habitKey, idx)} 
                                  className="rounded-circle" 
                                  style={{ 
                                    width: '6px', 
                                    height: '6px', 
                                    cursor: isPast ? 'not-allowed' : 'pointer', 
                                    backgroundColor: done ? '#4f46e5' : (isPast && !done ? '#ef4444' : '#3f3f46'),
                                    transition: 'background-color 0.15s, transform 0.1s'
                                  }} 
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}