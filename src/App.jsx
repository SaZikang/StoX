import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { StockDetailView } from './components/StockDetailView';
import { WatchlistView } from './components/WatchlistView';
import { NewsView } from './components/NewsView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { TrendingUp, ShieldCheck, Key } from 'lucide-react';
import { STOCKS_DATA, FINANCIAL_NEWS } from './data/stocks';
import { fetchFinnhubQuote, fetchFinnhubNews } from './services/finnhub';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState(['NVDA', 'AAPL', 'MSFT', 'PLTR']);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('stox_finnhub_key') || '');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [stocks, setStocks] = useState(STOCKS_DATA);
  const [news, setNews] = useState(FINANCIAL_NEWS);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // Poll live data from Finnhub when API key is active
  useEffect(() => {
    if (!apiKey) {
      setIsLiveActive(false);
      return;
    }

    async function updateLiveMarketData() {
      try {
        // Fetch live quotes for stocks
        const updatedStocks = await Promise.all(
          stocks.map(async (stock) => {
            const q = await fetchFinnhubQuote(stock.symbol, apiKey);
            if (q) {
              return {
                ...stock,
                price: q.price,
                change: q.change,
                changePercent: q.changePercent,
                positive: q.positive,
                high52: Math.max(stock.high52, q.price),
                low52: Math.min(stock.low52, q.price)
              };
            }
            return stock;
          })
        );
        setStocks(updatedStocks);

        // Update selected stock if active
        if (selectedStock) {
          const freshSelected = updatedStocks.find(s => s.symbol === selectedStock.symbol);
          if (freshSelected) {
            setSelectedStock(freshSelected);
          }
        }

        // Fetch live news
        const liveNews = await fetchFinnhubNews(apiKey);
        if (liveNews && liveNews.length > 0) {
          setNews(liveNews);
        }

        setIsLiveActive(true);
      } catch (err) {
        console.error('Error updating live Finnhub market data:', err);
      }
    }

    updateLiveMarketData();
    const interval = setInterval(updateLiveMarketData, 8000); // Poll every 8s
    return () => clearInterval(interval);
  }, [apiKey]);

  const toggleWatchlist = (symbol) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="min-h-screen bg-stox-dark text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedStock(null);
        }}
        onSelectStock={handleSelectStock}
        watchlist={watchlist}
        setWatchlist={setWatchlist}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        stocks={stocks}
        apiKey={apiKey}
      />

      {/* Live Data Banner / Notice if no API key */}
      {!apiKey && (
        <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 border-b border-blue-500/20 py-2.5 px-4 text-center text-xs text-slate-300 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>Running on baseline sample data. Connect your free Finnhub API key to unlock <strong>real-time live market prices</strong> that constantly change.</span>
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="underline font-semibold text-blue-400 hover:text-blue-300 ml-1"
          >
            Connect API Key
          </button>
        </div>
      )}

      {isLiveActive && apiKey && (
        <div className="bg-emerald-950/30 border-b border-emerald-500/20 py-1.5 px-4 text-center text-[11px] font-mono text-emerald-400 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Finnhub Live API Feed Active: Prices updating in real-time.
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {selectedStock ? (
          <StockDetailView
            stock={selectedStock}
            onBack={() => setSelectedStock(null)}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                stocks={stocks}
                newsList={news}
                onSelectStock={handleSelectStock}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            )}
            {activeTab === 'watchlist' && (
              <WatchlistView
                stocks={stocks}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onSelectStock={handleSelectStock}
              />
            )}
            {activeTab === 'news' && (
              <NewsView newsList={news} onSelectStock={handleSelectStock} />
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

      {/* Footer */}
      <footer className="border-t border-stox-border bg-stox-card/40 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-300">StoX Financial Terminal</span>
            <span>— Advanced Markets & Analytics</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> Finnhub API Integration
            </span>
            <span>© 2026 StoX Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
