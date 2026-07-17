import React, { useState } from 'react';
import type { AuthMode } from '../types';

interface AuthPortalProps {
  readonly handleAuthSubmit: (mode: AuthMode, username: string, password: string) => Promise<void>;
}

export default function AuthPortal({ handleAuthSubmit }: AuthPortalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      // 1. Perform the API call
      await handleAuthSubmit(authMode, username, password);

      // 2. AUTOMATIC REDIRECT LOGIC:
      // If the user was in 'register' mode and successful, switch to 'login' automatically
      if (authMode === 'register') {
        setUsername(''); // Clear fields
        setPassword('');
        setAuthMode('login'); // Switch view automatically
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // You could add an error state here to show an alert to the user
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 w-100 p-3" style={{ backgroundColor: '#09090b' }}>
      
      {/* ADVANCED UI LIBRARY STYLING ENGINE */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Premium Canvas Card */
        .lib-auth-card {
          background-color: #09090b !important;
          border: 1px solid #1e1e24 !important;
          border-radius: 20px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7) !important;
          position: relative;
          overflow: hidden;
        }

        /* Ambient subtle backdrop glow */
        .lib-auth-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* High-Visibility Interactive Floating Inputs */
        .form-floating {
          position: relative;
          z-index: 1;
        }
        
        .form-floating > .form-control {
          color: #ffffff !important;
          background-color: #141417 !important;
          border: 1px solid #27272a !important;
          border-radius: 12px !important;
          font-size: 15px !important;
          font-weight: 500 !important;
          height: 58px !important;
          padding-left: 16px !important;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        /* Fix browser autofill hiding typed text colors */
        .form-control:-webkit-autofill,
        .form-control:-webkit-autofill:hover,
        .form-control:-webkit-autofill:focus {
          -webkit-text-fill-color: #ffffff !important;
          -webkit-box-shadow: 0 0 0px 1000px #141417 inset !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }

        /* Focus interactive state rings */
        .form-floating > .form-control:focus {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
          background-color: #16161a !important;
        }

        /* Floating Label Text Color States */
        .form-floating > label {
          color: #71717a !important;
          padding-left: 16px !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
        }

        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label {
          color: #a5b4fc !important;
          transform: scale(0.85) translateY(-0.6rem) translateX(0.15rem) !important;
          font-weight: 600 !important;
        }

        /* Crisp interactive button mechanics */
        .lib-btn-prime {
          background-color: #ffffff !important;
          color: #09090b !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          height: 46px !important;
          transition: all 0.2s ease !important;
          z-index: 1;
          position: relative;
        }

        .lib-btn-prime:hover:not(:disabled) {
          background-color: #f4f4f5 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.1) !important;
        }
      `}} />

      <div className="card lib-auth-card p-4 p-sm-5 text-light" style={{ maxWidth: '420px', width: '100%' }}>
        
        {/* CENTERED UI HEADER */}
        <div className="text-center mb-4 position-relative" style={{ zIndex: 1 }}>
          <span className="font-code text-indigo-400 fw-bold d-inline-block mb-2" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
            
          </span>
          <h2 className="fs-2 fw-extrabold text-white tracking-tight mb-2 font-heading">
            {authMode === 'login' ? 'Sign in to Matrix' : 'Join the Matrix'}
          </h2>
          <p className="text-zinc-500 m-0 px-2" style={{ fontSize: '13.5px' }}>
            {authMode === 'login' ? 'Enter your details below to sync your dashboard.' : 'Establish your core habit profile to get started'}
          </p>
        </div>

        {/* FLOATING FIELD LIBRARY FORM */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-3">
          
          {/* USERNAME INPUT CONTAINER */}
          <div className="form-floating">
            <input 
              type="text" 
              id="floatingUsername"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className="form-control" 
              placeholder="Username" 
              required 
              disabled={isLoading} 
              autoComplete="off"
            />
            <label htmlFor="floatingUsername">Username</label>
          </div>

          {/* PASSWORD INPUT CONTAINER */}
          <div className="form-floating">
            <input 
              type="password" 
              id="floatingPassword"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="form-control" 
              placeholder="Password" 
              required 
              disabled={isLoading} 
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <button 
            type="submit" 
            className="btn lib-btn-prime mt-3 d-flex align-items-center justify-content-center gap-2" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner-border spinner-border-sm text-dark" role="status" />
            ) : (
              authMode === 'login' ? 'Continue' : 'Create Account'
            )}
          </button>
        </form>

        {/* DYNAMIC VIEW ROUTER ACTION */}
        <div className="text-center mt-4 pt-3 position-relative" style={{ borderTop: '1px solid #18181b', zIndex: 1 }}>
          <button 
            onClick={() => {
              setUsername('');
              setPassword('');
              setAuthMode(prev => prev === 'login' ? 'register' : 'login');
            }} 
            className="btn p-0 border-0 text-zinc-500 bg-transparent transition-all" 
            style={{ fontSize: '13.5px' }} 
            disabled={isLoading}
          >
            {authMode === 'login' ? (
              <>Don't have an account? <span className="text-white fw-bold">Sign up</span></>
            ) : (
              <>Have an active profile? <span className="text-white fw-bold">Sign in</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}