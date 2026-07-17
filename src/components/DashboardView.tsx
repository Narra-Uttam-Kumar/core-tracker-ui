import React from 'react';
import type { HabitsData } from '../types';

interface DashboardProps {
  readonly habitsData: HabitsData;
}

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function DashboardView({ habitsData }: DashboardProps) {
  const totalHabitsCount = Object.keys(habitsData).length;
  const maxPossiblePoints = totalHabitsCount * 365;
  
  // 1. Calculate Aggregate Totals
  let globalTotalCompletions = 0;
  const habitStats = Object.entries(habitsData).map(([key, list]) => {
    const completionsCount = list.filter(Boolean).length;
    globalTotalCompletions += completionsCount;
    return {
      key,
      completionsCount,
      percentage: (completionsCount / 365) * 100,
    };
  });

  const globalConsistencyRate = maxPossiblePoints > 0 
    ? ((globalTotalCompletions / maxPossiblePoints) * 100).toFixed(1) 
    : "0.0";

  // 2. Compute Monthly Ticks Timeline (FIXED: Pure functional slice replaces internal mutation)
  const monthlyCompletions = MONTH_DAYS.map((daysCount, mIdx) => {
    const currentStartOffset = MONTH_DAYS.slice(0, mIdx).reduce((sum, d) => sum + d, 0);
    let monthTotal = 0;
    
    Object.values(habitsData).forEach((list) => {
      const monthDaysData = list.slice(currentStartOffset, currentStartOffset + daysCount);
      monthTotal += monthDaysData.filter(Boolean).length;
    });
    
    return monthTotal;
  });

  const maxMonthlyValue = Math.max(...monthlyCompletions, 1);

  // 3. SVG Radial Circle Metric Setup
  const radius = 24;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="container-fluid p-0 select-none font-sans">
      
      {/* SECTION 1: METRICS STRIPS */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6 col-xl-4">
          <div className="custom-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="font-code text-zinc-500 fw-bold d-block mb-1" style={{ fontSize: '13px' }}>[ HABITS_CONSISTENCY ]</span>
              <h3 className="fs-1 fw-extrabold m-0 text-white font-heading">{globalConsistencyRate}%</h3>
            </div>
            <div className="rounded-4 p-3" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.2)' }}>
              <i className="bi bi-speedometer2 text-indigo-400 fs-3"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <div className="custom-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="font-code text-zinc-500 fw-bold d-block mb-1" style={{ fontSize: '13px' }}>[ TOTAL_COMPLETIONS ]</span>
              <h3 className="fs-1 fw-extrabold m-0 text-white font-heading">{globalTotalCompletions} <span className="fs-5 fw-normal text-zinc-600">ticks</span></h3>
            </div>
            <div className="rounded-4 p-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <i className="bi bi-check-all text-emerald-400 fs-3"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="custom-card p-4 d-flex align-items-center justify-content-between">
            <div>
              <span className="font-code text-zinc-500 fw-bold d-block mb-1" style={{ fontSize: '13px' }}>[ MONITORED_HABITS ]</span>
              <h3 className="fs-1 fw-extrabold m-0 text-white font-heading">{totalHabitsCount} <span className="fs-5 fw-normal text-zinc-600">active</span></h3>
            </div>
            <div className="rounded-4 p-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <i className="bi bi-cpu text-warning fs-3"></i>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: GRAPH VISUALIZATION SUITE */}
      <div className="row g-4 mb-4">
        
        {/* GRAPH A: MULTI-MONTH PROGRESSION LINE CHART */}
        <div className="col-12 col-xl-6">
          <div className="custom-card p-4">
            <span className="font-code text-zinc-400 fw-bold tracking-wider mb-4 d-block" style={{ fontSize: '13px' }}>
              <i className="bi bi-graph-up text-indigo-400 me-2"></i> [ LINE_CHART // MONTHLY_PROGRESS_HABITS ]
            </span>
            <div className="w-100 overflow-auto pt-2">
              <svg viewBox="0 0 600 200" className="w-100" style={{ minWidth: '450px', overflow: 'visible' }}>
                <line x1="30" y1="160" x2="580" y2="160" stroke="#1f1f24" strokeWidth="1" />
                <line x1="30" y1="95" x2="580" y2="95" stroke="#1c1c21" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="30" y1="30" x2="580" y2="30" stroke="#1c1c21" strokeWidth="1" strokeDasharray="4 4" />

                {(() => {
                  const xSpacing = 50;
                  const points = monthlyCompletions.map((val, idx) => {
                    const x = 40 + idx * xSpacing;
                    const y = 160 - (val / maxMonthlyValue) * 120;
                    return `${x},${y}`;
                  }).join(' ');

                  return (
                    <>
                      <path
                        d={`M 40,160 L ${points} L 540,160 Z`}
                        fill="url(#lineAreaGradient)"
                        style={{ transition: 'all 0.5s ease' }}
                      />
                      <polyline
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="3"
                        points={points}
                        style={{ filter: 'drop-shadow(0px 4px 6px rgba(99,102,241,0.4))', transition: 'all 0.5s ease' }}
                      />
                      {monthlyCompletions.map((val, idx) => {
                        const x = 40 + idx * xSpacing;
                        const y = 160 - (val / maxMonthlyValue) * 120;
                        return (
                          <g key={idx}>
                            <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                            <text x={x} y={y - 10} textAnchor="middle" fill="#818cf8" className="font-code fw-bold" style={{ fontSize: '10px' }}>
                              {val}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}

                {MONTH_NAMES.map((name, idx) => (
                  <text key={name} x={40 + idx * 50} y="185" textAnchor="middle" fill="#71717a" className="font-code fw-bold" style={{ fontSize: '10px' }}>
                    {name}
                  </text>
                ))}

                <defs>
                  <linearGradient id="lineAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(99, 102, 241, 0.25)" />
                    <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* GRAPH B: COMPARATIVE TARGET BAR CHART */}
        <div className="col-12 col-xl-6">
          <div className="custom-card p-4">
            <span className="font-code text-zinc-400 fw-bold tracking-wider mb-4 d-block" style={{ fontSize: '13px' }}>
              <i className="bi bi-bar-chart text-indigo-400 me-2"></i> [ BAR_CHART // HABITS_PROGRESS_COMPARISON ]
            </span>
            <div className="w-100 overflow-auto pt-2">
              <svg viewBox="0 0 600 200" className="w-100" style={{ minWidth: '450px', overflow: 'visible' }}>
                <line x1="20" y1="160" x2="580" y2="160" stroke="#1f1f24" strokeWidth="1" />
                <line x1="20" y1="95" x2="580" y2="95" stroke="#1c1c21" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="20" y1="30" x2="580" y2="30" stroke="#1c1c21" strokeWidth="1" strokeDasharray="4 4" />
                
                {habitStats.map((stat, idx) => {
                  const barWidth = 24;
                  const xPos = idx * 46 + 35;
                  const currentBarHeight = Math.max((stat.percentage / 100) * 130, 4);
                  const yPos = 160 - currentBarHeight;

                  return (
                    <g key={stat.key}>
                      <rect x={xPos} y={yPos} width={barWidth} height={currentBarHeight} fill={stat.completionsCount > 0 ? "url(#barGradient)" : "#1d1d22"} rx="3" style={{ filter: stat.completionsCount > 0 ? 'drop-shadow(0px 0px 6px rgba(99,102,241,0.35))' : 'none', transition: 'all 0.5s ease' }} />
                      <text x={xPos + barWidth / 2} y={yPos - 8} textAnchor="middle" fill={stat.completionsCount > 0 ? "#818cf8" : "#52525b"} className="font-code fw-bold" style={{ fontSize: '10px' }}>
                        {stat.completionsCount}
                      </text>
                      <text x={xPos + barWidth / 2} y="182" textAnchor="middle" fill="#71717a" className="font-code fw-bold text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.2px' }}>
                        {stat.key.substring(0, 4)}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 3: RADIAL GAUGES */}
      <div className="row g-4">
        <div className="col-12">
          <h3 className="fs-5 fw-bold font-code text-indigo-400 m-0">[ DETAILED_VECTOR_CHANNELS ]</h3>
        </div>
        
        {habitStats.map((stat) => {
          const strokeDashoffset = circumference - (stat.percentage / 100) * circumference;

          return (
            <div key={stat.key} className="col-12 col-md-6 col-xl-4">
              <div className="custom-card p-4 d-flex align-items-center justify-content-between">
                
                <div className="flex-grow-1 text-truncate pe-2">
                  <span className="text-uppercase font-code text-zinc-400 fw-bold d-block mb-1" style={{ fontSize: '13px', letterSpacing: '0.5px' }}>
                    {stat.key}
                  </span>
                  <h4 className="fs-3 fw-extrabold text-white m-0 font-heading">
                    {stat.completionsCount} <span className="text-zinc-600 fs-6 fw-normal">/ 365 Days</span>
                  </h4>
                </div>

                <div className="position-relative d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '68px', height: '68px' }}>
                  <svg width="68" height="68" viewBox="0 0 64 64" className="transform -rotate-90">
                    <circle cx="32" cy="32" r={radius} fill="transparent" stroke="#1c1c21" strokeWidth="4" />
                    <circle cx="32" cy="32" r={radius} fill="transparent" stroke={stat.completionsCount > 0 ? "#4f46e5" : "#27272a"} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease-in-out', filter: stat.completionsCount > 0 ? 'drop-shadow(0px 0px 5px rgba(99,102,241,0.5))' : 'none' }} />
                  </svg>
                  <div className="position-absolute font-code text-center text-white fw-bold" style={{ fontSize: '10px' }}>
                    {stat.percentage.toFixed(0)}%
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