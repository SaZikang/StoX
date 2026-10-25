import React from 'react';
import { ExternalLink, Bot, Sparkle, X } from 'lucide-react';

export function ArticleModal({ expandedNews, onClose, aiSummary, isSummarizing, onGenerateSummary, newsTicker }) {
  if (!expandedNews) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-stox-card border border-stox-border rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl space-y-6 relative animate-scaleUp my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stox-dark border border-stox-border text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {expandedNews.image && (
          <div className="h-72 w-full rounded-xl overflow-hidden relative border border-stox-border bg-stox-dark">
            <img src={expandedNews.image} alt={expandedNews.headline} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-stox-dark/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono font-semibold text-blue-400 border border-stox-border">
              High-Resolution Feed Image
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold">{newsTicker || 'MARKET'}</span>
            <span>{expandedNews.publisher || 'Financial Publisher'}</span>
            <span>•</span>
            <span>{expandedNews.release_time || 'Recent'}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 leading-snug">{expandedNews.headline}</h2>
        </div>

        {/* AI Summary Section at the Top */}
        <div className="bg-gradient-to-br from-blue-950/30 via-stox-dark to-stox-dark border border-blue-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-blue-400" /> StoX AI Article Summary Assistant
            </span>
            <button
              onClick={() => onGenerateSummary(expandedNews)}
              disabled={isSummarizing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
            >
              <Sparkle className="w-3.5 h-3.5" />
              {isSummarizing ? 'Analyzing Article...' : (aiSummary ? '✨ Regenerate Summary' : '✨ Generate AI Summary')}
            </button>
          </div>

          {isSummarizing && (
            <div className="text-xs text-slate-400 italic animate-pulse">
              AI is reading original website and analyzing financial context...
            </div>
          )}

          {aiSummary && (
            <div className="text-xs text-slate-200 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 leading-relaxed font-mono animate-fadeIn">
              {aiSummary}
            </div>
          )}
        </div>

        {expandedNews.link && (
          <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <ExternalLink className="w-4 h-4" /> Original Publisher Source
              </div>
              <div className="text-[11px] text-slate-400 font-mono truncate max-w-md">{expandedNews.link}</div>
            </div>
            <a
              href={expandedNews.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all whitespace-nowrap flex items-center gap-1.5"
            >
              Read Original Article <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-b border-stox-border py-5 whitespace-pre-line">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Full Article Content</h4>
          <p>{expandedNews.fullContent || expandedNews.summary || 'No full article content available.'}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span>Related:</span>
            {expandedNews.related_tickers && expandedNews.related_tickers.map(sym => (
              <span key={sym} className="px-2 py-0.5 rounded bg-stox-dark border border-stox-border font-mono text-xs text-blue-400">
                {sym}
              </span>
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stox-dark border border-stox-border text-xs font-semibold text-slate-300 hover:text-white"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}
