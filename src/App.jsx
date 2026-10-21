import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { StockDetailView } from './components/StockDetailView';
import { WatchlistView } from './components/WatchlistView';
import { NewsView } from './components/NewsView';
import { TrendingUp, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedStock, setSelectedStock] = useState(null);
  const [watchlist, setWatchlist] = useState(['NVDA', 'AAPL', 'MSFT', 'PLTR']);

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
      />

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
                onSelectStock={handleSelectStock}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
              />
            )}
            {activeTab === 'watchlist' && (
              <WatchlistView
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onSelectStock={handleSelectStock}
              />
            )}
            {activeTab === 'news' && (
              <NewsView onSelectStock={handleSelectStock} />
            )}
          </>
        )}
      </main>

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
              <ShieldCheck className="w-3.5 h-3.5" /> SSL Secured Feed
            </span>
            <span>© 2026 StoX Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
