#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";

const server = new Server(
  {
    name: "tradingview-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_stock_quote",
        description: "Get real-time stock quote, market metrics, day high/low, volume, and company info for a ticker symbol (e.g. AAPL, TSLA, NVDA, BTC-USD).",
        inputSchema: {
          type: "object",
          properties: {
            ticker: {
              type: "string",
              description: "Stock ticker symbol (e.g., AAPL, MSFT, BTC-USD)",
            },
          },
          required: ["ticker"],
        },
      },
      {
        name: "search_symbols",
        description: "Search stock symbols and financial instruments across global markets.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query (e.g., Apple, Tesla, semiconductor)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_market_news",
        description: "Get breaking financial news and market intelligence articles for a ticker symbol.",
        inputSchema: {
          type: "object",
          properties: {
            ticker: {
              type: "string",
              description: "Stock ticker symbol or ALL for top market news",
            },
          },
          required: ["ticker"],
        },
      },
      {
        name: "get_technical_indicators",
        description: "Calculate technical indicators (RSI, 50-day SMA, 200-day SMA, daily return volatility) for a stock ticker.",
        inputSchema: {
          type: "object",
          properties: {
            ticker: {
              type: "string",
              description: "Stock ticker symbol (e.g., AAPL)",
            },
            period: {
              type: "string",
              description: "Historical period for calculation (e.g., 1mo, 3mo, 1y)",
              default: "3mo",
            },
          },
          required: ["ticker"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_stock_quote") {
      const ticker = (args.ticker || "AAPL").toUpperCase().trim();
      const pyScript = `
import yfinance as json_yf, json
t = json_yf.Ticker("${ticker}")
hist = t.history(period="5d")
info = t.info or {}
data = {
    "ticker": "${ticker}",
    "shortName": info.get("shortName", "${ticker}"),
    "currency": info.get("currency", "USD"),
    "exchange": info.get("exchange", "NASDAQ/NYSE"),
    "marketCap": info.get("marketCap", 0),
    "currentPrice": info.get("currentPrice") or (hist["Close"].iloc[-1] if not hist.empty else 0),
    "previousClose": info.get("previousClose") or (hist["Close"].iloc[-2] if len(hist) > 1 else 0),
    "dayHigh": info.get("dayHigh") or (hist["High"].iloc[-1] if not hist.empty else 0),
    "dayLow": info.get("dayLow") or (hist["Low"].iloc[-1] if not hist.empty else 0),
    "volume": info.get("volume") or (int(hist["Volume"].iloc[-1]) if not hist.empty else 0),
    "success": True
}
print(json.dumps(data))
`;
      const stdout = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, { encoding: "utf-8" });
      const result = JSON.parse(stdout.trim());
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === "search_symbols") {
      const query = (args.query || "AAPL").trim();
      const pyScript = `
import yfinance as yf, json
s = yf.Search("${query}")
results = []
try:
    quotes = getattr(s, 'quotes', [])[:10]
    for q in quotes:
        results.append({
            "symbol": q.get("symbol"),
            "shortname": q.get("shortname") or q.get("longname"),
            "exchange": q.get("exchange"),
            "quoteType": q.get("quoteType")
        })
except Exception:
    pass
print(json.dumps({"success": True, "query": "${query}", "results": results}))
`;
      const stdout = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, { encoding: "utf-8" });
      const result = JSON.parse(stdout.trim());
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    if (name === "get_market_news") {
      const ticker = (args.ticker || "ALL").toUpperCase().trim();
      const stdout = execSync(`python3 fetch_news.py "${ticker}"`, { encoding: "utf-8", cwd: process.cwd() });
      return {
        content: [{ type: "text", text: stdout.trim() }],
      };
    }

    if (name === "get_technical_indicators") {
      const ticker = (args.ticker || "AAPL").toUpperCase().trim();
      const period = args.period || "3mo";
      const pyScript = `
import yfinance as yf, json, pandas as pd, numpy as np
t = yf.Ticker("${ticker}")
df = t.history(period="${period}")
if df.empty:
    print(json.dumps({"success": False, "error": "No historical data found"}))
else:
    close = df['Close']
    # RSI 14
    delta = close.diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    current_rsi = float(rsi.iloc[-1]) if not rsi.empty and not pd.isna(rsi.iloc[-1]) else 50.0

    sma_50 = float(close.rolling(window=50).mean().iloc[-1]) if len(close) >= 50 else float(close.mean())
    sma_200 = float(close.rolling(window=200).mean().iloc[-1]) if len(close) >= 200 else float(close.mean())

    returns = close.pct_change().dropna()
    volatility = float(returns.std() * np.sqrt(252)) * 100 if not returns.empty else 0.0

    res = {
        "success": True,
        "ticker": "${ticker}",
        "period": "${period}",
        "currentPrice": float(close.iloc[-1]),
        "rsi_14": round(current_rsi, 2),
        "sma_50": round(sma_50, 2),
        "sma_200": round(sma_200, 2),
        "annualizedVolatilityPct": round(volatility, 2)
    }
    print(json.dumps(res))
`;
      const stdout = execSync(`python3 -c '${pyScript.replace(/'/g, "'\\''")}'`, { encoding: "utf-8" });
      const result = JSON.parse(stdout.trim());
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: false, error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
