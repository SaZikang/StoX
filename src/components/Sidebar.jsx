import React from 'react';
import { TrendingUp, LayoutDashboard, Wallet, Bookmark, Newspaper, ShieldCheck } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, watchlistCount, portfolioCount, onReturnToLanding, theme = 'dark' }) {
  const isLight = theme === 'light';

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet, count: portfolioCount },
    { id: 'watchlist', label: 'Watchlist', icon: Bookmark, count: watchlistCount },
    { id: 'news', label: 'News Feed', icon: Newspaper },
  ];

  return (
    <aside className={`fixed top-0 left-0 w-[240px] h-full ${isLight ? 'bg-white border-slate-200 shadow-2xl shadow-slate-200/50 text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} z-50 flex flex-col select-none transition-colors duration-300`}>
      {/* Logo */}
      <div
        onClick={onReturnToLanding}
        className={`p-6 flex items-center gap-3 border-b cursor-pointer group ${isLight ? 'border-slate-100 hover:bg-slate-50' : 'border-stox-border/60 hover:bg-stox-cardHover'} transition-colors`}
        title="Return to Startup Page"
      >
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-400/30 group-hover:scale-105 transition-transform">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className={`text-lg font-bold tracking-tight group-hover:text-blue-500 transition-colors ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>StoX</span>
          <span className="block text-[9px] uppercase tracking-widest text-blue-500 font-semibold -mt-1">Terminal Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        <div className={`px-3 pb-2 text-[10px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-wider font-mono`}>
          Main Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? (isLight ? 'bg-blue-100/80 text-blue-600 font-bold shadow-sm border border-blue-200' : 'bg-[#5865F2]/20 text-[#5865F2] font-bold shadow-sm')
                  : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover')
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? (isLight ? 'text-blue-500' : 'text-[#5865F2]') : (isLight ? 'text-slate-500' : 'text-slate-400')}`} />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${isActive ? (isLight ? 'bg-blue-500 text-white' : 'bg-[#5865F2] text-white') : (isLight ? 'bg-slate-100 text-slate-600' : 'bg-stox-dark text-slate-400')}`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Currency / Market Rate Widget at Bottom */}
      <div className="p-4 mt-auto mb-6">
        <div className={`${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-stox-dark border-stox-border text-slate-200'} border rounded-2xl p-4 space-y-2 shadow-inner`}>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Market Rates
          </div>
          <div className="flex items-center justify-between font-mono text-xs">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>USD / MYR</span>
            <span className="text-emerald-500 font-bold">4.2850</span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs">
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>S&amp;P Fut</span>
            <span className="text-emerald-500 font-bold">+0.83%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
