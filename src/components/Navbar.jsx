import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Search, Bell, User, Bookmark, Globe, BarChart2, Newspaper, LayoutDashboard } from 'lucide-react';
import { STOCKS_DATA } from '../data/stocks';

export function Navbar({ activeTab, setActiveTab, onSelectStock, watchlist, setWatchlist }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const filteredStocks = searchQuery.trim() === '' ? [] : STOCKS_DATA.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-stox-dark/90 backdrop-blur-md border-b border-stox-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-100">StoX</span>
              <span className="block text-[10px] uppercase tracking-widest text-blue-400 font-semibold -mt-1">Terminal</span>
            </div>
          </button>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stox-card/80 p-1 rounded-xl border border-stox-border">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Markets
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'watchlist'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Watchlist ({watchlist.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'news'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              News Feed
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search stocks, crypto, indices, sectors (e.g. NVDA, Apple)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              className="w-full bg-stox-card border border-stox-border rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {isSearching && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-stox-card border border-stox-border rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
              <div className="p-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 border-b border-stox-border">
                Matching Instruments ({filteredStocks.length})
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-stox-border/50">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => {
                        onSelectStock(stock);
                        setIsSearching(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-stox-cardHover transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-xs text-blue-400 group-hover:border-blue-500/50">
                          {stock.symbol}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{stock.name}</div>
                          <div className="text-xs text-slate-500">{stock.sector}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono font-bold text-slate-100">${stock.price.toFixed(2)}</div>
                        <div className={`text-xs font-mono font-semibold flex items-center gap-0.5 justify-end ${stock.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500">
                    No matching instruments found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            NYSE / NASDAQ OPEN
          </div>

          <button className="p-2 rounded-xl bg-stox-card border border-stox-border text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>

          <div className="flex items-center gap-2.5 pl-2 border-l border-stox-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              ZK
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200">Zikang Sa</div>
              <div className="text-[10px] text-blue-400 font-mono">Pro Trader</div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
