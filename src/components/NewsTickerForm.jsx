import React, { useEffect, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';

export function NewsTickerForm({ ticker, onFetch, loading, theme = 'dark' }) {
  const [value, setValue] = useState(ticker);
  const isLight = theme === 'light';

  useEffect(() => {
    setValue(ticker || '');
  }, [ticker]);

  // Debounced auto-search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = value.trim().toUpperCase();
      if (normalized !== (ticker || '')) {
        onFetch(normalized);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [value, ticker, onFetch]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="news-ticker" className="sr-only">Stock ticker for news</label>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        <input
          id="news-ticker"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Search ticker (e.g. NVDA)..."
          maxLength={20}
          className={`w-48 ${
            isLight
              ? 'bg-white border-white text-slate-900 placeholder-slate-400 shadow-md shadow-slate-200/50 focus:border-blue-400'
              : 'bg-stox-dark border-stox-border text-slate-100 placeholder-slate-500 focus:border-blue-500'
          } border rounded-xl pl-9 pr-8 py-2 text-xs font-mono transition-all`}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue('');
              onFetch('');
            }}
            className="absolute right-2.5 text-slate-500 hover:text-slate-300"
            title="Clear and show latest news"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {loading && (
        <div className="flex items-center gap-1 text-xs text-blue-400 font-mono">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        </div>
      )}
    </div>
  );
}
