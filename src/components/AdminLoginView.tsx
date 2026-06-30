import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, KeyRound, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, adminInfo: any) => void;
  setActivePage: (page: string) => void;
}

export default function AdminLoginView({ onLoginSuccess, setActivePage }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        onLoginSuccess(data.token, data.admin);
        setActivePage('admin-dashboard');
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="admin-login-view" className="max-w-md mx-auto px-4 py-16">
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-natural-border rounded-3xl shadow-none p-8 space-y-6"
      >
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <span className="p-4 bg-natural-accent/10 text-natural-accent rounded-full inline-block">
            <Lock size={22} />
          </span>
          <h2 className="font-serif text-2xl font-extrabold text-natural-text-dark tracking-tight">Admin Portal Login</h2>
          <p className="text-xs text-natural-text-muted font-normal">
            Authenticate to access the Dr. Decors dashboard, configure items, and manage customer inquiries.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="font-semibold text-natural-text-dark">Username</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-natural-text-muted">
                <User size={14} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="admin"
                className="w-full border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-accent pl-10 pr-5 py-3 rounded-full text-xs bg-natural-input/30 placeholder-natural-text-muted/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-natural-text-dark">Password</label>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-natural-text-muted">
                <KeyRound size={14} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="admin123"
                className="w-full border border-natural-border focus:outline-none focus:ring-1 focus:ring-natural-accent pl-10 pr-5 py-3 rounded-full text-xs bg-natural-input/30 placeholder-natural-text-muted/60"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-rose-500 font-semibold p-3 bg-rose-50 rounded-xl">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-natural-accent hover:bg-natural-accent-hover text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-all shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>



        </form>

      </motion.div>

    </div>
  );
}
