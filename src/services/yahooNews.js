export async function fetchYahooNews(ticker) {
  const response = await fetch(`/api/news?ticker=${encodeURIComponent(ticker)}`);
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.error || `Could not load news for ${ticker}.`);
  }

  if (!Array.isArray(result.articles)) {
    throw new Error('The news service returned an invalid article list.');
  }

  return result.articles;
}
