# StoX — Advanced Stock Market Terminal & Financial Analytics Platform

StoX is a professional, high-performance stock market terminal and investment portfolio management web application built with React, Tailwind CSS, Vite, Python, and Supabase. It provides real-time equity tracking, global market sentiment analysis, automated AI summaries, multi-currency valuation, historical portfolio momentum charting, and comprehensive financial news intelligence.

---

## 🌟 Key Features

- **Real-Time Market Data**: Live integration with Alpha Vantage and Finnhub APIs for live stock quotes, price changes, and high-low ranges.
- **Global Market Sessions**: Real-time tracking of global trading sessions (Sydney, Tokyo, London, New York) with automatic Daylight Saving Time (EDT/EST) and GMT/IST conversions.
- **Investment Portfolio Manager**: Track owned stock positions, purchase cost basis, daily unrealized P&L, and historical valuation snapshots backed by Supabase RLS and local storage fallback.
- **Interactive Portfolio Charting**: Automatically records day-by-day closing portfolio valuations (building chronologically from day one).
- **Market Intelligence & AI News Reader**: Browse breaking financial news feeds from Yahoo Finance and generate AI-powered article summaries.
- **Watchlist & Global Instrument Search**: Instantly bookmark assets and search international equities across US, Malaysia, China, Taiwan, Europe, and UK exchanges.
- **Dark / Light Mode**: Seamless single-icon theme toggle with polished glassmorphism and animated components.
- **Snapshot Export Modal**: Capture gorgeous snapshot reports of your financial command center.

---

## 📸 Screenshots & Visual Tour

### 1. Dark Mode Homepage
*The primary StoX command center in dark mode, featuring real-time equity valuation, daily unrealized P&L, portfolio momentum trends, top market gainers, and regional stock grids.*
<img width="1920" height="991" alt="StoX Dark Mode Homepage" src="https://github.com/user-attachments/assets/c9399c42-bef2-47d5-8e62-d25eecf56e1f" />

### 2. Light Mode Homepage
*The clean, elegant light mode theme providing high-contrast financial readability across all widgets, cards, and interactive charts.*
<img width="1920" height="1000" alt="StoX Light Mode Homepage" src="https://github.com/user-attachments/assets/b44f1600-e3a0-49c7-85e2-80b3cc3570f8" />

### 3. Investment Portfolio
*Manage owned stock positions, inspect asset allocation, track cost basis against live market prices, and monitor cumulative returns with animated count-up numbers.*
<img width="1920" height="991" alt="StoX Portfolio View" src="https://github.com/user-attachments/assets/836e0d1e-8d00-404c-9b2b-c93181eab542" />

### 4. Watchlist
*Curated table of saved financial instruments and key market assets with live price updates, 24h performance badges, and sector filters.*
<img width="1920" height="984" alt="StoX Watchlist View" src="https://github.com/user-attachments/assets/99827853-b8bb-4574-8a34-4b1ffc04e068" />

### 5. Market Intelligence & News Feed
*Extended Yahoo Finance market headlines, breaking stories, ticker filters, and instant AI-generated article summaries.*
<img width="1920" height="990" alt="StoX News Feed & AI Summaries" src="https://github.com/user-attachments/assets/1d2bf229-8331-40fc-adb3-d17430e63cc5" />

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.x

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SaZikang/StoX.git
   cd StoX
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Start the Python API server (optional for news feed backend):**
   ```bash
   python3 api_server.py
   ```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
