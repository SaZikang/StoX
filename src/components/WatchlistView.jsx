import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ArrowUpRight, ArrowDownRight, Trash2 } from 'lucide-react';
import { StockLogo } from './StockLogo';

export function WatchlistView({ stocks, watchlist, toggleWatchlist, onSelectStock, theme = 'dark' }) {
  const watchedStocks = stocks.filter(s => watchlist.includes(s.symbol));
  const isLight = theme === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-16"
    >
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'} flex items-center gap-2.5`}>
          <Bookmark className="w-6 h-6 text-blue-600" /> Watchlist Instruments ({watchedStocks.length})
        </h1>
        <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Track your saved financial instruments and market assets in real-time</p>
      </div>

      {watchedStocks.length > 0 ? (
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/85 text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} border rounded-3xl overflow-hidden shadow-2xl`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? 'border-slate-100 bg-slate-50 text-slate-500' : 'border-stox-border bg-stox-dark/50 text-slate-500'} text-[11px] font-semibold uppercase tracking-wider`}>
                  <th className="py-4 px-6">Instrument</th>
                  <th className="py-4 px-6">Sector</th>
                  <th className="py-4 px-6 text-right">Price</th>
                  <th className="py-4 px-6 text-right">Change (%)</th>
                  <th className="py-4 px-6 text-right">Market Cap</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-stox-border'} text-sm`}>
                {watchedStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`transition-colors cursor-pointer group ${isLight ? 'hover:bg-slate-50' : 'hover:bg-stox-cardHover'}`}
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <StockLogo symbol={stock.symbol} className="w-10 h-10 shadow-sm" theme={theme} />
                      <div>
                        <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} group-hover:text-blue-600 transition-colors`}>{stock.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{stock.symbol}</div>
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{stock.sector}</td>
                    <td className={`py-4 px-6 text-right font-mono font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>${stock.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center gap-0.5 font-mono font-bold text-xs px-2.5 py-1 rounded-xl ${stock.positive ? (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-500/10 text-emerald-400') : (isLight ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-rose-500/10 text-rose-400')}`}>
                        {stock.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-right font-mono text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{stock.marketCap}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from Watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-900' : 'bg-stox-card border-stox-border text-slate-100'} border rounded-3xl p-12 text-center space-y-4`}>
          <div className={`w-16 h-16 rounded-2xl ${isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-stox-dark border-stox-border text-slate-500'} border flex items-center justify-center mx-auto shadow-inner`}>
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Your Watchlist is Empty</h3>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} max-w-sm mx-auto`}>Browse markets and click the bookmark icon on any stock card or detail view to add it to your watchlist.</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
