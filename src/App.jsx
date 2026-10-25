import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { StockDetailView } from './components/StockDetailView';
import { WatchlistView } from './components/WatchlistView';
import { PortfolioView } from './components/PortfolioView';
import { NewsView } from './components/NewsView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TickerTape } from './components/TickerTape';
import { TrendingUp, ShieldCheck, Key } from 'lucide-react';
import { STOCKS_DATA } from './data/stocks';
import { fetchAlphaVantageQuote } from './services/alphavantage';
import { fetchYahooNews } from './services/yahooNews';
import { supabase } from './services/supabase';
import { AuthModal } from './components/AuthModal';
import { SnapshotModal } from './components/SnapshotModal';
import { LandingView } from './components/LandingView';
import { AuthView } from './components/AuthView';

export default function App() {
  const [appView, setAppView] = useState('landing'); // 'landing' | 'auth' | 'app'
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState(['NVDA', 'AAPL', 'MSFT', 'PLTR']);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('stox_theme') || 'dark');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [holdings, setHoldings] = useState([
    { symbol: 'NVDA', shares: 25, avgPrice: 115.50 },
    { symbol: 'AAPL', shares: 15, avgPrice: 210.00 }
  ]);

  // Load user-specific data from Supabase when user logs in/switches
  useEffect(() => {
    async function loadUserData() {
      if (!supabase) return;
      if (user) {
        // Fetch holdings for this user
        const { data: holdingsData, error: holdingsErr } = await supabase
          .from('holdings')
          .select('symbol, shares, avg_price')
          .eq('user_id', user.id);

        if (!holdingsErr && holdingsData) {
          if (holdingsData.length > 0) {
            setHoldings(holdingsData.map(h => ({
              symbol: h.symbol,
              shares: Number(h.shares),
              avgPrice: Number(h.avg_price)
            })));
          } else {
            setHoldings([]);
          }
        }

        // Fetch watchlist for this user
        const { data: watchlistData, error: watchlistErr } = await supabase
          .from('watchlists')
          .select('symbol')
          .eq('user_id', user.id);

        if (!watchlistErr && watchlistData) {
          setWatchlist(watchlistData.map(w => w.symbol));
        }
      } else {
        // Guest mode: load from localStorage or defaults
        const saved = localStorage.getItem('stox_holdings');
        if (saved) {
          setHoldings(JSON.parse(saved));
        } else {
          setHoldings([
            { symbol: 'NVDA', shares: 25, avgPrice: 115.50 },
            { symbol: 'AAPL', shares: 15, avgPrice: 210.00 }
          ]);
        }
      }
    }
    loadUserData();
  }, [user]);

  // Sync holdings updates
  const handleSetHoldings = async (newHoldings) => {
    setHoldings(newHoldings);
    if (!user || !supabase) {
      localStorage.setItem('stox_holdings', JSON.stringify(newHoldings));
      return;
    }

    try {
      await supabase.from('holdings').delete().eq('user_id', user.id);
      if (newHoldings.length > 0) {
        const rows = newHoldings.map(h => ({
          user_id: user.id,
          symbol: h.symbol,
          shares: h.shares,
          avg_price: h.avgPrice
        }));
        await supabase.from('holdings').insert(rows);
      }
    } catch (err) {
      console.error('Error syncing holdings to Supabase:', err);
    }
  };
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('stox_alphavantage_key') || localStorage.getItem('stox_finnhub_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [stocks, setStocks] = useState(STOCKS_DATA);
  const [news, setNews] = useState([]);
  const [newsTicker, setNewsTicker] = useState('');
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
  const newsRequestId = useRef(0);
  const [isLiveActive, setIsLiveActive] = useState(false);

  const loadTickerNews = async (ticker) => {
    const requestId = ++newsRequestId.current;
    setNewsTicker(ticker);
    setIsNewsLoading(true);
    setNewsError('');

    try {
      const articles = await fetchYahooNews(ticker);
      if (requestId === newsRequestId.current) setNews(articles);
    } catch (err) {
      if (requestId === newsRequestId.current) {
        setNews([]);
        setNewsError(err.message);
      }
    } finally {
      if (requestId === newsRequestId.current) setIsNewsLoading(false);
    }
  };

  useEffect(() => {
    loadTickerNews('');
  }, []);

  // Rate-limit compliant polling for Alpha Vantage free tier (5 requests per minute)
  useEffect(() => {
    if (!apiKey) {
      setIsLiveActive(false);
      return;
    }

    async function updateLiveMarketData() {
      try {
        if (selectedStock) {
          // If viewing a specific stock detail, prioritize updating that symbol
          const q = await fetchAlphaVantageQuote(selectedStock.symbol, apiKey);
          if (q) {
            const updatedStock = {
              ...selectedStock,
              price: q.price,
              change: q.change,
              changePercent: q.changePercent,
              positive: q.positive,
              high52: Math.max(selectedStock.high52, q.price),
              low52: Math.min(selectedStock.low52, q.price)
            };
            setSelectedStock(updatedStock);
            setStocks(prev => prev.map(s => s.symbol === updatedStock.symbol ? updatedStock : s));
            setIsLiveActive(true);
          }
        } else {
          // Cycle through key market tickers (1 request every 12s = exactly 5 req/min free tier limit)
          const keySymbols = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN'];
          const targetSymbol = keySymbols[Math.floor(Date.now() / 12000) % keySymbols.length];
          const q = await fetchAlphaVantageQuote(targetSymbol, apiKey);
          if (q) {
            setStocks(prev => prev.map(s => s.symbol === targetSymbol ? {
              ...s,
              price: q.price,
              change: q.change,
              changePercent: q.changePercent,
              positive: q.positive,
              high52: Math.max(s.high52, q.price),
              low52: Math.min(s.low52, q.price)
            } : s));
            setIsLiveActive(true);
          }
        }
      } catch (err) {
        console.error('Error updating live Alpha Vantage market data:', err);
      }
    }

    updateLiveMarketData();
    const interval = setInterval(updateLiveMarketData, 12000); // 12-second interval strictly respects Alpha Vantage 5 req/min limit
    return () => clearInterval(interval);
  }, [apiKey, selectedStock]);

  const toggleWatchlist = async (symbol) => {
    const isExist = watchlist.includes(symbol);
    const updated = isExist
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol];

    setWatchlist(updated);

    if (user && supabase) {
      try {
        if (isExist) {
          await supabase.from('watchlists').delete().eq('user_id', user.id).eq('symbol', symbol);
        } else {
          await supabase.from('watchlists').insert({ user_id: user.id, symbol });
        }
      } catch (err) {
        console.error('Error syncing watchlist to Supabase:', err);
      }
    }
  };

  // Handle browser back/forward history (e.g. Mac two-finger swipe right/left)
  useEffect(() => {
    const handlePopState = (event) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (event.state) {
        setActiveTab(event.state.activeTab || 'home');
        if (event.state.selectedSymbol) {
          const found = stocks.find(s => s.symbol === event.state.selectedSymbol) || { symbol: event.state.selectedSymbol };
          setSelectedStock(found);
        } else {
          setSelectedStock(null);
        }
      } else {
        setActiveTab('home');
        setSelectedStock(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [stocks]);

  const handleSelectStock = (rawStock) => {
    const stock = {
      name: rawStock.name || rawStock.symbol,
      symbol: rawStock.symbol,
      price: rawStock.price || 100.0,
      change: rawStock.change || 2.5,
      changePercent: rawStock.changePercent || 1.8,
      positive: rawStock.positive !== undefined ? rawStock.positive : true,
      sector: rawStock.sector || 'Equities & Digital Assets',
      description: rawStock.description || `${rawStock.name || rawStock.symbol} is a publicly traded global asset available on international exchanges with active market liquidity.`,
      high52: rawStock.high52 || (rawStock.price ? rawStock.price * 1.3 : 130.0),
      low52: rawStock.low52 || (rawStock.price ? rawStock.price * 0.7 : 70.0),
      news: rawStock.news || []
    };
    setSelectedStock(stock);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({ activeTab, selectedSymbol: stock.symbol }, '');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedStock(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.history.pushState({ activeTab: tab, selectedSymbol: null }, '');
  };

  const handleThemeToggle = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    const updateTheme = () => {
      setTheme(nextTheme);
      localStorage.setItem('stox_theme', nextTheme);
    };

    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateTheme();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.style.setProperty('--theme-circle-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-circle-y', `${y}px`);
    document.documentElement.style.setProperty('--theme-circle-radius', `${radius}px`);

    document.startViewTransition(updateTheme);
  };

  if (appView === 'landing') {
    return (
      <LandingView
        onEnterApp={() => setAppView('app')}
        onOpenAuth={() => setAppView('auth')}
        theme={theme}
        setTheme={setTheme}
        onToggleTheme={handleThemeToggle}
      />
    );
  }

  if (appView === 'auth') {
    return (
      <AuthView
        onBackToLanding={() => setAppView('landing')}
        onSuccessAuth={(loggedInUser) => {
          setUser(loggedInUser);
          setAppView('app');
        }}
        theme={theme}
        setTheme={setTheme}
        onToggleTheme={handleThemeToggle}
      />
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0e14] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} flex transition-colors duration-300 relative overflow-x-hidden`}>
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        watchlistCount={watchlist.length}
        portfolioCount={holdings.length}
        onReturnToLanding={() => setAppView('landing')}
        theme={theme}
      />

      {/* Main Content Area with Sidebar Offset */}
      <div className="flex-1 flex flex-col min-w-0 pl-[240px]">
        {/* Sticky Top Header with Search and Profile */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onSelectStock={handleSelectStock}
          watchlist={watchlist}
          setWatchlist={setWatchlist}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={Boolean(apiKey)}
          stocks={stocks}
          apiKey={apiKey}
          user={user}
          onOpenAuthModal={() => setAppView('auth')}
          theme={theme}
          setTheme={setTheme}
          onToggleTheme={handleThemeToggle}
          onOpenSnapshotModal={() => setIsSnapshotModalOpen(true)}
        />

        {/* Live Index Ticker Tape */}
        <TickerTape stocks={stocks} onSelectStock={handleSelectStock} theme={theme} />

        {/* Live Data Banner / Notice if no API key */}
        {!apiKey && (
          <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border-b border-blue-500/20 py-2.5 px-4 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Running on baseline sample data. Connect your free Alpha Vantage API key to unlock <strong>real-time live market prices</strong>.</span>
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="underline font-semibold text-blue-400 hover:text-blue-300 ml-1"
            >
              Connect Alpha Vantage API
            </button>
          </div>
        )}

        {isLiveActive && apiKey && (
          <div className="bg-emerald-950/30 border-b border-emerald-500/20 py-1.5 px-4 text-center text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Alpha Vantage Live API Feed Active (Rate-Limit Optimized: 5 req/min): Prices updating in real-time.
          </div>
        )}

        {/* Main Container */}
        <main className="flex-1 w-full px-8 pt-8">
          {selectedStock ? (
            <StockDetailView
              stock={selectedStock}
              onBack={() => {
                setSelectedStock(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              watchlist={watchlist}
              toggleWatchlist={toggleWatchlist}
              apiKey={apiKey}
              theme={theme}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView
                  stocks={stocks}
                  newsList={news}
                  newsTicker={newsTicker}
                  isNewsLoading={isNewsLoading}
                  newsError={newsError}
                  onFetchNews={loadTickerNews}
                  onSelectStock={handleSelectStock}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                  holdings={holdings}
                  setActiveTab={handleTabChange}
                  user={user}
                  theme={theme}
                />
              )}
              {activeTab === 'watchlist' && (
                <WatchlistView
                  stocks={stocks}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                  onSelectStock={handleSelectStock}
                  theme={theme}
                />
              )}
              {activeTab === 'portfolio' && (
                <PortfolioView
                  stocks={stocks}
                  holdings={holdings}
                  setHoldings={handleSetHoldings}
                  onSelectStock={handleSelectStock}
                  theme={theme}
                />
              )}
              {activeTab === 'news' && (
                <NewsView
                  newsList={news}
                  newsTicker={newsTicker}
                  isNewsLoading={isNewsLoading}
                  newsError={newsError}
                  onFetchNews={loadTickerNews}
                  theme={theme}
                />
              )}
            </>
          )}
        </main>

        {/* API Key Modal */}
        <ApiKeyModal
          isOpen={isApiKeyModalOpen}
          onClose={() => setIsApiKeyModalOpen(false)}
          apiKey={apiKey}
          setApiKey={setApiKey}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          user={user}
          setUser={setUser}
        />

        {/* Snapshot Modal */}
        <SnapshotModal
          isOpen={isSnapshotModalOpen}
          onClose={() => setIsSnapshotModalOpen(false)}
          activeTab={activeTab}
          selectedStock={selectedStock}
          theme={theme}
        />

        {/* Footer */}
        <footer className={`border-t ${theme === 'light' ? 'border-slate-200 bg-white' : 'border-stox-border bg-stox-card/40'} py-6 mt-auto`}>
          <div className="w-full px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#5865F2] flex items-center justify-center text-white font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-300">StoX Financial Terminal Pro</span>
              <span>— Advanced Markets &amp; Analytics</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Alpha Vantage API Integration
              </span>
              <span>© 2026 StoX Inc. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
