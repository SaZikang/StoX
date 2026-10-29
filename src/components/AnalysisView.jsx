import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ShieldAlert, Sparkles, RefreshCw, BarChart2, CheckCircle2, Clock, AlertTriangle, ArrowRight, DollarSign, HelpCircle, Search } from 'lucide-react';
import { STOCKS_DATA } from '../data/stocks';

export function AnalysisView({ symbol: initialSymbol = 'TSLA', theme = 'dark', onBackToStock }) {
  const [currentSymbol, setCurrentSymbol] = useState(initialSymbol);
  const [customTickerInput, setCustomTickerInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [accountSize, setAccountSize] = useState(5000);
  const [maxLoss, setMaxLoss] = useState(50);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [explanationError, setExplanationError] = useState(null);

  const isLight = theme === 'light';

  // Filter stock suggestions based on customTickerInput
  const matchingStocks = customTickerInput.trim()
    ? STOCKS_DATA.filter(s =>
        s.symbol.toLowerCase().includes(customTickerInput.toLowerCase()) ||
        s.name.toLowerCase().includes(customTickerInput.toLowerCase())
      ).slice(0, 6)
    : [];

  const fetchAnalysis = async (sym, acc, loss) => {
    setLoading(true);
    setError(null);
    setExplanation(null);
    try {
      const res = await fetch(`http://127.0.0.1:8001/api/analysis?ticker=${sym}&account_size=${acc}&max_loss=${loss}`, {
        mode: 'cors',
        headers: { 'Accept': 'application/json' }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.detail || 'Failed to fetch analysis from engine.');
      }
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(currentSymbol, accountSize, maxLoss);
  }, [currentSymbol]);

  const handleSelectSuggestion = (stock) => {
    setCurrentSymbol(stock.symbol);
    setCustomTickerInput('');
  };

  const handleCustomTickerSubmit = (e) => {
    e.preventDefault();
    if (customTickerInput.trim()) {
      setCurrentSymbol(customTickerInput.trim().toUpperCase());
      setCustomTickerInput('');
    }
  };

  const handleRecalculate = (e) => {
    e.preventDefault();
    fetchAnalysis(currentSymbol, accountSize, maxLoss);
  };

  const handleExplain = async () => {
    if (!data) return;
    setExplaining(true);
    setExplanationError(null);
    try {
      const res = await fetch('http://127.0.0.1:8001/api/analysis/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis: data })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.detail || 'Failed to generate explanation.');
      }
      setExplanation(json.explanation);
    } catch (err) {
      setExplanationError(err.message);
    } finally {
      setExplaining(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
        <p className={`text-sm font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Running day-trading Monte Carlo simulation & backtest for {currentSymbol}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} border rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 shadow-2xl`}>
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold">Analysis Unavailable</h3>
        <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{error}</p>
        <button
          onClick={() => fetchAnalysis(currentSymbol, accountSize, maxLoss)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sim = data?.simulation || {};
  const backtest = data?.backtest || {};
  const sizing = data?.sizing || {};
  const or = data?.opening_range || {};

  // Find stock info from STOCKS_DATA if available
  const stockInfo = STOCKS_DATA.find(s => s.symbol.toUpperCase() === currentSymbol.toUpperCase());
  const displayName = stockInfo ? `${stockInfo.name} (${stockInfo.symbol})` : data.ticker;
  const displayPrice = stockInfo ? stockInfo.price : data.entry;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-20 max-w-7xl mx-auto"
    >
      {/* 1. Header & Stock Search with Suggestions */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-stox-card border-stox-border'} backdrop-blur-xl relative z-20`}>
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className={`text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{displayName} Analysis</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              data.status === 'triggered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              data.status === 'waiting' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              Setup {data.status}
            </span>
          </div>

          {/* Stock Search Box with Suggestions Dropdown */}
          <div className="relative pt-1 max-w-md">
            <form onSubmit={handleCustomTickerSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Stocks (e.g. AAPL, NVDA, TSLA)..."
                  value={customTickerInput}
                  onChange={(e) => setCustomTickerInput(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-stox-dark border-stox-border text-slate-100'} focus:outline-none focus:border-blue-500`}
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex-shrink-0"
              >
                Analyze
              </button>
            </form>

            {/* Suggestions Dropdown */}
            {matchingStocks.length > 0 && (
              <div className={`absolute top-full left-0 right-14 mt-1.5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 shadow-2xl' : 'bg-stox-card border-stox-border shadow-2xl'} overflow-hidden z-50`}>
                {matchingStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    onClick={() => handleSelectSuggestion(stock)}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-900' : 'hover:bg-stox-cardHover text-slate-100'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-blue-500">{stock.symbol}</span>
                      <span className="text-xs text-slate-400 truncate max-w-[200px]">{stock.name}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold">${stock.price?.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-2xl font-black font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${displayPrice?.toFixed(2)}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Live Price / Trigger</div>
          </div>
          {onBackToStock && (
            <button
              onClick={onBackToStock}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border ${isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-stox-border hover:bg-stox-cardHover text-slate-300'} transition-all`}
            >
              Back
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Chart & Trade Plan & Odds & Backtest */}
        <div className="lg:col-span-2 space-y-8">

          {/* 2. Chart Simulation Card */}
          <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border'} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                <BarChart2 className="w-5 h-5 text-blue-500" /> Opening Range & Price Levels
              </h2>
              <span className="text-xs font-mono text-slate-500">{or.minutes}-Min ORB</span>
            </div>
            <div className={`h-64 rounded-2xl ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark border-stox-border'} border flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <BarChart2 className="w-48 h-48 text-blue-500" />
              </div>
              <div className="z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center w-full">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-stox-card border-stox-border'}`}>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">OR High</div>
                  <div className={`text-lg font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${or.high?.toFixed(2)}</div>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-stox-card border-stox-border'}`}>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">OR Low</div>
                  <div className={`text-lg font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${or.low?.toFixed(2)}</div>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-stox-card border-stox-border'}`}>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Stop Loss</div>
                  <div className="text-lg font-mono font-bold text-rose-400">${data.stop?.toFixed(2)}</div>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-white border-slate-200' : 'bg-stox-card border-stox-border'}`}>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Take Target</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">${data.target?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Trade Plan Card */}
          <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border'} space-y-4`}>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <ShieldAlert className="w-5 h-5 text-indigo-500" /> Trade Plan Parameters
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Entry Price</div>
                <div className={`text-lg font-mono font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${data.entry?.toFixed(2)}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Stop Loss</div>
                <div className="text-lg font-mono font-bold mt-1 text-rose-400">${data.stop?.toFixed(2)}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Target</div>
                <div className="text-lg font-mono font-bold mt-1 text-emerald-400">${data.target?.toFixed(2)}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Risk / Reward</div>
                <div className={`text-lg font-mono font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>1 : {data.reward_to_risk}</div>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Risk Per Share: <span className="text-slate-300 font-bold">${data.risk_per_share?.toFixed(2)}</span>
            </div>
          </div>

          {/* 4. Odds Card (Simulated Monte Carlo) */}
          <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border'} space-y-4`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                <Sparkles className="w-5 h-5 text-amber-500" /> Simulated Session Odds (10,000 Runs)
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">Monte Carlo</span>
            </div>

            {/* Stacked Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-800">
                <div style={{ width: `${sim.target_first_pct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Target First: ${sim.target_first_pct}%`} />
                <div style={{ width: `${sim.stop_first_pct}%` }} className="bg-rose-500 transition-all duration-500" title={`Stop First: ${sim.stop_first_pct}%`} />
                <div style={{ width: `${sim.still_open_pct}%` }} className="bg-slate-600 transition-all duration-500" title={`Still Open / Neither: ${sim.still_open_pct}%`} />
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1">● Target First: {sim.target_first_pct}%</span>
                <span className="text-rose-400 flex items-center gap-1">● Stop First: {sim.stop_first_pct}%</span>
                <span className="text-slate-400 flex items-center gap-1">● Still Open: {sim.still_open_pct}%</span>
              </div>
            </div>
          </div>

          {/* 5. Backtest Card */}
          <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border'} space-y-4`}>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Historical Backtest Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Win Rate</div>
                <div className={`text-2xl font-black font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-150'}`}>{backtest.win_rate}%</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Signals (Sample Size)</div>
                <div className={`text-2xl font-black font-mono mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{backtest.signals}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Wins / Losses</div>
                <div className="text-lg font-mono font-bold mt-1 text-emerald-400">{backtest.wins} W / {backtest.losses} L</div>
              </div>
              <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'}`}>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Past Sessions</div>
                <div className={`text-lg font-mono font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{backtest.sessions}</div>
              </div>
            </div>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>
              {backtest.wins} wins of {backtest.signals} signals over {backtest.sessions} sessions.
            </p>
          </div>

        </div>

        {/* Right Col: Position Sizing & Verdict & AI Explanation */}
        <div className="space-y-8">

          {/* 6. Position Sizing */}
          <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border'} space-y-6`}>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <DollarSign className="w-5 h-5 text-emerald-500" /> Position Sizing
            </h2>

            <form onSubmit={handleRecalculate} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Account Size ($)</label>
                <input
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-stox-dark border-stox-border text-slate-100'} focus:outline-none focus:border-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Max Loss Per Trade ($)</label>
                <input
                  type="number"
                  value={maxLoss}
                  onChange={(e) => setMaxLoss(Number(e.target.value))}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono ${isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-stox-dark border-stox-border text-slate-100'} focus:outline-none focus:border-blue-500`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
              >
                Recompute Shares Live
              </button>
            </form>

            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark/50 border-stox-border'} space-y-3 font-mono text-xs`}>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Shares:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{sizing.shares} shares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Position Cost:</span>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${sizing.cost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Loss at Stop:</span>
                <span className="font-bold text-rose-400">${sizing.loss_at_stop?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 7. Verdict & Disclaimer */}
          <div className={`p-6 rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-stox-card border-stox-border'} space-y-4`}>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              <CheckCircle2 className="w-5 h-5 text-blue-500" /> Verdict & Disclaimer
            </h2>

            <div className={`p-4 rounded-2xl border ${isLight ? 'bg-blue-50/50 border-blue-200 text-blue-900' : 'bg-blue-500/10 border-blue-500/20 text-blue-200'} font-bold text-sm`}>
              {data.verdict}
            </div>

            <p className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {data.disclaimer}
            </p>

            {/* 8. AI Explanation Button (Step 6) */}
            <div className="pt-2">
              <button
                onClick={handleExplain}
                disabled={explaining}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {explaining ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {explaining ? 'Generating AI Explanation...' : 'Explain this Setup with AI'}
              </button>
            </div>

            {explanationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {explanationError} (Make sure ANTHROPIC_API_KEY is set in backend env)
              </div>
            )}

            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-stox-dark border-stox-border text-slate-200'} space-y-2 text-xs leading-relaxed`}
              >
                <div className="flex items-center gap-1.5 font-bold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5" /> AI Beginner Explanation
                </div>
                <p>{explanation}</p>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}
