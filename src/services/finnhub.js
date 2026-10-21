// Finnhub API client service for live up-to-date market data and global stock search

const FINNHUB_BASE = 'https://finnhub.io/api/v1';

export async function fetchFinnhubQuote(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.c !== undefined && data.c !== 0) {
        return {
          price: data.c,
          change: data.d,
          changePercent: data.dp,
          high: data.h,
          low: data.l,
          open: data.o,
          previousClose: data.pc,
          positive: data.d >= 0
        };
      }
    }
  } catch (err) {
    console.error(`Error fetching live quote for ${symbol}:`, err);
  }
  return null;
}

export async function fetchFinnhubProfile(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.name) {
        return {
          name: data.name,
          marketCap: data.marketCapitalization ? `$${(data.marketCapitalization).toFixed(2)}B` : 'N/A',
          sector: data.finnhubIndustry || 'Equities & Markets',
          logo: data.logo || '',
          weburl: data.weburl || ''
        };
      }
    }
  } catch (err) {
    console.error(`Error fetching profile for ${symbol}:`, err);
  }
  return null;
}

export async function fetchFinnhubNews(apiKey) {
  if (!apiKey) return [];
  try {
    const res = await fetch(`${FINNHUB_BASE}/news?category=general&token=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.slice(0, 10).map((item, idx) => ({
          id: idx + 1,
          title: item.headline || 'Market News Update',
          summary: item.summary || '',
          source: item.source || 'Finnhub',
          time: 'Live',
          category: item.related || 'General',
          related: item.related ? [item.related] : ['MARKET'],
          impact: 'positive'
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching live news:', err);
  }
  return [];
}

export async function searchFinnhubSymbols(query, apiKey) {
  if (!apiKey || !query.trim()) return [];
  try {
    const res = await fetch(`${FINNHUB_BASE}/search?q=${encodeURIComponent(query)}&token=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.result)) {
        // Map Finnhub search results
        return data.result.slice(0, 15).map(item => ({
          symbol: item.symbol,
          name: item.description || item.displaySymbol || item.symbol,
          sector: item.type || 'Equity',
          marketCap: 'Live',
          peRatio: 25.0,
          high52: 0,
          low52: 0,
          volume: 'N/A',
          description: `${item.description} (${item.symbol}) traded on global exchanges.`,
          price: 100.0, // Will be updated with live quote when selected
          change: 0.0,
          changePercent: 0.0,
          positive: true,
          history: {
            '1H': [100, 100.5, 100.2, 100.8],
            '1D': [98, 99, 99.5, 100, 100.8],
            '1W': [95, 97, 98, 99, 100.8],
            '1M': [90, 93, 96, 98, 100.8],
          },
          news: [
            { id: 1, title: `${item.description} Reports Latest Quarter Results`, time: '1d ago', source: 'Finnhub', sentiment: 'bullish' }
          ]
        }));
      }
    }
  } catch (err) {
    console.error('Error searching Finnhub symbols:', err);
  }
  return [];
}
