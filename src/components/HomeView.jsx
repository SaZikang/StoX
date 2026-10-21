import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkles, Flame, ShieldAlert, Activity, Search, Bookmark, ChevronRight } from 'lucide-react';
import { MARKET_INDICES, STOCKS_DATA, FINANCIAL_NEWS } from '../data/stocks';

export function HomeView({ onSelectStock, watchlist, toggleWatchlist }) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const topGainer = STOCKS_DATA.filter(s => s.category === 'gainer').sort((a, b) => b.changePercent - a.changePercent)[0];
  const topLoser = STOCKS_DATA.filter(s => s.category === 'loser').sort((a, b) => a.changePercent - b.changePercent)[0];
  const highGrowthStocks = STOCKS_DATA.filter(s => s.highGrowth);

  const filteredStocks = selectedFilter === 'all'
    ? STOCKS_DATA
    : STOCKS_DATA.filter(s => s.category === selectedFilter || (selectedFilter === 'growth' && s.highGrowth));

  return (
    <div className="space-y-8 pb-16">

      {/* Market Indices Ticker Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {MARKET_INDICES.map((idx) => (
          <div key={idx.symbol} className="bg-stox-card border border-stox-border rounded-xl p-4 hover:border-stox-borderLight transition-all">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
              <span>{idx.name}</span>
              <span className="font-mono text-[11px] text-slate-500">{idx.symbol}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-mono font-bold text-slate-100">${idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <div className={`flex items-center gap-0.5 text-xs font-mono font-semibold ${idx.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {idx.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {idx.positive ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Gainer & Loser Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Top Gainer */}
        {topGainer && (
          <div
            onClick={() => onSelectStock(topGainer)}
            className="bg-gradient-to-br from-emerald-950/20 via-stox-card to-stox-card border border-emerald-500/30 rounded-2xl p-6 cursor-pointer hover:border-emerald-500/60 transition-all group relative overflow-hidden shadow-lg"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Top Gainer Today
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">{topGainer.sector}</div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                  {topGainer.name} <span className="font-mono text-sm text-slate-400">({topGainer.symbol})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{topGainer.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(topGainer.symbol);
                }}
                className={`p-2 rounded-xl border transition-colors ${watchlist.includes(topGainer.symbol) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-stox-card border-stox-border text-slate-400 hover:text-white'}`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-xs text-slate-500">Current Price</div>
                <div className="text-2xl font-mono font-extrabold text-slate-100">${topGainer.price.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Daily Return</div>
                <div className="text-xl font-mono font-extrabold text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-5 h-5" />
                  +{topGainer.changePercent.toFixed(2)}% (+${topGainer.change.toFixed(2)})
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Loser */}
        {topLoser && (
          <div
            onClick={() => onSelectStock(topLoser)}
            className="bg-gradient-to-br from-rose-950/20 via-stox-card to-stox-card border border-rose-500/30 rounded-2xl p-6 cursor-pointer hover:border-rose-500/60 transition-all group relative overflow-hidden shadow-lg"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Top Loser Today
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400">{topLoser.sector}</div>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-100 group-hover:text-rose-400 transition-colors flex items-center gap-2">
                  {topLoser.name} <span className="font-mono text-sm text-slate-400">({topLoser.symbol})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{topLoser.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(topLoser.symbol);
                }}
                className={`p-2 rounded-xl border transition-colors ${watchlist.includes(topLoser.symbol) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-stox-card border-stox-border text-slate-400 hover:text-white'}`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-xs text-slate-500">Current Price</div>
                <div className="text-2xl font-mono font-extrabold text-slate-100">${topLoser.price.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Daily Return</div>
                <div className="text-xl font-mono font-extrabold text-rose-400 flex items-center gap-1">
                  <ArrowDownRight className="w-5 h-5" />
                  {topLoser.changePercent.toFixed(2)}% (${topLoser.change.toFixed(2)})
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* High Growth Stocks Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" /> High-Growth Market Instruments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Top-performing large cap and high-growth innovation equities</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-stox-card p-1 rounded-xl border border-stox-border">
            {['all', 'gainer', 'loser', 'growth'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Stocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className="bg-stox-card border border-stox-border rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-xs text-blue-400 group-hover:border-blue-500 transition-colors">
                      {stock.symbol}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">{stock.name}</div>
                      <div className="text-[11px] text-slate-500">{stock.sector}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(stock.symbol);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${watchlist.includes(stock.symbol) ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stox-border/60 flex items-end justify-between">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Price</div>
                  <div className="text-lg font-mono font-bold text-slate-100">${stock.price.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-500">Growth</div>
                  <div className={`text-sm font-mono font-bold flex items-center gap-0.5 justify-end ${stock.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stock.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial News Section (Scrolled) */}
      <div className="space-y-4 pt-6 border-t border-stox-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Market Intelligence & Breaking News
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time financial journalism and macroeconomic insights</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FINANCIAL_NEWS.map((news) => (
            <div key={news.id} className="bg-stox-card border border-stox-border rounded-2xl p-5 hover:border-stox-borderLight transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-stox-dark border border-stox-border text-blue-400 font-medium">{news.category}</span>
                  <span className="font-mono">{news.time} • {news.source}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer mb-2">
                  {news.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2">{news.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stox-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Related:</span>
                  {news.related.map(sym => (
                    <span key={sym} className="px-2 py-0.5 rounded bg-stox-dark border border-stox-border font-mono text-[10px] text-slate-300">
                      {sym}
                    </span>
                  ))}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${news.impact === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {news.impact.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
