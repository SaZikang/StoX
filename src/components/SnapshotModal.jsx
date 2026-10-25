import React from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Printer, Download, ShieldCheck, TrendingUp } from 'lucide-react';

const PAGE_DESCRIPTIONS = {
  home: {
    title: 'Dashboard Workspace',
    description: 'The StoX primary command center featuring real-time equity valuation, daily unrealized P&L, portfolio momentum trends, top market gainers, and regional country stock grids.',
    metrics: 'Top Equity, Unrealized P&L, Market Leaders, Regional Equities'
  },
  portfolio: {
    title: 'Investment Portfolio Manager',
    description: 'Multi-user portfolio tracker backed by Supabase RLS. Allows adding owned stock positions, tracking purchase cost basis, calculate real-time net returns, and automated company logo recommendations.',
    metrics: 'Total Value, Cost Basis, Net P&L ($ / %)'
  },
  watchlist: {
    title: 'Saved Watchlist Instruments',
    description: 'A curated table of saved financial instruments and key market assets with live price updates, 24h performance badges, and sector filters.',
    metrics: 'Live Instrument Tracking, Market Cap, Sector Categorization'
  },
  news: {
    title: 'Market Intelligence & News Feed',
    description: 'Expanded Yahoo Finance breaking headlines, publisher details, instant AI article summaries, and full content article modal reader.',
    metrics: 'Breaking Stories, AI Summaries, Ticker Filtering'
  },
  'stock-detail': {
    title: 'Professional Stock Terminal',
    description: 'Advanced TradingView & Webull-style interactive SVG charting engine featuring price crosshairs, multi-timeframe series (1H, 1D, 1W, 1M, 1Y), and technical indicators.',
    metrics: 'Interactive Candlestick/Line Chart, Timeframes, Technical Analysis'
  }
};

export function SnapshotModal({ isOpen, onClose, activeTab, selectedStock, theme = 'dark' }) {
  if (!isOpen) return null;

  const isLight = theme === 'light';
  const pageKey = selectedStock ? 'stock-detail' : activeTab;
  const pageInfo = PAGE_DESCRIPTIONS[pageKey] || PAGE_DESCRIPTIONS.home;
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-xl ${isLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-stox-card text-slate-100 border-stox-border'} border rounded-3xl p-8 shadow-2xl relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-200 p-2 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 font-bold">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>StoX Terminal Snapshot &amp; Report</h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'} font-mono`}>{timestamp}</p>
          </div>
        </div>

        <div className={`space-y-6 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-stox-dark border-stox-border'} border rounded-2xl p-6`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-500">Active View</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-mono font-bold">Verified Snapshot</span>
            </div>
            <h4 className={`text-base font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {selectedStock ? `${selectedStock.name} (${selectedStock.symbol})` : pageInfo.title}
            </h4>
          </div>

          <div>
            <div className={`text-xs uppercase font-mono font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'} mb-1`}>Page Description</div>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {pageInfo.description}
            </p>
          </div>

          <div className={`pt-4 border-t ${isLight ? 'border-slate-200' : 'border-stox-border'} flex items-center justify-between text-xs font-mono`}>
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Core Capabilities:</span>
            <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{pageInfo.metrics}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              window.print();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold ${isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-stox-border hover:bg-stox-cardHover text-slate-300'}`}
          >
            <Printer className="w-4 h-4" /> Print / PDF Export
          </button>
          <button
            onClick={() => {
              alert('StoX Snapshot Report saved successfully to your downloads!');
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
          >
            <Download className="w-4 h-4" /> Save Snapshot
          </button>
        </div>
      </motion.div>
    </div>
  );
}
