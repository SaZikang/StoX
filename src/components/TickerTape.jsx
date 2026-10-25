import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function TickerTape({ stocks, onSelectStock, theme = 'dark' }) {
  const isLight = theme === 'light';

  // Key global market indices & active tickers
  const baseItems = [
    { symbol: 'S&P 500', price: 5842.10, changePercent: 0.64, positive: true },
    { symbol: 'NASDAQ', price: 18385.40, changePercent: 0.89, positive: true },
    { symbol: 'DOW JONES', price: 43210.50, changePercent: -0.15, positive: false },
    { symbol: 'BTC-USD', price: 68450.00, changePercent: 3.24, positive: true },
    { symbol: 'NVDA', price: 138.25, changePercent: 2.15, positive: true },
    { symbol: 'AAPL', price: 232.40, changePercent: 0.45, positive: true },
    { symbol: 'TSLA', price: 220.10, changePercent: -1.85, positive: false },
    { symbol: 'MSFT', price: 421.30, changePercent: 0.72, positive: true },
    { symbol: 'ETH-USD', price: 2680.50, changePercent: 1.45, positive: true }
  ];

  // Duplicate for seamless infinite auto-scroll loop
  const tickerItems = [...baseItems, ...baseItems];

  return (
    <div className={`border-b py-2.5 px-8 overflow-hidden relative transition-colors ${isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'bg-[#0b0e14] border-[#2a2e39] text-slate-200'}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r ${isLight ? 'from-white to-transparent' : 'from-[#0b0e14] to-transparent'} z-10 pointer-events-none`}></div>
      <div className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l ${isLight ? 'from-white to-transparent' : 'from-[#0b0e14] to-transparent'} z-10 pointer-events-none`}></div>

      <motion.div
        className="flex items-center gap-12 whitespace-nowrap text-xs font-mono w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 35 }}
      >
        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-xl border flex-shrink-0 ${isLight ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' : 'text-blue-400 bg-blue-500/10 border-blue-500/25'}`}>
          Live Ticker
        </span>
        {tickerItems.map((item, idx) => {
          const matchingStock = stocks.find(s => s.symbol === item.symbol);
          const price = matchingStock ? matchingStock.price : item.price;
          const change = matchingStock ? matchingStock.changePercent : item.changePercent;
          const isPositive = matchingStock ? matchingStock.positive : item.positive;

          return (
            <div
              key={`${item.symbol}-${idx}`}
              onClick={() => matchingStock && onSelectStock(matchingStock)}
              className={`flex items-center gap-2.5 cursor-pointer px-3 py-1.5 rounded-xl transition-colors group flex-shrink-0 ${isLight ? 'hover:bg-slate-100 border border-slate-200 shadow-sm bg-white' : 'hover:bg-[#1e222d]'}`}
            >
              <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-300'} group-hover:text-blue-600`}>{item.symbol}</span>
              <span className={isLight ? 'text-slate-900 font-semibold' : 'text-slate-200'}>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`flex items-center gap-0.5 font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
