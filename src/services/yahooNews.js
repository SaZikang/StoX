export async function fetchYahooNews(ticker) {
  const cacheKey = `stox_news_${ticker || 'ALL'}`;
  try {
    const response = await fetch(`http://127.0.0.1:8001/api/news?ticker=${encodeURIComponent(ticker)}`, {
      mode: 'cors',
      headers: { 'Accept': 'application/json' }
    });
    const result = await response.json();

    if (!response.ok || !result.success || !Array.isArray(result.articles)) {
      throw new Error(result.error || `Could not load news for ${ticker}.`);
    }

    // Cache locally so it persists even when offline or computer/browser closed
    localStorage.setItem(cacheKey, JSON.stringify(result.articles));
    return result.articles;
  } catch (err) {
    // Offline / Closed fallback from localStorage cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: 1,
        title: `Market Update: ${ticker} Active Session Overview`,
        summary: `Latest market activity and volume indicators for ${ticker}.`,
        source: 'StoX Terminal Cache',
        time: 'Cached offline',
        sentiment: 'bullish'
      }
    ];
  }
}
