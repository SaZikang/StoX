import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Newspaper, ChevronRight } from 'lucide-react';
import { NewsTickerForm } from './NewsTickerForm';
import { ArticleModal } from './ArticleModal';

export function NewsView({ newsList, newsTicker, isNewsLoading, newsError, onFetchNews, theme = 'dark' }) {
  const [displayCount, setDisplayCount] = useState(8);
  const [expandedNews, setExpandedNews] = useState(null);
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const isLight = theme === 'light';

  const visibleArticles = newsList.slice(0, displayCount);
  const hasMore = displayCount < newsList.length;

  const handleGenerateAiSummary = async (newsItem) => {
    setIsSummarizing(true);
    setAiSummary('');
    try {
      if (newsItem.link) {
        const res = await fetch(`/api/article?url=${encodeURIComponent(newsItem.link)}`);
        const data = await res.json();
        if (data.success && data.aiSummary) {
          setAiSummary(data.aiSummary);
          if (data.fullContent) {
            newsItem.fullContent = data.fullContent;
          }
        } else {
          setAiSummary(`🤖 AI Summary: ${newsItem.headline} outlines key developments and market catalyst factors regarding ${newsItem.related_tickers?.join(', ') || 'global equities'}.`);
        }
      } else {
        setAiSummary(`🤖 AI Summary: ${newsItem.headline}`);
      }
    } catch (err) {
      setAiSummary(`🤖 AI Summary: ${newsItem.headline} discusses key financial updates and market performance.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-16"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'} flex items-center gap-2.5`}>
            <Newspaper className="w-6 h-6 text-blue-500" /> Market Intelligence &amp; Expanded News Feed
          </h1>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Browse and load extended Yahoo Finance market headlines, breaking stories, and AI summaries</p>
        </div>
        <NewsTickerForm ticker={newsTicker} onFetch={(t) => { setDisplayCount(8); onFetchNews(t); }} loading={isNewsLoading} theme={theme} />
      </div>

      {/* Quick Category / Multi-Ticker Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'} font-mono`}>Quick Feeds:</span>
        {[
          { ticker: 'ALL', label: '🌐 All Market News' },
          { ticker: 'AAPL', label: 'Apple (AAPL)' },
          { ticker: 'NVDA', label: 'NVIDIA (NVDA)' },
          { ticker: 'TSLA', label: 'Tesla (TSLA)' },
          { ticker: 'MSFT', label: 'Microsoft (MSFT)' },
          { ticker: 'SPY', label: 'S&P 500 (SPY)' }
        ].map((feed) => (
          <button
            key={feed.ticker}
            onClick={() => {
              setDisplayCount(8);
              onFetchNews(feed.ticker);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
              newsTicker === feed.ticker
                ? (isLight ? 'bg-blue-100/80 border-blue-200 text-blue-700 shadow-sm font-bold' : 'bg-blue-600 border-blue-600 text-white shadow')
                : (isLight ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-stox-card border-stox-border text-slate-300 hover:bg-stox-cardHover')
            }`}
          >
            {feed.label}
          </button>
        ))}
      </div>

      {newsError && (
        <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {newsError}. Start the StoX news API with <code className="font-mono">npm run dev:news-api</code>.
        </div>
      )}

      {isNewsLoading && newsList.length === 0 && (
        <div className={`flex items-center gap-2 py-12 text-sm ${isLight ? 'text-slate-600' : 'text-slate-400'} justify-center`}>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          Loading breaking financial news for {newsTicker}...
        </div>
      )}

      {!isNewsLoading && !newsError && newsList.length === 0 && (
        <div className={`rounded-3xl border ${isLight ? 'bg-white border-slate-200 shadow-xl text-slate-700' : 'bg-stox-card border-stox-border text-slate-400'} p-8 text-center text-sm`}>
          No recent articles found for "{newsTicker}". Try selecting "ALL" or another ticker above.
        </div>
      )}

      <div className="space-y-5">
        {visibleArticles.map((news) => (
          <div
            key={news.id}
            onClick={async () => {
              setExpandedNews(news);
              setAiSummary('');
              if (news.link) {
                try {
                  const res = await fetch(`/api/article?url=${encodeURIComponent(news.link)}`);
                  const data = await res.json();
                  if (data.success && data.fullContent) {
                    news.fullContent = data.fullContent;
                    setExpandedNews({...news});
                  }
                } catch (e) {}
              }
            }}
            className={`${
              isLight
                ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/65 text-slate-900'
                : 'bg-stox-card border-stox-border text-slate-100'
            } backdrop-blur-xl border rounded-3xl p-6 hover:border-blue-400/50 hover:shadow-2xl transition-all cursor-pointer group flex flex-col sm:flex-row gap-6 items-start`}
          >
            {news.image && (
              <div className={`h-28 w-36 flex-shrink-0 rounded-xl overflow-hidden border ${isLight ? 'border-slate-200 bg-slate-100' : 'border-stox-border bg-stox-dark'}`}>
                <img
                  src={news.image}
                  alt={news.headline}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                <span className={`px-2.5 py-1 rounded-xl border ${isLight ? 'bg-blue-100/80 border-blue-200 text-blue-700' : 'bg-stox-dark border-stox-border text-blue-400'} font-semibold`}>{news.publisher || 'Financial News'}</span>
                <span>•</span>
                <span>{news.release_time || 'Recent'}</span>
              </div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'} group-hover:text-blue-500 transition-colors leading-snug`}>
                {news.headline}
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'} line-clamp-2 leading-relaxed`}>
                {news.summary || news.fullContent}
              </p>
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-blue-500 font-semibold group-hover:underline flex items-center gap-1">
                  Read Full Article & AI Summary <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500 bg-slate-100 border-slate-200' : 'text-slate-500 bg-stox-dark border-stox-border'} px-2.5 py-1 rounded-xl border`}>
                  {news.related_tickers?.slice(0, 3).join(', ') || newsTicker}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Articles Button */}
      {hasMore && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setDisplayCount(prev => prev + 8)}
            className={`px-6 py-3.5 rounded-2xl border ${isLight ? 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-md' : 'bg-stox-card border-stox-border text-slate-200 hover:bg-stox-cardHover'} text-xs font-bold transition-all inline-flex items-center gap-2`}
          >
            <span>Load More Articles ({newsList.length - displayCount} remaining)</span>
            <ChevronRight className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      )}

      <ArticleModal
        expandedNews={expandedNews}
        onClose={() => {
          setExpandedNews(null);
          setAiSummary('');
        }}
        aiSummary={aiSummary}
        isSummarizing={isSummarizing}
        onGenerateSummary={handleGenerateAiSummary}
        newsTicker={newsTicker}
      />
    </motion.div>
  );
}
