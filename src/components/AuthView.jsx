import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail, User, Key, CheckCircle2, Loader2, Sparkles, Sun, Moon } from 'lucide-react';
import { supabase } from '../services/supabase';

export function AuthView({ onBackToLanding, onSuccessAuth, theme, setTheme, onToggleTheme }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userid, setUserid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (!supabase) {
        // Guest mode simulation with local storage
        setTimeout(() => {
          const fakeUser = {
            id: 'guest-' + Date.now(),
            email: email || 'trader@stox.com',
            user_metadata: { userid: userid || email.split('@')[0] || 'Trader' }
          };
          localStorage.setItem('stox_guest_user', JSON.stringify(fakeUser));
          setSuccessMsg('Authentication successful! Launching terminal...');
          setTimeout(() => {
            onSuccessAuth(fakeUser);
          }, 800);
        }, 600);
        return;
      }

      if (isSignUp) {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { userid: userid || email.split('@')[0] }
          }
        });
        if (signUpErr) throw signUpErr;
        setSuccessMsg('Account created successfully! Signing you in...');
        if (data?.session?.user) {
          setTimeout(() => onSuccessAuth(data.session.user), 800);
        } else {
          setTimeout(() => onSuccessAuth({ email, user_metadata: { userid } }), 800);
        }
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) throw signInErr;
        setSuccessMsg('Signed in successfully! Launching terminal...');
        setTimeout(() => {
          onSuccessAuth(data?.session?.user || { email });
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f19] text-slate-100'} font-sans flex flex-col justify-between p-8 transition-colors duration-300`}>
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
            isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Startup Page</span>
        </button>

        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => onToggleTheme ? onToggleTheme(e) : setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
              isLight ? 'bg-white border-slate-200 text-amber-500' : 'bg-slate-900 border-slate-800 text-blue-400'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </motion.button>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="max-w-md mx-auto w-full py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`p-8 md:p-10 rounded-3xl border shadow-2xl ${
            isLight ? 'bg-white border-slate-200 shadow-slate-200/50' : 'bg-stox-card border-stox-border shadow-black/50'
          }`}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
              S
            </div>
            <h2 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isSignUp ? 'Create StoX Account' : 'Sign In to StoX'}
            </h2>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {isSignUp ? 'Get started with your pro financial terminal & portfolio sync' : 'Welcome back! Access your synced portfolio & watchlists'}
            </p>
          </div>

          {/* Toggle Tab */}
          <div className={`grid grid-cols-2 p-1 rounded-2xl mb-8 border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                !isSignUp ? 'bg-blue-600 text-white shadow-md' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                isSignUp ? 'bg-blue-600 text-white shadow-md' : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className={`block text-xs font-mono font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Trader Handle / Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={userid}
                    onChange={(e) => setUserid(e.target.value)}
                    placeholder="e.g. SatoshiTrader"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs font-mono transition-colors focus:outline-none focus:border-blue-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-mono font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@stox.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs font-mono transition-colors focus:outline-none focus:border-blue-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-mono font-semibold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border text-xs font-mono transition-colors focus:outline-none focus:border-blue-500 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
                  }`}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account & Launch' : 'Sign In & Launch Terminal'}</span>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center text-[11px] font-mono text-slate-500">
            Protected by Supabase Row Level Security & JWT Authentication.
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto w-full text-center text-xs font-mono text-slate-500">
        StoX Financial Systems • Secure Terminal Gateway
      </div>
    </div>
  );
}
