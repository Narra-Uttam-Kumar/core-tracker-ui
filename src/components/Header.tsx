 import type { ViewType, HabitKey } from '../types';

interface HeaderProps {
  readonly currentView: ViewType;
  readonly setCurrentView: (view: ViewType) => void;
  readonly handleLogout: () => void;
}

const NAV_HABITS: { key: HabitKey; name: string }[] = [
  { key: 'wakeup', name: 'Wake Up' }, { key: 'nosnooze', name: 'No Snooze' },
  { key: 'water', name: 'Water' }, { key: 'gym', name: 'Gym' },
  { key: 'stretching', name: 'Stretch' }, { key: 'read', name: 'Read' },
  { key: 'meditation', name: 'Meditate' }, { key: 'study', name: 'Study' },
  { key: 'skincare', name: 'Skincare' }, { key: 'socialmedia', name: 'Socials' },
  { key: 'noalcohol', name: 'Sobriety' }, { key: 'expenses', name: 'Finance' }
];

export default function Header({ currentView, setCurrentView, handleLogout }: HeaderProps) {
  return (
    <header 
      className="navbar navbar-dark glass-panel sticky-top px-3 px-md-4 py-3 d-flex flex-column gap-3" 
      style={{ 
        backgroundColor: 'rgba(17, 17, 19, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .nav-scroll-container::-webkit-scrollbar { display: none; }
        .nav-scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        
        .premium-nav-btn { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; }
        .premium-nav-btn:hover { color: #ffffff !important; background-color: rgba(255, 255, 255, 0.05) !important; transform: translateY(-1px); }
        .premium-nav-btn.active-view { background-color: #27272a !important; color: #ffffff !important; font-weight: 700 !important; }
        
        .premium-habit-btn { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important; border: 1px solid transparent !important; }
        .premium-habit-btn:hover { color: #a5b4fc !important; background-color: rgba(79, 70, 229, 0.08) !important; border-color: rgba(79, 70, 229, 0.2) !important; transform: translateY(-1px); }
        .premium-habit-btn.active-habit { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important; color: #ffffff !important; border-color: #818cf8 !important; box-shadow: 0 0 16px rgba(79, 70, 229, 0.4) !important; }
      `}} />

      {/* BRAND & LOGOUT LINK BAR */}
      <div className="d-flex align-items-center justify-content-between w-100">
        <span className="navbar-brand fw-extrabold font-heading text-white m-0 d-flex align-items-center gap-2" style={{ fontSize: '18px', letterSpacing: '0.8px', cursor: 'pointer' }} onClick={() => setCurrentView('tracker-sheet')}>
          <i className="bi bi-activity text-indigo-400"></i> CORE<span className="text-zinc-500">.MATRIX</span>
        </span>
        <button onClick={handleLogout} className="btn btn-sm btn-dark font-code border-0 px-3 py-2 text-danger bg-opacity-50 premium-nav-btn" style={{ fontSize: '12px', backgroundColor: '#1a1a1e', borderRadius: '6px' }}>
          <i className="bi bi-box-arrow-right me-1"></i> LOGOUT
        </button>
      </div>

      {/* CORE CONTROL ROW */}
      <div className="w-100 overflow-auto py-1 nav-scroll-container">
        <div className="d-flex flex-row align-items-center justify-content-between gap-4" style={{ width: '100%', minWidth: 'max-content' }}>
          
          {/* LEFT: Structural App Views */}
          <div className="d-flex align-items-center gap-2">
            <button onClick={() => setCurrentView('tracker-sheet')} className={`btn btn-sm font-code px-3 py-2 border-0 text-nowrap premium-nav-btn ${currentView === 'tracker-sheet' ? 'active-view' : 'text-zinc-400'}`} style={{ fontSize: '13px', borderRadius: '6px' }}>
              [ SHEET ]
            </button>
            <button onClick={() => setCurrentView('dashboard')} className={`btn btn-sm font-code px-3 py-2 border-0 text-nowrap premium-nav-btn ${currentView === 'dashboard' ? 'active-view' : 'text-zinc-400'}`} style={{ fontSize: '13px', borderRadius: '6px' }}>
              [ ANALYTICS ]
            </button>
            <button onClick={() => setCurrentView('12-month')} className={`btn btn-sm font-code px-3 py-2 border-0 text-nowrap premium-nav-btn ${currentView === '12-month' ? 'active-view' : 'text-zinc-400'}`} style={{ fontSize: '13px', borderRadius: '6px' }}>
              [ YEAR_DECK ]
            </button>
          </div>

          {/* RIGHT: Targeted Custom Habits */}
          <div className="d-flex align-items-center gap-2 pe-2">
            {NAV_HABITS.map((h) => (
              <button key={h.key} onClick={() => setCurrentView(h.key)} className={`btn btn-sm px-3 py-2 rounded-2 text-nowrap fw-semibold premium-habit-btn ${currentView === h.key ? 'active-habit' : 'text-zinc-500'}`} style={{ fontSize: '13px' }}>
                {h.name}
              </button>
            ))}
          </div>

        </div>
      </div>
    </header>
  );
}