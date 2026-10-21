import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkles, Flame, ShieldAlert, Activity, Bookmark, Globe, ChevronRight, X, Sparkle, Bot } from 'lucide-react';
import { COUNTRY_STOCKS } from '../data/stocks';

export function HomeView({ stocks, newsList, onSelectStock, watchlist, toggleWatchlist }) {
  const [selectedCountry, setSelectedCountry] = useState('malaysia');
  const [expandedNews, setExpandedNews] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Exclude penny stocks (price < 1.0) from top gainers and losers
  const validStocks = stocks.filter(s => s.price >= 1.0);
  const sortedByGain = [...validStocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainersList = sortedByGain.slice(0, 5);
  const topLosersList = [...validStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  const highGrowthStocks = stocks.filter(s => s.highGrowth && s.price >= 1.0).slice(0, 6);
  const countryStocksList = COUNTRY_STOCKS[selectedCountry] || COUNTRY_STOCKS.malaysia;

  const handleGenerateAiSummary = (newsItem) => {
    setIsSummarizing(true);
    setAiSummary('');
    setTimeout(() => {
      setAiSummary(`🤖 AI Summary: ${newsItem.title} highlights a major market catalyst for ${newsItem.related ? newsItem.related.join(', ') : 'global markets'}. Key takeaway: Institutional sentiment remains ${newsItem.impact === 'positive' ? 'bullish' : 'cautious'} with immediate implications for valuation trends and liquidity flows.`);
      setIsSummarizing(false);
    }, 800);
  };

  return (
    <div className="space-y-10 pb-20">

      {/* Top Gainers & Top Losers Lists (Excluding Penny Stocks) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Gainers List */}
        <div className="bg-stox-card border border-stox-border rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stox-border">
            <h3 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" /> Top Gainers Today (Excl. Penny Stocks)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Highest % Gain</span>
          </div>
          <div className="space-y-2.5">
            {topGainersList.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className="flex items-center justify-between p-3 rounded-xl bg-stox-dark/50 border border-stox-border/60 hover:border-emerald-500/40 hover:bg-stox-cardHover transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-xs text-emerald-400 group-hover:border-emerald-500">
                    {stock.symbol}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">{stock.name}</div>
                    <div className="text-[10px] text-slate-500">{stock.sector}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-100">${stock.price.toFixed(2)}</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-0.5 justify-end">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers List */}
        <div className="bg-stox-card border border-stox-border rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-stox-border">
            <h3 className="text-sm font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Top Losers Today (Excl. Penny Stocks)
            </h3>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Deepest % Drop</span>
          </div>
          <div className="space-y-2.5">
            {topLosersList.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className="flex items-center justify-between p-3 rounded-xl bg-stox-dark/50 border border-stox-border/60 hover:border-rose-500/40 hover:bg-stox-cardHover transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-xs text-rose-400 group-hover:border-rose-500">
                    {stock.symbol}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-1">{stock.name}</div>
                    <div className="text-[10px] text-slate-500">{stock.sector}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-100">${stock.price.toFixed(2)}</div>
                  <div className="text-xs font-mono font-bold text-rose-400 flex items-center gap-0.5 justify-end">
                    <ArrowDownRight className="w-3.5 h-3.5" /> {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Country Selection for Stocks */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" /> Browse Stocks by Country & Region
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore recommended popular blue-chip and high-growth stocks from Malaysia, US, China, and international markets</p>
          </div>

          {/* Country Tabs */}
          <div className="flex items-center gap-1.5 bg-stox-card p-1 rounded-xl border border-stox-border">
            {[
              { id: 'malaysia', label: '🇲🇾 Malaysia' },
              { id: 'us', label: '🇺🇸 United States' },
              { id: 'china', label: '🇨🇳 China' },
              { id: 'others', label: '🌍 Others (Global)' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCountry === c.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Country Stocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {countryStocksList.map((stock) => {
            const fullStockObj = stocks.find(s => s.symbol === stock.symbol) || stock;
            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(fullStockObj)}
                className="bg-stox-card border border-stox-border rounded-2xl p-4 hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-400 px-2 py-0.5 rounded bg-stox-dark border border-stox-border">
                      {stock.symbol}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(stock.symbol);
                      }}
                      className={`p-1 rounded-lg transition-colors ${watchlist.includes(stock.symbol) ? 'text-blue-500 bg-blue-500/10' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-1">{stock.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{stock.sector}</div>
                </div>

                <div className="mt-4 pt-3 border-t border-stox-border/60 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-500">Price</div>
                    <div className="text-base font-mono font-bold text-slate-100">${stock.price.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-slate-500">Change</div>
                    <div className={`text-xs font-mono font-bold flex items-center gap-0.5 justify-end ${stock.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Growth Stocks Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" /> High-Growth Market Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Top recommended high-growth innovation equities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {highGrowthStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => onSelectStock(stock)}
              className="bg-stox-card border border-stox-border rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-xs text-blue-400 group-hover:border-blue-500">
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
                    {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial News Section with Images & Expandable Modal + AI Summary */}
      <div className="space-y-4 pt-6 border-t border-stox-border">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> Market Intelligence & Breaking News
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Click any news article to expand, read the full story, and generate an instant AI summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsList.map((news) => (
            <div
              key={news.id}
              onClick={() => {
                setExpandedNews(news);
                setAiSummary('');
              }}
              className="bg-stox-card border border-stox-border rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              {news.image && (
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-stox-dark/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-blue-400 border border-stox-border">
                    {news.category}
                  </div>
                </div>
              )}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-slate-500 mb-1">{news.source} • {news.time}</div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors leading-snug">
                    {news.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{news.summary}</p>
                </div>

                <div className="pt-3 border-t border-stox-border flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                    Read Full Story & AI Summary <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${news.impact === 'positive' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {news.impact.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable News Reader Modal with AI Summary */}
      {expandedNews && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stox-card border border-stox-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6 relative animate-scaleUp">
            <button
              onClick={() => {
                setExpandedNews(null);
                setAiSummary('');
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-stox-dark border border-stox-border text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {expandedNews.image && (
              <div className="h-60 w-full rounded-xl overflow-hidden relative border border-stox-border">
                <img src={expandedNews.image} alt={expandedNews.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold">{expandedNews.category}</span>
                <span>{expandedNews.source}</span>
                <span>•</span>
                <span>{expandedNews.time}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100">{expandedNews.title}</h2>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-b border-stox-border py-4">
              <p>{expandedNews.fullContent || expandedNews.summary}</p>
            </div>

            {/* AI Summary Section */}
            <div className="bg-gradient-to-br from-blue-950/30 via-stox-dark to-stox-dark border border-blue-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-blue-400" /> StoX AI News Assistant
                </span>
                {!aiSummary && (
                  <button
                    onClick={() => handleGenerateAiSummary(expandedNews)}
                    disabled={isSummarizing}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <Sparkle className="w-3.5 h-3.5" />
                    {isSummarizing ? 'Analyzing Article...' : '✨ Generate AI Summary'}
                  </button>
                )}
              </div>

              {isSummarizing && (
                <div className="text-xs text-slate-400 italic animate-pulse">
                  AI is analyzing financial context and sentiment...
                </div>
              )}

              {aiSummary && (
                <div className="text-xs text-slate-200 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3.5 leading-relaxed font-mono animate-fadeIn">
                  {aiSummary}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Related:</span>
                {expandedNews.related && expandedNews.related.map(sym => (
                  <span key={sym} className="px-2 py-0.5 rounded bg-stox-dark border border-stox-border font-mono text-xs text-blue-400">
                    {sym}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  setExpandedNews(null);
                  setAiSummary('');
                }}
                className="px-4 py-2 rounded-xl bg-stox-dark border border-stox-border text-xs font-semibold text-slate-300 hover:text-white"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
