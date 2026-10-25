import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Key, User, Loader2, Sun, Moon, Camera, Settings, Sliders, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { searchAlphaVantageSymbols } from '../services/alphavantage';
import { StockLogo } from './StockLogo';
import { getMarketStatus } from '../utils/marketHours';

export function Header({ onSelectStock, onOpenApiKeyModal, hasApiKey, stocks, apiKey, user, onOpenAuthModal, theme, setTheme, onToggleTheme, onOpenSnapshotModal, onOpenAccountModal, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  const isLight = theme === 'light';

  const localFiltered = searchQuery.trim() === '' ? [] : stocks.filter(s =>
    s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearching(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(localFiltered);
      setIsLoadingSearch(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSearch(true);
      let combined = [...localFiltered];

      if (apiKey) {
        const remoteResults = await searchAlphaVantageSymbols(searchQuery, apiKey);
        const existingSymbols = new Set(combined.map(s => s.symbol.toUpperCase()));
        for (const r of remoteResults) {
          if (!existingSymbols.has(r.symbol.toUpperCase())) {
            combined.push(r);
            existingSymbols.add(r.symbol.toUpperCase());
          }
        }
      }

      setSearchResults(combined);
      setIsLoadingSearch(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, apiKey, stocks]);

  return (
    <header className={`sticky top-0 h-20 ${isLight ? 'bg-white/95 border-slate-200 shadow-md text-slate-900' : 'bg-stox-card/90 border-stox-border text-slate-100'} backdrop-blur-xl border-b z-40 flex items-center justify-between px-8 transition-colors duration-300`}>
      {/* Left Title / Info */}
      <div className="flex items-center gap-4">
        <h2 className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'} tracking-tight`}>Trading Dashboard</h2>
      </div>

      {/* Thicker Search Bar in Middle with Interactive Expanding Animation */}
      <motion.div
        initial={false}
        animate={{ scale: isSearching ? 1.02 : 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 max-w-lg mx-8 relative"
        ref={searchRef}
      >
        <motion.div
          animate={{
            boxShadow: isSearching
              ? (isLight ? '0 15px 35px -5px rgba(59, 130, 246, 0.3)' : '0 0 30px rgba(88, 101, 242, 0.4)')
              : (isLight ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none')
          }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center rounded-2xl"
        >
          <Search className={`absolute left-4 w-4 h-4 ${isSearching ? 'text-blue-500 scale-110' : 'text-slate-400'} transition-all duration-300 pointer-events-none`} />
          <motion.input
            type="text"
            placeholder="Search global stocks, symbols, news (e.g. AAPL, Maybank)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(true);
            }}
            onFocus={() => setIsSearching(true)}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`w-full ${
              isLight
                ? 'bg-white border-white text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 shadow-md shadow-slate-200/50'
                : 'bg-stox-dark border-stox-border text-slate-100 placeholder-slate-500 focus:border-[#5865F2] focus:ring-[#5865F2]/20 shadow-inner'
            } border rounded-2xl pl-11 pr-11 py-3 text-xs focus:outline-none focus:ring-2 transition-all`}
          />
          {isLoadingSearch && (
            <Loader2 className={`absolute right-4 w-4 h-4 ${isLight ? 'text-blue-500' : 'text-[#5865F2]'} animate-spin`} />
          )}
          {searchQuery && !isLoadingSearch && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </motion.div>

        {/* Autocomplete Dropdown */}
        {isSearching && searchQuery.trim() !== '' && (
          <div className={`absolute top-full left-0 right-0 mt-2 ${isLight ? 'bg-white border-slate-200 shadow-2xl text-slate-900' : 'bg-stox-card border-stox-border shadow-2xl text-slate-100'} border rounded-2xl overflow-hidden z-50 backdrop-blur-xl`}>
            <div className={`p-2.5 text-[11px] font-semibold ${isLight ? 'bg-slate-50 text-slate-500 border-slate-100' : 'text-slate-500 border-stox-border'} uppercase tracking-wider px-4 border-b flex items-center justify-between`}>
              <span>Matching Instruments ({searchResults.length})</span>
            </div>
            <div className={`max-h-80 overflow-y-auto divide-y ${isLight ? 'divide-slate-100' : 'divide-stox-border/50'}`}>
              {searchResults.length > 0 ? (
                searchResults.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => {
                      onSelectStock(stock);
                      setIsSearching(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between transition-colors text-left group ${isLight ? 'hover:bg-slate-50' : 'hover:bg-stox-cardHover'}`}
                  >
                    <div className="flex items-center gap-3">
                      <StockLogo symbol={stock.symbol} className="w-10 h-10 shadow-sm" theme={theme} />
                      <div>
                        <div className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-slate-200'} group-hover:text-blue-500 transition-colors`}>{stock.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{stock.symbol} • {stock.sector}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${stock.price.toFixed(2)}</div>
                      <div className={`text-[11px] font-mono font-semibold flex items-center gap-0.5 justify-end ${stock.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  No matching instruments found for "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* Right Actions: API Key, Market Status, Snapshot, Theme Toggle, Profile Menu */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenApiKeyModal}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono transition-all shadow-sm ${
            hasApiKey
              ? (isLight ? 'bg-white border-white text-emerald-600 hover:bg-slate-50 shadow-slate-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20')
              : (isLight ? 'bg-white border-white text-blue-600 hover:bg-slate-50 shadow-slate-200' : 'bg-[#5865F2]/10 border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/20 animate-pulse')
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          {hasApiKey ? 'AV API Connected' : 'Connect AV API'}
        </button>

        {(() => {
          const marketStatus = getMarketStatus();
          return (
            <div
              className={`hidden lg:flex items-center gap-2 px-3 py-2 ${
                marketStatus.isOpen
                  ? (isLight ? 'bg-white border-white shadow-sm shadow-slate-200/50 text-emerald-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')
                  : (isLight ? 'bg-white border-white shadow-sm shadow-slate-200/50 text-rose-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-400')
              } rounded-xl text-xs font-mono`}
              title={`US Trading Hours: 9:30 AM – 4:00 PM ET\nMalaysia Time (MYT): ${marketStatus.mytHours} (${marketStatus.isEDT ? 'EDT UTC-4' : 'EST UTC-5'})`}
            >
              <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
              {marketStatus.statusText}
            </div>
          );
        })()}

        {/* Page Description & Snapshot Camera Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={onOpenSnapshotModal}
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isLight
              ? 'bg-white border-white text-blue-600 hover:bg-slate-50 shadow-slate-200/80'
              : 'bg-stox-dark border-stox-border text-blue-400 hover:bg-stox-cardHover shadow-inner'
          }`}
          title="View Page Description & Take Snapshot 📸"
        >
          <Camera className="w-4 h-4" />
        </motion.button>

        {/* Single Icon Dark / Light Mode Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={(e) => onToggleTheme ? onToggleTheme(e) : setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
            isLight
              ? 'bg-white border-white text-amber-500 hover:bg-slate-50 shadow-slate-200/80'
              : 'bg-stox-dark border-stox-border text-blue-400 hover:bg-stox-cardHover shadow-inner'
          }`}
          title={theme === 'dark' ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </motion.button>

        {/* Profile Dropdown Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center gap-2.5 pl-3 border-l ${isLight ? 'border-slate-200' : 'border-stox-border'} group text-left focus:outline-none cursor-pointer`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
              {user ? (user.email?.[0]?.toUpperCase() || 'U') : <User className="w-4 h-4" />}
            </div>
            <div className="hidden xl:block text-left">
              <div className={`text-xs font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'} group-hover:text-blue-500 transition-colors truncate max-w-[100px]`}>
                {user ? (user.user_metadata?.userid || user.email) : 'Account'}
              </div>
              <div className="text-[10px] text-blue-500 font-mono flex items-center gap-0.5">
                <span>{user ? 'Pro' : 'Guest'}</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {isProfileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute right-0 mt-3 w-56 rounded-2xl border shadow-2xl py-2 z-50 backdrop-blur-xl ${
                  isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#111827] border-slate-800 text-slate-100'
                }`}
              >
                <div className={`px-4 py-3 border-b ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800/80 bg-slate-900/50'}`}>
                  <div className="text-xs font-bold truncate">{user?.user_metadata?.userid || user?.email || 'Guest Trader'}</div>
                  <div className="text-[10px] font-mono text-blue-500">{user?.email || 'guest@stox.com'}</div>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenAccountModal();
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    <span>Account Info</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenApiKeyModal();
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <Sliders className="w-4 h-4 text-emerald-500" />
                    <span>Settings &amp; API</span>
                  </button>

                  <button
                    onClick={(e) => {
                      setIsProfileMenuOpen(false);
                      onToggleTheme(e);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                      isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                    <span>Toggle Theme ({theme === 'dark' ? 'Light' : 'Dark'})</span>
                  </button>
                </div>

                <div className={`pt-1.5 mt-1 border-t ${isLight ? 'border-slate-100' : 'border-slate-800'}`}>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
