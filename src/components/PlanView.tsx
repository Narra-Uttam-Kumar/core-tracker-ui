import React, { memo } from 'react';
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

// Pre-calculate month starting offsets once to avoid running reduce in render loops
const MONTH_STARTS = MONTH_INFOS.reduce<number[]>((acc, month, i) => {
  const prev = i === 0 ? 0 : acc[i - 1] + MONTH_INFOS[i - 1].daysCount;
  acc.push(prev);
  return acc;
}, []);

interface HabitCardProps {
  readonly habitKey: HabitKey;
  readonly dataRowArray: boolean[];
  readonly toggleDay: (key: HabitKey, i: number) => Promise<void>;
}

const HabitCard = memo(({ habitKey, dataRowArray, toggleDay }: HabitCardProps) => {
  return (
    <div className="col-12 col-md-6 col-lg-4 p-1">
      <div className="bg-zinc-950 p-3 rounded border border-zinc-800 h-100 d-flex flex-column">
        
        <span 
          className="font-code text-white fw-bold d-block mb-3 ps-1 text-uppercase" 
          style={{ fontSize: '14px', letterSpacing: '0.5px' }}
        >
          {habitKey}
        </span>

        {/* Horizontal Scroll wrapper for smaller screen boundaries */}
        <div className="w-100 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
          <div className="d-flex gap-2 justify-content-between" style={{ minWidth: '340px' }}>
            {MONTH_INFOS.map((m, mIdx) => {
              const start = MONTH_STARTS[mIdx];
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
                      const done = Boolean(dataRowArray[idx]);
                      const isPast = isPastDate(idx);
                      
                      return (
                        <button 
                          key={idx} 
                          type="button"
                          onClick={() => toggleDay(habitKey, idx)} 
                          disabled={isPast}
                          aria-label={`Day ${idx + 1} - ${done ? 'Completed' : 'Incomplete'}`}
                          className="rounded-circle p-0 border-0" 
                          style={{ 
                            width: '6px', 
                            height: '6px', 
                            cursor: isPast ? 'not-allowed' : 'pointer', 
                            backgroundColor: done ? '#4f46e5' : (isPast ? '#ef4444' : '#3f3f46'),
                            transition: 'background-color 0.15s, transform 0.1s',
                            outline: 'none'
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
});

HabitCard.displayName = 'HabitCard';

export default function PlanView({ habitsData, toggleDay }: PlanProps): React.ReactNode {
  const habitKeys = Object.keys(habitsData) as HabitKey[];

  return (
    <div className="container-fluid p-2 w-100 overflow-hidden">
      <h3 className="text-white fw-extrabold fs-6 mb-3 font-code">365_DAYS_MATRIX</h3>
      
      <div className="row g-3 w-100 m-0">
        {habitKeys.map((habitKey) => {
          const dataRowArray = habitsData[habitKey] || Array(365).fill(false);
          
          return (
            <HabitCard 
              key={habitKey}
              habitKey={habitKey}
              dataRowArray={dataRowArray}
              toggleDay={toggleDay}
            />
          );
        })}
      </div>
    </div>
  );
}