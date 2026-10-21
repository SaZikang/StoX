import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Bookmark, ArrowLeft, Sliders, Edit3, TrendingUp, Activity, ShieldCheck, DollarSign, RefreshCw, BarChart2, Check, X } from 'lucide-react';

export function StockDetailView({ stock, onBack, watchlist, toggleWatchlist }) {
  const [timeframe, setTimeframe] = useState('1D');
  const [activeIndicators, setActiveIndicators] = useState({
    sma20: true,
    sma50: false,
    rsi: false,
    macd: false
  });
  const [activeDrawingTool, setActiveDrawingTool] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [sharesAmount, setSharesAmount] = useState(10);
  const [tradeSuccess, setTradeSuccess] = useState(false);

  const priceHistory = stock.history[timeframe] || stock.history['1D'] || [stock.price];
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  const priceRange = maxPrice - minPrice || 1;

  // Generate SVG path for chart
  const svgWidth = 800;
  const svgHeight = 280;
  const padding = 40;

  const points = priceHistory.map((val, idx) => {
    const x = padding + (idx / (priceHistory.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((val - minPrice) / priceRange) * (svgHeight - padding * 2);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');

  const toggleIndicator = (ind) => {
    setActiveIndicators(prev => ({ ...prev, [ind]: !prev[ind] }));
  };

  const handleExecuteTrade = (e) => {
    e.preventDefault();
    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      setIsTradingModalOpen(false);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">

      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stox-card border border-stox-border text-slate-300 hover:text-white hover:bg-stox-cardHover transition-colors text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Markets
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleWatchlist(stock.symbol)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              watchlist.includes(stock.symbol)
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-stox-card border-stox-border text-slate-300 hover:bg-stox-cardHover'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            {watchlist.includes(stock.symbol) ? 'Saved in Watchlist' : 'Add to Watchlist'}
          </button>

          <button
            onClick={() => setIsTradingModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all"
          >
            <DollarSign className="w-3.5 h-3.5" /> Trade {stock.symbol}
          </button>
        </div>
      </div>

      {/* Stock Header Banner */}
      <div className="bg-stox-card border border-stox-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-lg text-blue-400 shadow-inner">
              {stock.symbol}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-100">{stock.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-stox-dark border border-stox-border text-xs font-mono text-slate-400">
                  {stock.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">{stock.description}</p>
            </div>
          </div>

          <div className="text-right bg-stox-dark/50 border border-stox-border/60 rounded-xl p-4">
            <div className="text-xs uppercase font-semibold text-slate-500">Live Market Price</div>
            <div className="text-3xl font-mono font-extrabold text-slate-100 mt-0.5">${stock.price.toFixed(2)}</div>
            <div className={`text-sm font-mono font-bold flex items-center gap-1 justify-end mt-1 ${stock.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stock.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}% (+${stock.change.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-stox-border">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Market Cap</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{stock.marketCap}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">P/E Ratio</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{stock.peRatio}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">52W High</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">${stock.high52}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">52W Low</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">${stock.low52}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Volume</div>
            <div className="text-sm font-mono font-bold text-slate-200 mt-0.5">{stock.volume}</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Day Range</div>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">${(stock.price * 0.98).toFixed(2)} - ${(stock.price * 1.02).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Advanced Chart & Toolbar Section */}
      <div className="bg-stox-card border border-stox-border rounded-2xl p-6 shadow-xl space-y-4">

        {/* Toolbar: Timeframes, Indicators, Drawing Tools */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stox-border">

          {/* Timeframes */}
          <div className="flex items-center gap-1.5 bg-stox-dark p-1 rounded-xl border border-stox-border">
            {['1H', '1D', '1W', '1M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-stox-cardHover'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Technical Indicators Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-blue-500" /> Indicators:
            </span>
            {Object.keys(activeIndicators).map((ind) => (
              <button
                key={ind}
                onClick={() => toggleIndicator(ind)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition-all border ${
                  activeIndicators[ind]
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                    : 'bg-stox-dark border-stox-border text-slate-500 hover:text-slate-300'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

          {/* Drawing Tools */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Edit3 className="w-3.5 h-3.5 text-indigo-500" /> Tools:
            </span>
            {['Trendline', 'H-Line', 'Fib'].map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveDrawingTool(activeDrawingTool === tool ? null : tool)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  activeDrawingTool === tool
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-stox-dark border-stox-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {tool}
              </button>
            ))}
            {activeDrawingTool && (
              <button
                onClick={() => setActiveDrawingTool(null)}
                className="text-xs text-rose-400 hover:text-rose-300 px-1.5"
                title="Clear Tool"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Chart Canvas / SVG Container */}
        <div className="relative w-full h-[320px] bg-stox-dark/60 rounded-xl border border-stox-border p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>High: ${maxPrice.toFixed(2)}</span>
            <span className="text-blue-400 font-semibold">Interactive Price Chart ({timeframe}) {activeDrawingTool ? `• [Tool Active: ${activeDrawingTool}]` : ''}</span>
            <span>Low: ${minPrice.toFixed(2)}</span>
          </div>

          <div className="relative flex-1 w-full flex items-center justify-center">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stock.positive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={stock.positive ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                <line
                  key={i}
                  x1={padding}
                  y1={padding + ratio * (svgHeight - padding * 2)}
                  x2={svgWidth - padding}
                  y2={padding + ratio * (svgHeight - padding * 2)}
                  stroke="#222632"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Area fill */}
              <path
                d={`${pathD} L ${svgWidth - padding} ${svgHeight - padding} L ${padding} ${svgHeight - padding} Z`}
                fill="url(#chartGradient)"
              />

              {/* Main Price Line */}
              <path
                d={pathD}
                fill="none"
                stroke={stock.positive ? '#10b981' : '#ef4444'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className="fill-stox-dark stroke-2 transition-all hover:r-6 cursor-pointer"
                  style={{ stroke: stock.positive ? '#10b981' : '#ef4444' }}
                >
                  <title>${pt.val.toFixed(2)}</title>
                </circle>
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-stox-border/50">
            <span>Time: Live Session</span>
            <span>Volume Indicator: Active</span>
            <span>Source: StoX High-Frequency Feed</span>
          </div>
        </div>

      </div>

      {/* Stock News Section when scrolled */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" /> News & Filings regarding {stock.symbol}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stock.news.map((item) => (
            <div key={item.id} className="bg-stox-card border border-stox-border rounded-2xl p-5 hover:border-stox-borderLight transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono text-blue-400">{item.source}</span>
                  <span className="font-mono">{item.time}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer">
                  {item.title}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-stox-border flex items-center justify-between text-xs">
                <span className="text-slate-500">Sentiment</span>
                <span className={`font-semibold px-2 py-0.5 rounded ${item.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-400' : item.sentiment === 'bearish' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                  {item.sentiment.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Simulation Modal */}
      {isTradingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stox-card border border-stox-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6 relative animate-scaleUp">
            <button
              onClick={() => setIsTradingModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-slate-100">Simulate Order: {stock.symbol}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Execute instant paper trade at current market price (${stock.price.toFixed(2)})</p>
            </div>

            {tradeSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="text-base font-bold text-emerald-400">Order Executed Successfully!</div>
                <p className="text-xs text-slate-400">Successfully bought/sold {sharesAmount} shares of {stock.symbol}.</p>
              </div>
            ) : (
              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 p-1 bg-stox-dark rounded-xl border border-stox-border">
                  <button
                    type="button"
                    onClick={() => setTradeType('buy')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${tradeType === 'buy' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('sell')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${tradeType === 'sell' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                  >
                    SELL
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">Number of Shares</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={sharesAmount}
                    onChange={(e) => setSharesAmount(parseInt(e.target.value) || 1)}
                    className="w-full bg-stox-dark border border-stox-border rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="bg-stox-dark p-4 rounded-xl border border-stox-border space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Execution Price:</span>
                    <span className="text-slate-200">${stock.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Total:</span>
                    <span className="text-slate-200 font-bold">${(stock.price * sharesAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${tradeType === 'buy' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'}`}
                >
                  Confirm {tradeType.toUpperCase()} Order
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
