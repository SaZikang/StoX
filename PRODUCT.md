# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, Vite, Tailwind CSS, Lucide Icons, Lightweight Charts / Canvas-based Financial Charting with interactive drawing tools and technical indicators (SMA, EMA, RSI, MACD).

## Users

Retail investors, day traders, and finance enthusiasts looking for a lightning-fast, advanced yet simple-to-use stock market dashboard with professional charting and real-time insights.

## Product Purpose

StoX provides a sleek, Bloomberg-meets-Robinhood financial terminal experience where users can track top gainers/losers, high-growth stocks, search instruments, analyze multi-timeframe interactive price charts with drawing tools and technical indicators, and catch up on real-time stock news.

## Positioning

Combines advanced trading terminal capabilities (drawing tools, indicators, multi-timeframe charts) with an ultra-clean, minimalist consumer interface ("cool, advanced, and simple to use").

## Operating Context

Desktop and mobile web browsers. Fast-paced market monitoring, technical analysis, and stock research sessions.

## Capabilities and Constraints

- Home page with top gainers, top losers, high-growth stocks, and live search bar.
- Stock detail page with live metrics, multi-timeframe charts (Hour, Day, Week, Month), and drawing/indicator toolbar.
- Interactive ticker-specific news feed using yfinance, showing Yahoo Finance headlines, publisher, release time, available summary, and the original publisher link. Full article text is read at the original source.
- Local news API setup: run `python3 -m pip install -r requirements.txt`, then run `npm run dev` and `npm run dev:news-api` in separate terminals; Vite proxies news requests to the local API.
- Responsive modern dark-mode financial UI.

## Brand Commitments

- Name: StoX
- Aesthetic: Cool, advanced, sophisticated dark financial terminal with neon / subtle gradient accents, crisp typography, and fluid interactions.

## Evidence on Hand

- Greenfield implementation.

## Product Principles

- **Precision at Glance:** Key market movers and stock data immediately visible without clutter.
- **Advanced Depth:** Professional-grade charting, drawing tools, and technical indicators accessible instantly.
- **Fluid Simplicity:** Complex financial data presented with clean hierarchy and zero cognitive friction.

## Accessibility & Inclusion

High contrast dark mode styling, clear visual status badges (green for gains, red for losses), accessible font sizes and keyboard navigation.
