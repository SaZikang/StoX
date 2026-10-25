import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowRight, ShieldCheck, Zap, BarChart2, Newspaper, Wallet, Globe, Lock, CheckCircle2, Sun, Moon, Sparkles, Activity } from 'lucide-react';
import { StockLogo } from './StockLogo';
import { AnimatedMarketBackground } from './AnimatedMarketBackground';

export function LandingView({ onEnterApp, onOpenAuth, user, theme, setTheme, onToggleTheme }) {
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const isLight = theme === 'light';

  const handleProtectedAction = (action) => {
    if (!user) {
      onOpenAuth();
    } else {
      action();
    }
  };

  const features = [
    {
      title: 'Dark Mode Command Center',
      subtitle: 'Immersive Bloomberg-grade terminal experience',
      desc: 'Real-time equity valuation, daily unrealized P&L, portfolio momentum trends, top market gainers, and regional stock grids in a sophisticated dark interface.',
      image: 'https://github.com/user-attachments/assets/c9399c42-bef2-47d5-8e62-d25eecf56e1f',
      badge: 'Dark Terminal'
    },
    {
      title: 'High-Contrast Light Mode',
      subtitle: 'Crisp, elegant readability for daylight trading',
      desc: 'A pristine, high-contrast light theme engineered for all-day financial analysis without eye fatigue, matching every chart and widget flawlessly.',
      image: 'https://github.com/user-attachments/assets/b44f1600-e3a0-49c7-85e2-80b3cc3570f8',
      badge: 'Light Theme'
    },
    {
      title: 'Investment Portfolio Manager',
      subtitle: 'Track positions, cost basis & cumulative returns',
      desc: 'Multi-user portfolio tracker backed by Supabase RLS. Input your shares and purchase prices to track real-time net returns and automated valuation curves.',
      image: 'https://github.com/user-attachments/assets/836e0d1e-8d00-404c-9b2b-c93181eab542',
      badge: 'Portfolio Tracker'
    },
    {
      title: 'Watchlist & Asset Grid',
      subtitle: 'Instant tracking of saved financial instruments',
      desc: 'Monitor global equities, 24h performance badges, market cap metrics, and sector breakdowns in a lightning-fast responsive grid.',
      image: 'https://github.com/user-attachments/assets/99827853-b8bb-4574-8a34-4b1ffc04e068',
      badge: 'Watchlists'
    },
    {
      title: 'Market Intelligence & AI News',
      subtitle: 'Yahoo Finance feeds & instant AI article summaries',
      desc: 'Stay ahead of breaking macroeconomic updates, central bank pivots, and ticker catalysts with automated AI summary briefs.',
      image: 'https://github.com/user-attachments/assets/1d2bf229-8331-40fc-adb3-d17430e63cc5',
      badge: 'News & AI'
    }
  ];

  return (
    <div className={`min-h-screen ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0b0f19] text-slate-100'} font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300 relative overflow-hidden`}>
      <AnimatedMarketBackground isLight={isLight} />

      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${isLight ? 'bg-white/85 border-slate-200' : 'bg-[#0b0f19]/85 border-slate-800'} px-8 h-20 flex items-center justify-between`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30 text-lg">
            S
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-blue-500">StoX</span>
            <span className={`text-[10px] block font-mono font-semibold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Financial Terminal</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold font-mono tracking-wide">
          <a href="#features" className={`hover:text-blue-500 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>FEATURES</a>
          <a href="#demo" className={`hover:text-blue-500 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>LIVE PREVIEW</a>
          <a href="#markets" className={`hover:text-blue-500 transition-colors ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>GLOBAL SESSIONS</a>
        </nav>

        <div className="flex items-center gap-4">
          {/* Theme Toggle with Circular Ripple Animation */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={(e) => onToggleTheme ? onToggleTheme(e) : setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              isLight
                ? 'bg-white border-slate-200 text-amber-500 hover:bg-slate-100'
                : 'bg-slate-900 border-slate-800 text-blue-400 hover:bg-slate-800'
            }`}
            title={theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          </motion.button>

          <button
            onClick={onOpenAuth}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              isLight
                ? 'bg-slate-900 border-slate-900 text-white hover:bg-slate-800 shadow-md'
                : 'bg-white border-white text-slate-900 hover:bg-slate-200 shadow-md'
            }`}
          >
            {user ? 'My Account' : 'Sign In / Register'}
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleProtectedAction(onEnterApp)}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-mono text-xs font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all cursor-pointer"
          >
            <span>Launch Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-8 pt-24 pb-20 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/4 right-10 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono mb-8 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Next-Generation Global Market Intelligence & Terminal</span>
          </div>

          <h1 className={`text-5xl md:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Professional Trading Terminal, <br />
            <span className="text-blue-500">
              Built for Modern Investors.
            </span>
          </h1>

          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
            Experience lightning-fast live market quotes, automated AI news sentiment analysis, global session tracking, and institutional portfolio valuation curves in one breathtaking web platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProtectedAction(onEnterApp)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 text-white font-mono text-sm font-bold shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 cursor-pointer hover:bg-blue-500 transition-all"
            >
              <span>Explore Live Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAuth}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl border font-mono text-sm font-bold transition-all cursor-pointer ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
                  : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {user ? 'Open Dashboard' : 'Create Free Account'}
            </motion.button>
          </div>
        </motion.div>

        {/* Hero Preview Card with Scroll Float Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 relative max-w-5xl mx-auto rounded-3xl overflow-hidden border shadow-2xl group cursor-pointer"
          onClick={() => handleProtectedAction(onEnterApp)}
        >
          <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
          <img
            src="https://github.com/user-attachments/assets/c9399c42-bef2-47d5-8e62-d25eecf56e1f"
            alt="StoX Terminal Preview"
            className="w-full object-cover rounded-3xl shadow-2xl transform group-hover:scale-[1.01] transition-transform duration-500"
          />
        </motion.div>
      </section>

      {/* Feature Showcase Section with Scroll Float */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        id="features"
        className={`py-24 px-8 relative z-10 ${isLight ? 'bg-slate-100/75 border-y border-slate-200' : 'bg-slate-900/40 border-y border-slate-800/80'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest mb-3 block">Platform Capability</span>
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Designed for Absolute Precision
            </h2>
            <p className={`text-sm md:text-base ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Explore the core modules powering StoX, built from the ground up for speed, accuracy, and stunning aesthetics.
            </p>
          </div>

          {/* Feature Tabs Header */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {features.map((f, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFeatureTab(idx)}
                className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFeatureTab === idx
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : isLight
                    ? 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                {f.badge}
              </button>
            ))}
          </div>

          {/* Active Feature Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center rounded-3xl p-8 md:p-12 border ${
                isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border shadow-2xl'
              }`}
            >
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-block px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-mono text-xs font-semibold">
                  {features[activeFeatureTab].badge}
                </div>
                <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {features[activeFeatureTab].title}
                </h3>
                <p className={`text-sm font-semibold ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                  {features[activeFeatureTab].subtitle}
                </p>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {features[activeFeatureTab].desc}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => handleProtectedAction(onEnterApp)}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Test This Feature</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 rounded-2xl overflow-hidden border shadow-lg">
                <img
                  src={features[activeFeatureTab].image}
                  alt={features[activeFeatureTab].title}
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Global Sessions & Markets Banner with Scroll Float */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        id="markets"
        className="py-20 px-8 max-w-7xl mx-auto text-center relative z-10"
      >
        <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest mb-3 block">Global Liquidity</span>
        <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-6 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Live Global Market Sessions
        </h2>
        <p className={`text-sm max-w-2xl mx-auto mb-12 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          Track 24-hour liquidity flows across major international financial centers with automatic timezone synchronization.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { session: 'Sydney Session', time: '22:00 – 07:00 GMT', desc: 'Opening leg of Pacific liquidity' },
            { session: 'Tokyo Session', time: '00:00 – 09:00 GMT', desc: 'Major Asian financial hub' },
            { session: 'London Session', time: '08:00 – 17:00 GMT', desc: 'Most active & liquid European window' },
            { session: 'New York Session', time: '13:00 – 22:00 GMT', desc: 'High-volume North American session' }
          ].map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border text-left transition-all hover:scale-[1.02] ${
                isLight ? 'bg-white border-slate-200 shadow-md' : 'bg-stox-card border-stox-border shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold text-xs">
                  0{idx + 1}
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <h4 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.session}</h4>
              <div className="text-xs font-mono text-blue-500 font-semibold mb-2">{s.time}</div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-300'}`}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className={`py-12 px-8 border-t relative z-10 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-900 text-slate-300'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>StoX Financial Terminal</span>
          </div>

          <div className="text-xs font-mono">
            © {new Date().getFullYear()} StoX Inc. All rights reserved. Built with precision & craft.
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
            <a href="#markets" className="hover:text-blue-500 transition-colors">Sessions</a>
            <button onClick={onOpenAuth} className="hover:text-blue-500 transition-colors">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
