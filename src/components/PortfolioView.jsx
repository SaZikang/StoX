import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, ArrowUpRight, ArrowDownRight, Trash2, Plus, Edit2, Check, X, Wallet, Search } from 'lucide-react';
import { StockLogo } from './StockLogo';

function AnimatedNumber({ value, prefix = "$", decimals = 2 }) {
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

export function PortfolioView({ stocks, holdings = [], setHoldings, onSelectStock, theme = 'dark' }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [symbolInput, setSymbolInput] = useState('');
  const [sharesInput, setSharesInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [showStockDropdown, setShowStockDropdown] = useState(false);

  const isLight = theme === 'light';

  // Calculate portfolio totals
  let totalPortfolioValue = 0;
  let totalCostBasis = 0;

  const holdingsWithMetrics = holdings.map(h => {
    const stockObj = stocks.find(s => s.symbol.toUpperCase() === h.symbol.toUpperCase()) || { price: h.avgPrice, name: h.symbol, sector: 'Equities', positive: true };
    const currentPrice = stockObj.price;
    const marketValue = h.shares * currentPrice;
    const costBasis = h.shares * h.avgPrice;
    const profitLoss = marketValue - costBasis;
    const profitLossPercent = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

    totalPortfolioValue += marketValue;
    totalCostBasis += costBasis;

    return {
      ...h,
      currentPrice,
      marketValue,
      costBasis,
      profitLoss,
      profitLossPercent,
      stockObj
    };
  });

  const totalProfitLoss = totalPortfolioValue - totalCostBasis;
  const totalProfitLossPercent = totalCostBasis > 0 ? (totalProfitLoss / totalCostBasis) * 100 : 0;
  const isPortfolioPositive = totalProfitLoss >= 0;

  // Filter stocks for autocomplete recommendation dropdown
  const matchingStocks = stocks.filter(s =>
    s.symbol.toLowerCase().includes(symbolInput.toLowerCase()) ||
    s.name.toLowerCase().includes(symbolInput.toLowerCase())
  ).slice(0, 6);

  const handleSaveHolding = (e) => {
    e.preventDefault();
    const sym = symbolInput.trim().toUpperCase();
    const shares = parseFloat(sharesInput);
    const avgPrice = parseFloat(priceInput);

    if (!sym || isNaN(shares) || isNaN(avgPrice) || shares <= 0 || avgPrice <= 0) return;

    if (editIndex !== null) {
      const updated = [...holdings];
      updated[editIndex] = { symbol: sym, shares, avgPrice };
      setHoldings(updated);
      setEditIndex(null);
    } else {
      const existingIdx = holdings.findIndex(h => h.symbol.toUpperCase() === sym);
      if (existingIdx !== -1) {
        const updated = [...holdings];
        updated[existingIdx] = {
          symbol: sym,
          shares: updated[existingIdx].shares + shares,
          avgPrice: ((updated[existingIdx].shares * updated[existingIdx].avgPrice) + (shares * avgPrice)) / (updated[existingIdx].shares + shares)
        };
        setHoldings(updated);
      } else {
        setHoldings([...holdings, { symbol: sym, shares, avgPrice }]);
      }
    }

    setIsAddModalOpen(false);
    setSymbolInput('');
    setSharesInput('');
    setPriceInput('');
    setShowStockDropdown(false);
  };

  const handleEditHolding = (index) => {
    const h = holdings[index];
    setSymbolInput(h.symbol);
    setSharesInput(h.shares.toString());
    setPriceInput(h.avgPrice.toString());
    setEditIndex(index);
    setIsAddModalOpen(true);
  };

  const handleDeleteHolding = (index) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-10 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'} flex items-center gap-2.5`}>
            <Wallet className="w-6 h-6 text-blue-600" /> Investment Portfolio ({holdingsWithMetrics.length} Positions)
          </h1>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Manage your owned stocks, purchase prices, real-time portfolio valuation, and performance</p>
        </div>
        <button
          onClick={() => {
            setEditIndex(null);
            setSymbolInput('');
            setSharesInput('');
            setPriceInput('');
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Owned Stock
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900' : 'bg-stox-card/90 border-stox-border text-slate-100'} backdrop-blur-xl border rounded-3xl p-7 space-y-2`}>
          <div className={`text-xs uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-500'} font-mono`}>Total Portfolio Value</div>
          <div className={`text-2xl font-mono font-extrabold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <AnimatedNumber value={totalPortfolioValue} prefix="$" decimals={2} />
          </div>
          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>
            Cost Basis: $<AnimatedNumber value={totalCostBasis} prefix="" decimals={2} />
          </div>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900' : 'bg-stox-card/90 border-stox-border text-slate-100'} backdrop-blur-xl border rounded-3xl p-7 space-y-2`}>
          <div className={`text-xs uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-500'} font-mono`}>Total Net P&amp;L ($)</div>
          <div className={`text-2xl font-mono font-extrabold flex items-center gap-1 ${isPortfolioPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPortfolioPositive ? '+' : ''}$<AnimatedNumber value={totalProfitLoss} prefix="" decimals={2} />
          </div>
          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>Overall Return</div>
        </div>

        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900' : 'bg-stox-card/90 border-stox-border text-slate-100'} backdrop-blur-xl border rounded-3xl p-7 space-y-2`}>
          <div className={`text-xs uppercase font-semibold ${isLight ? 'text-slate-500' : 'text-slate-500'} font-mono`}>Return Percentage (%)</div>
          <div className={`text-2xl font-mono font-extrabold flex items-center gap-1 ${isPortfolioPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPortfolioPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            {isPortfolioPositive ? '+' : ''}<AnimatedNumber value={totalProfitLossPercent} prefix="" decimals={2} />%
          </div>
          <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>Real-Time Valuation</div>
        </div>
      </div>

      {/* Holdings Table */}
      {holdingsWithMetrics.length > 0 ? (
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} border rounded-3xl overflow-hidden shadow-2xl`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-100 bg-slate-50 text-slate-500' : 'border-stox-border bg-stox-dark/50 text-slate-500'} text-[11px] font-semibold uppercase tracking-wider`}>
                  <th className="py-4 px-6">Instrument</th>
                  <th className="py-4 px-6 text-right">Shares</th>
                  <th className="py-4 px-6 text-right">Avg Cost</th>
                  <th className="py-4 px-6 text-right">Current Price</th>
                  <th className="py-4 px-6 text-right">Market Value</th>
                  <th className="py-4 px-6 text-right">Unrealized P&amp;L</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-stox-border'} text-sm`}>
                {holdingsWithMetrics.map((item, index) => {
                  const isPositive = item.profitLoss >= 0;
                  return (
                    <tr
                      key={item.symbol + index}
                      onClick={() => onSelectStock(item.stockObj)}
                      className={`transition-colors cursor-pointer group ${isLight ? 'hover:bg-slate-50' : 'hover:bg-stox-cardHover'}`}
                    >
                      <td className="py-4 px-6 flex items-center gap-3">
                        <StockLogo symbol={item.symbol} className="w-10 h-10 shadow-sm" theme={theme} />
                        <div>
                          <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} group-hover:text-blue-600 transition-colors`}>{item.stockObj.name || item.symbol}</div>
                          <div className="text-xs text-slate-500 font-mono">{item.symbol} • {item.stockObj.sector}</div>
                        </div>
                      </td>
                      <td className={`py-4 px-6 text-right font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        <AnimatedNumber value={item.shares} prefix="" decimals={item.shares % 1 === 0 ? 0 : 2} />
                      </td>
                      <td className={`py-4 px-6 text-right font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        $<AnimatedNumber value={item.avgPrice} prefix="" decimals={2} />
                      </td>
                      <td className={`py-4 px-6 text-right font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        $<AnimatedNumber value={item.currentPrice} prefix="" decimals={2} />
                      </td>
                      <td className={`py-4 px-6 text-right font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                        $<AnimatedNumber value={item.marketValue} prefix="" decimals={2} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className={`font-mono font-bold text-xs ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isPositive ? '+' : ''}$<AnimatedNumber value={item.profitLoss} prefix="" decimals={2} />
                        </div>
                        <div className={`text-[11px] font-mono ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          ({isPositive ? '+' : ''}<AnimatedNumber value={item.profitLossPercent} prefix="" decimals={2} />%)
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditHolding(index)}
                            className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit Holding"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteHolding(index)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Holding"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} border rounded-3xl p-12 text-center space-y-4`}>
          <div className={`w-16 h-16 rounded-2xl ${isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-stox-dark border-stox-border text-slate-500'} border flex items-center justify-center mx-auto shadow-inner`}>
            <PieChart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>No Portfolio Positions Added Yet</h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-sm mx-auto`}>Click "Add Owned Stock" above to input your shares and purchase prices to track your portfolio in real time.</p>
          </div>
        </div>
      )}

      {/* Add / Edit Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md ${isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-stox-card text-slate-100 border-stox-border'} border rounded-3xl p-6 shadow-2xl relative`}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className={`text-lg font-bold mb-4 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {editIndex !== null ? 'Edit Owned Stock Position' : 'Add Stock to Portfolio'}
            </h3>

            <form onSubmit={handleSaveHolding} className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Stock Ticker Symbol</label>
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. NVDA, AAPL, MAYBANK..."
                    value={symbolInput}
                    onChange={(e) => {
                      setSymbolInput(e.target.value);
                      setShowStockDropdown(true);
                      const found = stocks.find(s => s.symbol.toUpperCase() === e.target.value.trim().toUpperCase());
                      if (found && !priceInput) {
                        setPriceInput(found.price.toString());
                      }
                    }}
                    onFocus={() => setShowStockDropdown(true)}
                    className={`w-full ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-stox-dark border-stox-border text-slate-100'} border rounded-xl pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500`}
                  />
                </div>

                {/* Autocomplete dropdown for recommendations */}
                {showStockDropdown && symbolInput.trim() !== '' && matchingStocks.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-1 ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} border rounded-2xl shadow-2xl overflow-hidden z-50`}>
                    {matchingStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        onClick={() => {
                          setSymbolInput(stock.symbol);
                          setPriceInput(stock.price.toString());
                          setShowStockDropdown(false);
                        }}
                        className={`px-4 py-2.5 flex items-center justify-between cursor-pointer ${isLight ? 'hover:bg-slate-50' : 'hover:bg-stox-cardHover'}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <StockLogo symbol={stock.symbol} className="w-7 h-7" theme={theme} />
                          <div>
                            <div className="text-xs font-semibold">{stock.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{stock.symbol}</div>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-bold">${stock.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Number of Shares</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 25"
                  value={sharesInput}
                  onChange={(e) => setSharesInput(e.target.value)}
                  className={`w-full ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-stox-dark border-stox-border text-slate-100'} border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Average Purchase Price ($)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="e.g. 115.50"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className={`w-full ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-stox-dark border-stox-border text-slate-100'} border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stox-border text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30"
                >
                  {editIndex !== null ? 'Save Changes' : 'Add Position'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
