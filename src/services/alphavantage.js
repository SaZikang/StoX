// Alpha Vantage API client service for live quotes, symbol search, time series history, and market intelligence

const AV_BASE = 'https://www.alphavantage.co/query';

export async function fetchAlphaVantageQuote(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`${AV_BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`);
    if (res.ok) {
      const data = await res.json();

      if (data.Note || data.Information) {
        console.warn(`Alpha Vantage rate limit notice for ${symbol}:`, data.Note || data.Information);
        return null;
      }

      const quote = data && data['Global Quote'];
      if (quote && quote['05. price']) {
        const price = parseFloat(quote['05. price']);
        const change = parseFloat(quote['09. change'] || 0);
        const changePercentStr = quote['10. change percent'] || '0%';
        const changePercent = parseFloat(changePercentStr.replace('%', '')) || 0;

        return {
          price,
          change,
          changePercent,
          high: parseFloat(quote['03. high'] || price),
          low: parseFloat(quote['04. low'] || price),
          open: parseFloat(quote['02. open'] || price),
          previousClose: parseFloat(quote['08. previous close'] || price),
          positive: change >= 0
        };
      }
    }
  } catch (err) {
    console.error(`Error fetching Alpha Vantage quote for ${symbol}:`, err);
  }
  return null;
}

export async function fetchAlphaVantageTimeSeries(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    const resIntra = await fetch(`${AV_BASE}?function=TIME_SERIES_INTRADAY&symbol=${encodeURIComponent(symbol)}&interval=15min&apikey=${apiKey}`);
    const resDaily = await fetch(`${AV_BASE}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`);

    const history = {
      '1H': [],
      '1D': [],
      '1W': [],
      '1M': [],
      '1Y': []
    };

    if (resIntra.ok) {
      const dataIntra = await resIntra.json();
      const tsIntra = dataIntra['Time Series (15min)'];
      if (tsIntra) {
        const keys = Object.keys(tsIntra).sort().slice(-24);
        const prices = keys.map(k => parseFloat(tsIntra[k]['4. close']));
        if (prices.length > 0) {
          history['1D'] = prices;
          history['1H'] = prices.slice(-12);
        }
      }
    }

    if (resDaily.ok) {
      const dataDaily = await resDaily.json();
      const tsDaily = dataDaily['Time Series (Daily)'];
      if (tsDaily) {
        const keys = Object.keys(tsDaily).sort();
        const dailyPrices = keys.map(k => parseFloat(tsDaily[k]['4. close']));
        if (dailyPrices.length > 5) {
          history['1W'] = dailyPrices.slice(-7);
          history['1M'] = dailyPrices.slice(-30);
          history['1Y'] = dailyPrices.slice(-52);
        }
      }
    }

    if (history['1D'].length > 0 || history['1M'].length > 0) {
      return history;
    }
  } catch (err) {
    console.error(`Error fetching Alpha Vantage time series for ${symbol}:`, err);
  }
  return null;
}

export async function fetchAlphaVantageNews(apiKey) {
  if (!apiKey) return [];
  try {
    const res = await fetch(`${AV_BASE}?function=NEWS_SENTIMENT&topics=technology,financial_markets&apikey=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data.Note || data.Information) return [];

      const feed = data && data.feed;
      if (Array.isArray(feed)) {
        return feed.slice(0, 10).map((item, idx) => ({
          id: idx + 1,
          title: item.title || 'Market News Update',
          summary: item.summary || '',
          source: item.source || 'Alpha Vantage',
          time: 'Live',
          category: item.category_within_source || 'General',
          related: item.ticker_sentiment ? item.ticker_sentiment.map(t => t.ticker) : ['MARKET'],
          impact: item.overall_sentiment_label && item.overall_sentiment_label.toLowerCase().includes('bear') ? 'negative' : 'positive'
        }));
      }
    }
  } catch (err) {
    console.error('Error fetching Alpha Vantage news:', err);
  }
  return [];
}

export async function searchAlphaVantageSymbols(query, apiKey) {
  if (!apiKey || !query.trim()) return [];
  try {
    const res = await fetch(`${AV_BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data.Note || data.Information) return [];

      const matches = data && data.bestMatches;
      if (Array.isArray(matches)) {
        return matches.slice(0, 15).map(item => ({
          symbol: item['1. symbol'],
          name: item['2. name'] || item['1. symbol'],
          sector: item['3. type'] || 'Equity',
          marketCap: 'Live',
          peRatio: 25.0,
          high52: 0,
          low52: 0,
          volume: 'N/A',
          description: `${item['2. name']} (${item['1. symbol']}) traded on ${item['4. region'] || 'Global'} exchange.`,
          price: 100.0,
          change: 0.0,
          changePercent: 0.0,
          positive: true,
          history: {
            '1H': [99.2, 99.5, 99.8, 100.0],
            '1D': [98.0, 98.5, 99.2, 100.0],
            '1W': [95.0, 97.0, 98.5, 100.0],
            '1M': [90.0, 94.0, 97.0, 100.0],
            '1Y': [80.0, 88.0, 95.0, 100.0]
          },
          news: [
            { id: 1, title: `${item['2. name']} Reports Latest Market Results`, time: '1d ago', source: 'Alpha Vantage', sentiment: 'bullish' }
          ]
        }));
      }
    }
  } catch (err) {
    console.error('Error searching Alpha Vantage symbols:', err);
  }
  return [];
}
