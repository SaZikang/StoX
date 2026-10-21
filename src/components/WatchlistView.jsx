import React from 'react';
import { Bookmark, ArrowUpRight, ArrowDownRight, TrendingUp, Trash2 } from 'lucide-react';

export function WatchlistView({ stocks, watchlist, toggleWatchlist, onSelectStock }) {
  const watchedStocks = stocks.filter(s => watchlist.includes(s.symbol));

  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-blue-500" /> Watchlist Portfolio ({watchedStocks.length})
        </h1>
        <p className="text-xs text-slate-400 mt-1">Track your saved financial instruments and market assets in real-time</p>
      </div>

      {watchedStocks.length > 0 ? (
        <div className="bg-stox-card border border-stox-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stox-border text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-stox-dark/50">
                  <th className="py-3.5 px-6">Instrument</th>
                  <th className="py-3.5 px-6">Sector</th>
                  <th className="py-3.5 px-6 text-right">Price</th>
                  <th className="py-3.5 px-6 text-right">Change (%)</th>
                  <th className="py-3.5 px-6 text-right">Market Cap</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stox-border text-sm">
                {watchedStocks.map((stock) => (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className="hover:bg-stox-cardHover transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stox-dark border border-stox-border flex items-center justify-center font-mono font-bold text-xs text-blue-400 group-hover:border-blue-500 transition-colors">
                        {stock.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{stock.name}</div>
                        <div className="text-xs text-slate-500 font-mono">{stock.symbol}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-400">{stock.sector}</td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-slate-100">${stock.price.toFixed(2)}</td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center gap-0.5 font-mono font-bold text-xs px-2.5 py-1 rounded-lg ${stock.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {stock.positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {stock.positive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-xs text-slate-300">{stock.marketCap}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWatchlist(stock.symbol);
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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
        <div className="bg-stox-card border border-stox-border rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stox-dark border border-stox-border flex items-center justify-center mx-auto text-slate-500">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-100">Your Watchlist is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Browse markets and click the bookmark icon on any stock card or detail view to add it to your watchlist.</p>
          </div>
        </div>
      )}
    </div>
  );
}
