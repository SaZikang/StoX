import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ShieldCheck, Mail, Key, Sparkles, LogOut } from 'lucide-react';

export function AccountModal({ isOpen, onClose, user, onLogout, theme }) {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111827] border-slate-800 text-slate-100'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">Account Information</h3>
                <span className="text-[11px] font-mono text-blue-500">StoX Terminal Profile</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-slate-800 text-slate-400'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-6 space-y-4">
            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">User ID / Handle</span>
                <span className="text-xs font-mono font-bold">{user?.user_metadata?.userid || user?.email?.split('@')[0] || 'Trader'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Email Address</span>
                <span className="text-xs font-mono font-bold">{user?.email || 'guest@stox.com'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Authentication</span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Supabase Secure JWT
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Terminal License</span>
                <span className="text-xs font-mono text-blue-400 font-bold">StoX Pro Tier</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out & Exit</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
