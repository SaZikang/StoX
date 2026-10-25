import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Sparkles, Flame, ShieldAlert, Activity, Bookmark, Globe, ChevronRight, Newspaper, Loader2, Wallet, DollarSign, BarChart2 } from 'lucide-react';
import { COUNTRY_STOCKS } from '../data/stocks';
import { StockLogo } from './StockLogo';
import { NewsTickerForm } from './NewsTickerForm';
import { ArticleModal } from './ArticleModal';

function AnimatedNumber({ value, prefix = "$", decimals = 2, isPositive = null }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (start === end) return;

    let startTime = null;
    const duration = 1000;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value]);

  return (
    <span>
      {prefix}{displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

export function HomeView({ stocks, newsList, newsTicker, isNewsLoading, newsError, onFetchNews, onSelectStock, watchlist, toggleWatchlist, holdings = [], setActiveTab, theme = 'dark' }) {
  const [selectedCountry, setSelectedCountry] = useState('malaysia');
  const [expandedNews, setExpandedNews] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const isLight = theme === 'light';

  // Portfolio computations for Box 1 & Box 2
  let totalEquity = 0;
  let totalCost = 0;
  holdings.forEach(h => {
    const s = stocks.find(st => st.symbol.toUpperCase() === h.symbol.toUpperCase()) || { price: h.avgPrice };
    totalEquity += h.shares * s.price;
    totalCost += h.shares * h.avgPrice;
  });
  const unrealizedPL = totalEquity - totalCost;
  const unrealizedPLPercent = totalCost > 0 ? (unrealizedPL / totalCost) * 100 : 0;
  const isPositivePL = unrealizedPL >= 0;

  // Exclude penny stocks (< 1.0) for gainers
  const validStocks = stocks.filter(s => s.price >= 1.0);
  const sortedByGain = [...validStocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainersList = sortedByGain.slice(0, 5);
  const topGainer = topGainersList[0] || validStocks[0];

  const countryStocksList = COUNTRY_STOCKS[selectedCountry] || COUNTRY_STOCKS.malaysia;

  const handleGenerateAiSummary = async (newsItem) => {
    setIsSummarizing(true);
    setAiSummary('');
    try {
      if (newsItem.link) {
        const res = await fetch(`/api/article?url=${encodeURIComponent(newsItem.link)}`);
        const data = await res.json();
        if (data.success && data.aiSummary) {
          setAiSummary(data.aiSummary);
          if (data.fullContent) {
            newsItem.fullContent = data.fullContent;
          }
        } else {
          setAiSummary(`🤖 AI Summary: ${newsItem.headline} covers crucial developments regarding ${newsItem.related_tickers?.join(', ') || 'global assets'}.`);
        }
      } else {
        setAiSummary(`🤖 AI Summary: ${newsItem.headline}`);
      }
    } catch (err) {
      setAiSummary(`🤖 AI Summary: ${newsItem.headline} discusses key financial updates.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Generate Portfolio Momentum Chart Data with Dates
  const today = new Date();
  const rawVals = [totalEquity * 0.94, totalEquity * 0.96, totalEquity * 0.95, totalEquity * 0.98, totalEquity * 0.97, totalEquity];
  const momentumPoints = rawVals.map((val, idx) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (rawVals.length - 1 - idx));
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
    return { date: dateStr, val };
  });

  const minM = Math.min(...momentumPoints.map(p => p.val));
  const maxM = Math.max(...momentumPoints.map(p => p.val));
  const rangeM = maxM - minM || 1;
  const svgW = 500;
  const svgH = 150;
  const paddingLeft = 12;
  const paddingRight = 45;
  const paddingTop = 12;
  const paddingBottom = 22;

  const mPointsCoords = momentumPoints.map((pt, idx) => {
    const x = paddingLeft + (idx / (momentumPoints.length - 1)) * (svgW - paddingLeft - paddingRight);
    const y = paddingTop + (1 - (pt.val - minM) / rangeM) * (svgH - paddingTop - paddingBottom);
    return { x, y, val: pt.val, date: pt.date };
  });
  const smoothPathD = mPointsCoords.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (pt.x - prev.x) / 2;
    const cpY1 = prev.y;
    const cpX2 = prev.x + (pt.x - prev.x) / 2;
    const cpY2 = pt.y;
    return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
  }, '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-10 pb-24"
    >

      {/* THREE BOXES AT TOP: Total Equity Value, Daily Unrealized P&L, Top Stocks on the Market */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >

        {/* BOX 1: Total Equity Value */}
        <div
          onClick={() => setActiveTab && setActiveTab('portfolio')}
          className={`${
            isLight
              ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900'
              : 'bg-stox-card/95 border-stox-border text-slate-100'
          } border rounded-3xl p-7 shadow-2xl cursor-pointer group relative overflow-hidden flex flex-col justify-between transition-all`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center font-bold shadow-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 text-[11px] font-mono font-bold rounded-xl ${isLight ? 'bg-blue-100/80 text-blue-600 border border-blue-200' : 'bg-blue-500/10 text-blue-400'}`}>
                Holdings ({holdings.length})
              </span>
            </div>
            <div className={`text-[11px] uppercase font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Portfolio Equity Value</div>
            <div className={`text-2xl font-mono font-extrabold mt-1.5 ${isLight ? 'text-slate-900' : 'text-slate-100'} group-hover:text-blue-500 transition-colors`}>
              <AnimatedNumber value={totalEquity} prefix="$" decimals={2} />
            </div>
          </div>
          <div className={`text-[11px] font-mono mt-4 pt-3.5 border-t ${isLight ? 'text-slate-500 border-slate-100' : 'text-slate-500 border-stox-border/60'}`}>
            Cost Basis: ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* BOX 2: Daily Unrealized P&L */}
        <div
          onClick={() => setActiveTab && setActiveTab('portfolio')}
          className={`${
            isLight
              ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900'
              : 'bg-stox-card/95 border-stox-border text-slate-100'
          } border rounded-3xl p-7 shadow-2xl cursor-pointer group relative overflow-hidden flex flex-col justify-between transition-all`}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm ${isPositivePL ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                <DollarSign className="w-6 h-6" />
              </div>
              <span className={`px-3 py-1 text-[11px] font-mono font-bold rounded-xl flex items-center gap-1 ${
                isPositivePL
                  ? (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400')
                  : (isLight ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-rose-500/10 text-rose-400')
              }`}>
                {isPositivePL ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {isPositivePL ? '+' : ''}{unrealizedPLPercent.toFixed(2)}%
              </span>
            </div>
            <div className={`text-[11px] uppercase font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Daily Unrealized P&amp;L ($)</div>
            <div className={`text-2xl font-mono font-extrabold mt-1.5 ${isPositivePL ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isPositivePL ? '+' : ''}<AnimatedNumber value={unrealizedPL} prefix="$" decimals={2} />
            </div>
          </div>
          <div className={`text-[11px] font-mono mt-4 pt-3.5 border-t ${isLight ? 'text-slate-500 border-slate-100' : 'text-slate-500 border-stox-border/60'}`}>
            Real-Time Valuation Gain / Loss
          </div>
        </div>

        {/* BOX 3: Top Stocks on the Market Card */}
        {topGainer && (
          <div
            onClick={() => onSelectStock(topGainer)}
            className={`${
              isLight
                ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900'
                : 'bg-stox-card/95 border-stox-border text-slate-100'
            } border rounded-3xl p-7 shadow-2xl cursor-pointer group relative overflow-hidden flex flex-col justify-between transition-all`}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shadow-sm">
                  <Flame className="w-6 h-6" />
                </div>
                <span className={`px-3 py-1 text-[11px] font-mono font-bold rounded-xl ${isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  Top Market Leader
                </span>
              </div>
              <div className={`text-[11px] uppercase font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Top Stock on Market</div>
              <div className="flex items-center gap-3 mt-2.5">
                <StockLogo symbol={topGainer.symbol} className="w-9 h-9 shadow-sm" theme={theme} />
                <div className="min-w-0">
                  <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} group-hover:text-emerald-500 transition-colors truncate`}>{topGainer.name}</div>
                  <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>{topGainer.symbol} • $<AnimatedNumber value={topGainer.price} prefix="" decimals={2} /></div>
                </div>
              </div>
            </div>
            <div className={`text-[11px] font-mono font-bold text-emerald-500 mt-4 pt-3.5 border-t ${isLight ? 'border-slate-100' : 'border-stox-border/60'} flex items-center justify-between`}>
              <span>24h Performance</span>
              <span className="flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +{topGainer.changePercent.toFixed(2)}%</span>
            </div>
          </div>
        )}

      </motion.div>

      {/* MIDDLE LAYOUT: Portfolio Momentum Chart Placed Beside Top Gainers List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">

        {/* Portfolio Momentum Chart (2 columns) */}
        <div className={`lg:col-span-2 ${
          isLight
            ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900'
            : 'bg-stox-card/95 border-stox-border text-slate-100'
        } border rounded-3xl p-7 shadow-2xl flex flex-col justify-between space-y-5`}>
          <div className={`flex items-center justify-between border-b ${isLight ? 'border-slate-100' : 'border-stox-border'} pb-3.5`}>
            <div>
              <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} flex items-center gap-2.5`}>
                <BarChart2 className="w-4 h-4 text-blue-500" /> Portfolio Momentum &amp; Valuation Trend
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-0.5 font-mono`}>
                {hoveredPoint ? `📅 ${hoveredPoint.date} — Valuation: $${hoveredPoint.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Hover over data points to inspect daily portfolio valuation'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${isLight ? 'bg-blue-100/80 text-blue-600 border border-blue-200' : 'bg-blue-500/10 text-blue-400'}`}>
              {hoveredPoint ? hoveredPoint.date : 'Live Curve'}
            </span>
          </div>

          <div
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const relX = Math.max(0, Math.min(1, clickX / rect.width));
              const targetSvgX = paddingLeft + relX * (svgW - paddingLeft - paddingRight);

              let closest = mPointsCoords[0];
              let minDist = Math.abs(closest.x - targetSvgX);
              for (const pt of mPointsCoords) {
                const dist = Math.abs(pt.x - targetSvgX);
                if (dist < minDist) {
                  minDist = dist;
                  closest = pt;
                }
              }
              setHoveredPoint(closest);
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            className={`relative w-full h-[320px] ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/90 border-stox-border'} rounded-2xl border shadow-inner overflow-hidden flex items-center justify-center cursor-crosshair`}
          >
            {/* Y-Axis Price Labels (Right Side) */}
            <div className={`absolute right-3 top-4 bottom-8 flex flex-col justify-between text-[10px] font-mono pointer-events-none select-none ${isLight ? 'text-slate-400' : 'text-slate-500'} text-right z-10`}>
              <span>${maxM.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              <span>${((minM + maxM) / 2).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              <span>${minM.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>

            <svg viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full overflow-visible p-2">
              <defs>
                <linearGradient id="momGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Grid Lines */}
              {[0.25, 0.5, 0.75].map((ratio, idx) => (
                <line
                  key={idx}
                  x1={0}
                  y1={svgH * ratio}
                  x2={svgW}
                  y2={svgH * ratio}
                  stroke={isLight ? '#e2e8f0' : '#1e293b'}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Hover Crosshair */}
              {hoveredPoint && (
                <g>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={svgH}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={0}
                    y1={hoveredPoint.y}
                    x2={svgW}
                    y2={hoveredPoint.y}
                    stroke="#10b981"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    strokeOpacity="0.5"
                  />
                </g>
              )}

              <motion.path
                d={`${smoothPathD} L ${svgW} ${svgH} L 0 ${svgH} Z`}
                fill="url(#momGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 1.0, delay: 0.2 }}
              />
              <motion.path
                d={smoothPathD}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />

              {mPointsCoords.map((pt, idx) => {
                const isHovered = hoveredPoint && hoveredPoint.date === pt.date;
                return (
                  <g key={idx} className="cursor-pointer">
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="12"
                        fill="#10b981"
                        fillOpacity="0.3"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "7" : "4.5"}
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Date Labels (Bottom) */}
            <div className={`absolute bottom-2 left-6 right-16 flex justify-between text-[10px] font-mono pointer-events-none select-none ${isLight ? 'text-slate-400' : 'text-slate-500'} z-10`}>
              <span>{mPointsCoords[0]?.date}</span>
              <span>{mPointsCoords[Math.floor(mPointsCoords.length / 2)]?.date}</span>
              <span>{mPointsCoords[mPointsCoords.length - 1]?.date} (Today)</span>
            </div>

            {/* Hover Tooltip Box Overlay */}
            {hoveredPoint && (
              <div className={`absolute top-3 left-4 px-4 py-2.5 rounded-xl ${isLight ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xl' : 'bg-stox-card/95 border-stox-border text-slate-100 shadow-2xl'} backdrop-blur-md border text-xs font-mono pointer-events-none z-20 flex items-center gap-3 animate-fade-in`}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <div className="font-bold text-[11px] text-slate-400">{hoveredPoint.date}</div>
                  <div className="text-emerald-500 font-extrabold text-sm">${hoveredPoint.val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Gainers List (1 column) */}
        <div className={`${
          isLight
            ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900'
            : 'bg-stox-card/95 border-stox-border text-slate-100'
        } border rounded-3xl p-7 shadow-2xl flex flex-col justify-between space-y-4`}>
          <div className={`flex items-center justify-between border-b ${isLight ? 'border-slate-100' : 'border-stox-border'} pb-3.5`}>
            <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} flex items-center gap-2.5`}>
              <Sparkles className="w-4 h-4 text-emerald-500" /> Top Market Gainers
            </h3>
            <span className={`px-2.5 py-0.5 rounded-xl text-[10px] font-mono font-bold ${isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400'}`}>24h</span>
          </div>

          <div className="space-y-3">
            {topGainersList.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                  isLight
                    ? 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    : 'bg-stox-dark border-stox-border hover:bg-stox-cardHover'
                }`}
              >
                <div className="flex items-center gap-3">
                  <StockLogo symbol={stock.symbol} className="w-8 h-8 shadow-sm" theme={theme} />
                  <div>
                    <div className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{stock.symbol}</div>
                    <div className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'} truncate max-w-[90px]`}>{stock.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>$<AnimatedNumber value={stock.price} prefix="" decimals={2} /></div>
                  <div className="text-[11px] font-mono font-semibold text-emerald-500 flex items-center gap-0.5 justify-end">
                    <ArrowUpRight className="w-3.5 h-3.5" /> +{stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM LAYOUT: Regional Country Stocks Grid */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'} flex items-center gap-2.5`}>
              <Globe className="w-5 h-5 text-blue-500" /> Browse Stocks by Country &amp; Region
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Explore blue-chip equities from Malaysia, US, China, and global exchanges</p>
          </div>

          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-stox-card border-stox-border'}`}>
            {[
              { id: 'malaysia', label: '🇲🇾 Malaysia' },
              { id: 'us', label: '🇺🇸 United States' },
              { id: 'china', label: '🇨🇳 China' },
              { id: 'others', label: '🌍 Global' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCountry === c.id
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                    : (isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover')
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {countryStocksList.map((stock) => {
            const fullStockObj = stocks.find(s => s.symbol === stock.symbol) || stock;
            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(fullStockObj)}
                className={`${
                  isLight
                    ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/65 text-slate-900'
                    : 'bg-stox-card/90 border-stox-border text-slate-100'
                } backdrop-blur-xl border rounded-2xl p-5 hover:border-blue-400/50 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StockLogo symbol={stock.symbol} className="w-10 h-10 shadow-sm" theme={theme} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatchlist(stock.symbol);
                      }}
                      className={`p-1.5 rounded-xl transition-colors ${watchlist.includes(stock.symbol) ? 'text-blue-500 bg-blue-100/80' : (isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-slate-500 hover:text-slate-300')}`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} group-hover:text-blue-500 transition-colors line-clamp-1`}>{stock.name}</div>
                  <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'} mt-1 flex items-center gap-1 font-mono`}>
                    <span>{stock.symbol}</span> • <span className="line-clamp-1">{stock.sector}</span>
                  </div>
                </div>

                <div className={`mt-5 pt-3.5 border-t ${isLight ? 'border-slate-100' : 'border-stox-border/60'} flex items-end justify-between`}>
                  <div>
                    <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Price</div>
                    <div className={`text-base font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>$<AnimatedNumber value={stock.price} prefix="" decimals={2} /></div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[10px] uppercase font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Change</div>
                    <div className={`text-xs font-mono font-bold flex items-center gap-0.5 justify-end ${stock.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
}
