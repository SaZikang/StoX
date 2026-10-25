import React, { useState } from 'react';
import { X, User, Lock, Mail, Loader2, LogIn, UserPlus, LogOut } from 'lucide-react';
import { supabase } from '../services/supabase';

export function AuthModal({ isOpen, onClose, user, setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userid, setUserid] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    if (!supabase) {
      setError('Supabase client is not configured. Please check your .env file.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: email || `${userid}@stox.local`,
          password,
          options: {
            data: { userid: userid || email.split('@')[0] }
          }
        });
        if (signUpErr) throw signUpErr;
        setSuccessMsg('Account created successfully! You are now signed in.');
        setUser(data.user);
        setTimeout(() => onClose(), 1500);
      } else {
        // Sign In
        // If user entered a username instead of email, check how to sign in or use email
        const loginEmail = email.includes('@') ? email : `${userid}@stox.local`;
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password
        });
        if (signInErr) throw signInErr;
        setSuccessMsg('Signed in successfully!');
        setUser(data.user);
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSuccessMsg('Signed out successfully.');
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-stox-card border border-stox-border rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl space-y-6 relative animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stox-dark border border-stox-border text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            {user ? 'StoX User Account' : (isSignUp ? 'Create StoX Account' : 'Sign In to StoX')}
          </h2>
          <p className="text-xs text-slate-400">
            {user
              ? `Signed in as ${user.email}`
              : (isSignUp ? 'Save your portfolio & watchlists securely to Supabase' : 'Access your synced portfolio & watchlists')}
          </p>
        </div>

        {user ? (
          <div className="space-y-4 pt-2">
            <div className="bg-stox-dark border border-stox-border rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">User ID / Email:</span>
                <span className="text-blue-400 font-bold">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Database Sync:</span>
                <span className="text-emerald-400 font-bold">🟢 Connected (Supabase RLS)</span>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 text-center font-mono">
                {successMsg}
              </div>
            )}

            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out of StoX
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 text-center font-mono">
                {successMsg}
              </div>
            )}

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Username (`userid`)</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. john_trader"
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                    className="w-full bg-stox-dark border border-stox-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email or Username</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder={isSignUp ? "your.email@domain.com" : "email or username"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stox-dark border border-stox-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stox-dark border border-stox-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" /> Create Supabase Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In to StoX
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-blue-400 hover:underline font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
