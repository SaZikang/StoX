import React from 'react';
import { Newspaper, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { FINANCIAL_NEWS } from '../data/stocks';

export function NewsView({ onSelectStock }) {
  return (
    <div className="space-y-6 pb-16 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-blue-500" /> Market Intelligence & News Feed
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time financial journalism, macroeconomic updates, and corporate earnings</p>
      </div>

      <div className="space-y-4">
        {FINANCIAL_NEWS.map((news) => (
          <div key={news.id} className="bg-stox-card border border-stox-border rounded-2xl p-6 hover:border-stox-borderLight transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-md bg-stox-dark border border-stox-border text-blue-400 font-medium">{news.category}</span>
                <span className="font-mono text-slate-500">{news.source} • {news.time}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors cursor-pointer">
                {news.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">{news.summary}</p>
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-stox-border pt-4 md:pt-0">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${news.impact === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {news.impact.toUpperCase()} IMPACT
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500">Related:</span>
                {news.related.map(sym => (
                  <span key={sym} className="px-2 py-0.5 rounded bg-stox-dark border border-stox-border font-mono text-[10px] text-slate-300">
                    {sym}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
