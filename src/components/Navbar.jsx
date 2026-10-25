import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Search, Bell, User, Bookmark, Globe, BarChart2, Newspaper, LayoutDashboard, Key, Loader2, Wallet } from 'lucide-react';
import { searchAlphaVantageSymbols } from '../services/alphavantage';
import { StockLogo } from './StockLogo';
import { getMarketStatus } from '../utils/marketHours';

export function Navbar({ activeTab, setActiveTab, onSelectStock, watchlist, setWatchlist, onOpenApiKeyModal, hasApiKey, stocks, apiKey, user, onOpenAuthModal, theme = 'dark' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const searchRef = useRef(null);

  // Local filter
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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live global search via Alpha Vantage when API key is present
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
        // Merge without duplicates
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
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              Portfolio
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
              placeholder="Search any global stock (e.g. AAPL, TSLA, MSFT)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              className="w-full bg-stox-card border border-stox-border rounded-xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
            {isLoadingSearch && (
              <Loader2 className="absolute right-3 w-4 h-4 text-blue-400 animate-spin" />
            )}
            {searchQuery && !isLoadingSearch && (
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
              <div className="p-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 border-b border-stox-border flex items-center justify-between">
                <span>Matching Global Instruments ({searchResults.length})</span>
                {!hasApiKey && <span className="text-[10px] text-blue-400">Connect Alpha Vantage API for full world search</span>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-stox-border/50">
                {searchResults.length > 0 ? (
                  searchResults.map((stock) => (
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
                        <StockLogo symbol={stock.symbol} className="w-10 h-10" theme={theme} />
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{stock.name}</div>
                          <div className="text-xs text-slate-500 font-mono">{stock.symbol} • {stock.sector}</div>
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
                    No matching instruments found for "{searchQuery}".
                    {!hasApiKey && <div className="text-xs text-blue-400 mt-1">Tip: Connect your free Alpha Vantage API key to search any international stock or symbol.</div>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Alpha Vantage API Key Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              hasApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 animate-pulse'
            }`}
            title="Configure Alpha Vantage API Key for Live Data"
          >
            <Key className="w-3.5 h-3.5" />
            {hasApiKey ? 'Alpha Vantage Connected' : 'Connect Alpha Vantage'}
          </button>

          {(() => {
            const marketStatus = getMarketStatus();
            return (
              <div
                className={`hidden lg:flex items-center gap-2 px-3 py-1.5 ${
                  marketStatus.isOpen
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                } border rounded-lg text-xs font-mono`}
                title={`US Trading Hours: 9:30 AM – 4:00 PM ET\nMalaysia Time (MYT): ${marketStatus.mytHours} (${marketStatus.isEDT ? 'EDT UTC-4' : 'EST UTC-5'})`}
              >
                <span className={`w-2 h-2 rounded-full ${marketStatus.isOpen ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
                {marketStatus.statusText}
              </div>
            );
          })()}

          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-2.5 pl-2 border-l border-stox-border group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
              {user ? (user.email?.[0]?.toUpperCase() || 'U') : <User className="w-4 h-4" />}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate max-w-[120px]">
                {user ? (user.user_metadata?.userid || user.email) : 'Sign In'}
              </div>
              <div className="text-[10px] text-blue-400 font-mono">
                {user ? 'Supabase Synced' : 'Click to Login'}
              </div>
            </div>
          </button>
        </div>

              </div>
    </header>
  );
}
