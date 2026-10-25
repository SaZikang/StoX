import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Bookmark, ArrowLeft, Sliders, Edit3, DollarSign, Check, X, Maximize2, Minimize2, Activity } from 'lucide-react';
import { StockLogo } from './StockLogo';
import { fetchAlphaVantageTimeSeries } from '../services/alphavantage';

export function StockDetailView({ stock, onBack, watchlist, toggleWatchlist, apiKey, theme = 'dark' }) {
  const [timeframe, setTimeframe] = useState('1D');
  const [activeIndicators, setActiveIndicators] = useState({
    sma20: true,
    sma50: false,
    rsi: false,
    macd: false
  });
  const [activeDrawingTool, setActiveDrawingTool] = useState(null); // 'Trendline', 'H-Line', 'Fibonacci', 'Box'
  const [userDrawings, setUserDrawings] = useState([]);
  const [isTradingModalOpen, setIsTradingModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [sharesAmount, setSharesAmount] = useState(10);
  const [tradeSuccess, setTradeSuccess] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liveHistory, setLiveHistory] = useState(stock?.history || null);

  // Hover state for interactive price/time tooltip
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const svgRef = useRef(null);

  // Fetch live Alpha Vantage time series if apiKey is present
  useEffect(() => {
    async function loadTimeSeries() {
      if (!apiKey || !stock?.symbol) return;
      const ts = await fetchAlphaVantageTimeSeries(stock.symbol, apiKey);
      if (ts) {
        setLiveHistory(ts);
      }
    }
    loadTimeSeries();
  }, [stock?.symbol, apiKey]);

  if (!stock) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No stock selected.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Markets
        </button>
      </div>
    );
  }

  const currentPrice = Number(stock.price) || 100.0;
  const currentChange = Number(stock.change) || 0.0;
  const currentChangePercent = Number(stock.changePercent) || 0.0;
  const isPositive = stock.positive !== undefined ? Boolean(stock.positive) : (currentChange >= 0);

  // Distinct time-series price data generator with unique non-flat variations per timeframe
  const generateChartData = (tf, currentP) => {
    const activeHist = liveHistory || stock.history;
    if (activeHist && activeHist[tf] && Array.isArray(activeHist[tf]) && activeHist[tf].length > 2) {
      const rawPrices = activeHist[tf];
      const prices = [...rawPrices];
      prices[prices.length - 1] = currentP; // Ensure final point matches live current price
      return buildPoints(prices, tf);
    }

    // Distinct timeframe-specific price generation anchored to currentPrice and changePercent
    const config = {
      '1H': { count: 12, vol: 0.0015 },
      '1D': { count: 24, vol: 0.004 },
      '1W': { count: 30, vol: 0.012 },
      '1M': { count: 30, vol: 0.03 },
      '1Y': { count: 52, vol: 0.07 }
    };
    const { count, vol } = config[tf] || config['1D'];
    const changeFactor = Number(stock.changePercent) || 1.2;
    const startP = currentP / (1 + (changeFactor / 100) * (tf === '1H' ? 0.3 : tf === '1D' ? 1.0 : tf === '1W' ? 1.8 : tf === '1M' ? 2.5 : 4.0));

    const prices = [];
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const seed = tf === '1H' ? i * 0.6 : tf === '1D' ? i * 0.4 : tf === '1W' ? i * 0.25 : i * 0.15;
      const wave = Math.sin(seed * Math.PI * 1.5) * (currentP * vol) + Math.cos(seed * 0.8) * (currentP * vol * 0.6);
      const interpolated = startP + (currentP - startP) * Math.pow(progress, 0.88);
      const p = i === count - 1 ? currentP : Math.max(interpolated + wave, currentP * 0.2);
      prices.push(p);
    }

    return buildPoints(prices, tf);
  };

  const buildPoints = (prices, tf) => {
    const now = new Date();
    return prices.map((val, idx) => {
      let timeLabel = '';
      const d = new Date(now);
      const pointsCount = prices.length;
      if (tf === '1H') {
        d.setMinutes(now.getMinutes() - (pointsCount - 1 - idx) * 5);
        timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (tf === '1D') {
        d.setMinutes(now.getMinutes() - (pointsCount - 1 - idx) * 15);
        timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (tf === '1W' || tf === '1M') {
        d.setDate(now.getDate() - (pointsCount - 1 - idx));
        timeLabel = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        d.setDate(now.getDate() - (pointsCount - 1 - idx) * 7);
        timeLabel = d.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
      }
      return { val, time: timeLabel, index: idx };
    });
  };

  const priceHistory = generateChartData(timeframe, currentPrice);
  const minPrice = Math.min(...priceHistory.map(p => p.val));
  const maxPrice = Math.max(...priceHistory.map(p => p.val));
  const priceRange = maxPrice - minPrice || 1;

  // TradingView layout dimensions
  const svgWidth = 1000;
  const svgHeight = 350;
  const marginLeft = 40;
  const marginRight = 70; // Space for price Y-axis
  const marginTop = 25;
  const marginBottom = 35; // Space for time X-axis

  const chartWidth = svgWidth - marginLeft - marginRight;
  const chartHeight = svgHeight - marginTop - marginBottom;

  const points = priceHistory.map((item, idx) => {
    const x = marginLeft + (idx / (priceHistory.length - 1 || 1)) * chartWidth;
    const y = marginTop + chartHeight - ((item.val - minPrice) / priceRange) * chartHeight;
    return { x, y, val: item.val, time: item.time };
  });

  const pathD = points.reduce((acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`), '');

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;

    let closest = points[0];
    let minDist = Infinity;
    for (const pt of points) {
      const dist = Math.abs(pt.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = pt;
      }
    }
    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const handleCanvasClick = (e) => {
    if (!activeDrawingTool || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (!rect.width) return;
    const clickX = ((e.clientX - rect.left) / rect.width) * svgWidth;
    const clickY = ((e.clientY - rect.top) / rect.height) * svgHeight;

    setUserDrawings(prev => [...prev, { tool: activeDrawingTool, x: clickX, y: clickY, id: Date.now() }]);
  };

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

  const stockNews = stock.news || [
    { id: 1, title: `${stock.name || 'Asset'} Reports Market Update`, time: '1h ago', source: 'StoX Feed', sentiment: 'bullish' }
  ];

  return (
    <div className={`space-y-6 pb-16 animate-fadeIn ${isFullscreen ? 'fixed inset-0 z-50 bg-stox-dark p-6 overflow-y-auto' : ''}`}>

      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (isFullscreen) {
              setIsFullscreen(false);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stox-card border border-stox-border text-slate-300 hover:text-white hover:bg-stox-cardHover transition-colors text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> {isFullscreen ? 'Exit Fullscreen' : 'Back to Markets'}
        </button>

        {!isFullscreen && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => stock?.symbol && toggleWatchlist(stock.symbol)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                watchlist?.includes(stock?.symbol)
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-stox-card border-stox-border text-slate-300 hover:bg-stox-cardHover'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {watchlist?.includes(stock?.symbol) ? 'Saved in Watchlist' : 'Add to Watchlist'}
            </button>

            <button
              onClick={() => setIsTradingModalOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all"
            >
              <DollarSign className="w-3.5 h-3.5" /> Trade {stock.symbol || 'Asset'}
            </button>
          </div>
        )}
      </div>

      {/* Stock Header Banner */}
      {!isFullscreen && (
        <div className="bg-stox-card border border-stox-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <StockLogo symbol={stock.symbol} className="w-16 h-16" theme={theme} />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-100">{stock.name || stock.symbol || 'Asset'}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-stox-dark border border-stox-border text-xs font-mono text-slate-400">
                    {stock.sector || 'Equities'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">{stock.description || 'Global financial market equity and asset.'}</p>
              </div>
            </div>

            <div className="text-right bg-stox-dark/50 border border-stox-border/60 rounded-xl p-4">
              <div className="text-xs uppercase font-semibold text-slate-500">Live Market Price</div>
              <div className="text-3xl font-mono font-extrabold text-slate-100 mt-0.5">${currentPrice.toFixed(2)}</div>
              <div className={`text-sm font-mono font-bold flex items-center gap-1 justify-end mt-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {isPositive ? '+' : ''}{currentChangePercent.toFixed(2)}% ({isPositive ? '+' : ''}${currentChange.toFixed(2)})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TradingView Professional Chart Workstation */}
      <div className={`bg-stox-card border border-stox-border rounded-2xl p-6 shadow-2xl space-y-4 ${isFullscreen ? 'min-h-[85vh] flex flex-col justify-between' : ''}`}>

        {/* Top Toolbar: Timeframes, Indicators, Drawing Tools */}
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

          {/* Technical Indicators */}
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
            {['Trendline', 'H-Line', 'Fibonacci', 'Box'].map((tool) => (
              <button
                key={tool}
                onClick={() => setActiveDrawingTool(activeDrawingTool === tool ? null : tool)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                  activeDrawingTool === tool
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                    : 'bg-stox-dark border-stox-border text-slate-400 hover:text-slate-200'
                }`}
              >
                {tool}
              </button>
            ))}
            {userDrawings.length > 0 && (
              <button
                onClick={() => setUserDrawings([])}
                className="text-xs text-rose-400 hover:text-rose-300 px-1 font-mono"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Chart SVG Container with Y-Axis (Prices) and X-Axis (Time) */}
        <div className="relative w-full bg-stox-dark/90 rounded-xl border border-stox-border p-3 flex flex-col justify-between select-none">

          {/* Top Info Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 font-mono border-b border-stox-border/50 mb-2">
            <div className="flex items-center gap-3">
              <span className="text-slate-200 font-bold">{stock.symbol || 'ASSET'}</span>
              <span className="text-blue-400">Timeframe: {timeframe}</span>
            </div>
            <div className="text-emerald-400 font-semibold">
              {hoveredPoint ? (
                <span>🕒 {hoveredPoint.time} &nbsp;|&nbsp; 💲 <strong className="text-white">${hoveredPoint.val.toFixed(2)}</strong></span>
              ) : (
                <span>Hover line for exact price & time {activeDrawingTool ? `• [Tool: ${activeDrawingTool}]` : ''}</span>
              )}
            </div>
            <span className="text-slate-500">{apiKey ? 'Alpha Vantage Live Time Series' : 'TradingView Pro Engine'}</span>
          </div>

          {/* SVG Canvas Area with Explicit Height */}
          <div
            className="relative w-full h-[380px] flex items-center justify-center cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
          >
            <svg ref={svgRef} viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="tvGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Price Grid Lines & Y-Axis Labels (Right side) */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = marginTop + ratio * chartHeight;
                const priceVal = maxPrice - ratio * priceRange;
                return (
                  <g key={i}>
                    <line
                      x1={marginLeft}
                      y1={y}
                      x2={svgWidth - marginRight}
                      y2={y}
                      stroke="#222632"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                    {/* Y-Axis Price Label on Right */}
                    <text
                      x={svgWidth - marginRight + 10}
                      y={y + 4}
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      ${priceVal.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Time Labels at Bottom */}
              {points.filter((_, idx) => idx % Math.max(1, Math.floor(points.length / 6)) === 0).map((pt, i) => (
                <text
                  key={i}
                  x={pt.x}
                  y={svgHeight - 8}
                  fill="#94a3b8"
                  fontSize="11"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {pt.time}
                </text>
              ))}

              {/* Area fill */}
              <path
                d={`${pathD} L ${marginLeft + chartWidth} ${marginTop + chartHeight} L ${marginLeft} ${marginTop + chartHeight} Z`}
                fill="url(#tvGrad)"
              />

              {/* Main Price Line */}
              <path
                d={pathD}
                fill="none"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* User Drawings / Fibonacci / Shapes */}
              {userDrawings.map((draw) => {
                if (draw.tool === 'H-Line') {
                  return (
                    <g key={draw.id}>
                      <line x1={marginLeft} y1={draw.y} x2={svgWidth - marginRight} y2={draw.y} stroke="#6366f1" strokeWidth="1.5" strokeDasharray="6 6" />
                      <text x={marginLeft + 10} y={draw.y - 5} fill="#6366f1" fontSize="10" fontFamily="monospace">Price Level</text>
                    </g>
                  );
                } else if (draw.tool === 'Fibonacci') {
                  return (
                    <g key={draw.id}>
                      {[0, 0.236, 0.382, 0.5, 0.618, 1].map((fib, idx) => {
                        const fibY = draw.y + (idx - 2) * 30;
                        return (
                          <g key={idx}>
                            <line x1={marginLeft} y1={fibY} x2={svgWidth - marginRight} y2={fibY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                            <text x={svgWidth - marginRight - 60} y={fibY - 3} fill="#f59e0b" fontSize="10" fontFamily="monospace">{(fib * 100).toFixed(1)}%</text>
                          </g>
                        );
                      })}
                    </g>
                  );
                } else if (draw.tool === 'Box') {
                  return (
                    <rect key={draw.id} x={draw.x - 50} y={draw.y - 30} width="100" height="60" fill="rgba(99, 102, 241, 0.2)" stroke="#6366f1" strokeWidth="1.5" rx="6" />
                  );
                } else {
                  return (
                    <line key={draw.id} x1={draw.x - 70} y1={draw.y + 40} x2={draw.x + 70} y2={draw.y - 40} stroke="#6366f1" strokeWidth="2" />
                  );
                }
              })}

              {/* Hover Crosshair & Price Badge */}
              {hoveredPoint && (
                <g>
                  {/* Vertical time crosshair line */}
                  <line
                    x1={hoveredPoint.x}
                    y1={marginTop}
                    x2={hoveredPoint.x}
                    y2={marginTop + chartHeight}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Horizontal price crosshair line */}
                  <line
                    x1={marginLeft}
                    y1={hoveredPoint.y}
                    x2={svgWidth - marginRight}
                    y2={hoveredPoint.y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  {/* Active price point highlight */}
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="6"
                    fill={isPositive ? '#10b981' : '#ef4444'}
                    className="animate-ping"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r="5"
                    fill="#ffffff"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="3"
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Bottom Right Fullscreen Toggle Button */}
          <div className="flex justify-end pt-3 border-t border-stox-border/50 mt-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Trading Chart"}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" /> Exit Fullscreen
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" /> Fullscreen Chart
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Stock News Section when not fullscreen */}
      {!isFullscreen && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> News & Filings regarding {stock.symbol || 'Asset'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stockNews.map((item, index) => (
              <div key={item.id || index} className="bg-stox-card border border-stox-border rounded-2xl p-5 hover:border-stox-borderLight transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono text-blue-400">{item.source || 'StoX'}</span>
                    <span className="font-mono">{item.time || '1h ago'}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-4 pt-3 border-t border-stox-border flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sentiment</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${item.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-400' : item.sentiment === 'bearish' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {(item.sentiment || 'bullish').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <h3 className="text-lg font-bold text-slate-100">Simulate Order: {stock.symbol || 'Asset'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Execute instant paper trade at current market price (${currentPrice.toFixed(2)})</p>
            </div>

            {tradeSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <div className="text-base font-bold text-emerald-400">Order Executed Successfully!</div>
                <p className="text-xs text-slate-400">Successfully bought/sold {sharesAmount} shares of {stock.symbol || 'Asset'}.</p>
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
                    <span className="text-slate-200">${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Total:</span>
                    <span className="text-slate-200 font-bold">${(currentPrice * sharesAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
