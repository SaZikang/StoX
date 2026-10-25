#!/usr/bin/env python3
"""
StoX News Fetcher using yfinance for instant, high-performance news retrieval
and optimized crisp images.
"""

import sys
import json
import datetime
import re
from urllib.parse import urlparse, unquote
import requests
from bs4 import BeautifulSoup
import yfinance as yf

def fetch_article_from_web(url: str) -> dict:
    if not url:
        return {"success": False, "error": "No URL provided", "fullContent": "", "aiSummary": ""}
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        res = requests.get(url, headers=headers, timeout=6)
        if res.status_code == 200:
            soup = BeautifulSoup(res.text, 'html.parser')
            for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
                script.decompose()
            paragraphs = soup.find_all('p')
            text_paras = [p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 30]
            full_text = "\n\n".join(text_paras) if text_paras else "No readable article paragraphs found at source website."

            sentences = [s.strip() for s in full_text.replace('\n', ' ').split('.') if len(s.strip()) > 20]
            summary_points = sentences[:3]
            ai_summary = f"🤖 AI Deep Summary (Scraped from Original Article): This report details key market movements and strategic updates. Primary takeaways: " + ". ".join(summary_points) + "."

            return {
                "success": True,
                "url": url,
                "fullContent": full_text,
                "aiSummary": ai_summary
            }
    except Exception as e:
        return {"success": False, "error": str(e), "fullContent": "", "aiSummary": ""}
    return {"success": False, "error": "Could not fetch URL", "fullContent": "", "aiSummary": ""}

def extract_high_res_image(item) -> str:
    image_url = None
    thumbnail = item.get('thumbnail')
    if thumbnail and isinstance(thumbnail, dict):
        resolutions = thumbnail.get('resolutions', [])
        if isinstance(resolutions, list) and resolutions:
            valid_res = [r for r in resolutions if isinstance(r, dict) and r.get('url')]
            if valid_res:
                valid_res.sort(key=lambda x: abs(x.get('width', 800) - 800))
                image_url = valid_res[0].get('url')

    if image_url and 'mysterio/api' in image_url:
        match = re.search(r'https?://[^/]+/.+/(https?://.+)', image_url)
        if match:
            image_url = unquote(match.group(1))

    return image_url

def fetch_news_for_ticker(ticker_symbol: str) -> dict:
    ticker_symbol = ticker_symbol.upper().strip()
    symbols_to_fetch = [ticker_symbol]

    if not ticker_symbol or ticker_symbol in ('ALL', 'MARKET', 'GLOBAL'):
        symbols_to_fetch = ['SPY', 'AAPL', 'NVDA']
    elif ',' in ticker_symbol:
        symbols_to_fetch = [s.strip() for s in ticker_symbol.split(',') if s.strip()][:3]

    all_articles_map = {}

    for sym in symbols_to_fetch:
        try:
            search = yf.Search(sym)
            raw_news = getattr(search, 'news', [])

            if not raw_news:
                ticker = yf.Ticker(sym)
                raw_news = getattr(ticker, 'news', []) or []

            for item in raw_news:
                content = item.get('content') if isinstance(item.get('content'), dict) else item
                headline = content.get('title') or item.get('title')
                provider = content.get('provider') or {}
                if not isinstance(provider, dict):
                    provider = {}
                publisher = (
                    provider.get('displayName')
                    or content.get('publisher')
                    or item.get('publisher')
                    or 'Financial News'
                )
                publish_timestamp = content.get('providerPublishTime') or item.get('providerPublishTime') or 0
                publish_date = content.get('pubDate') or item.get('pubDate')

                release_time_str = None
                if publish_timestamp:
                    try:
                        dt = datetime.datetime.fromtimestamp(publish_timestamp, tz=datetime.timezone.utc)
                        release_time_str = dt.strftime('%Y-%m-%d %H:%M:%S UTC')
                    except Exception:
                        release_time_str = 'Recently'
                elif publish_date:
                    try:
                        dt = datetime.datetime.fromisoformat(publish_date.replace('Z', '+00:00'))
                        if dt.tzinfo is None:
                            dt = dt.replace(tzinfo=datetime.timezone.utc)
                        release_time_str = dt.astimezone(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')
                    except Exception:
                        release_time_str = 'Recently'

                canonical_url = content.get('canonicalUrl') or {}
                click_through_url = content.get('clickThroughUrl') or {}
                link = (
                    (canonical_url.get('url') if isinstance(canonical_url, dict) else canonical_url)
                    or (click_through_url.get('url') if isinstance(click_through_url, dict) else click_through_url)
                    or content.get('link')
                    or item.get('link')
                )
                if not isinstance(link, str) or urlparse(link).scheme not in ('http', 'https'):
                    link = None

                summary = (
                    content.get('summary')
                    or content.get('description')
                    or item.get('summary')
                    or item.get('description')
                    or headline
                    or ''
                )

                image_url = extract_high_res_image(item)
                related_tickers = content.get('relatedTickers') or item.get('relatedTickers') or [sym]

                article_id = content.get('id') or item.get('id') or link or f"{sym}-{len(all_articles_map)}"

                if headline and link and link not in all_articles_map:
                    all_articles_map[link] = {
                        "id": article_id,
                        "headline": headline,
                        "publisher": publisher,
                        "release_time": release_time_str or 'Recently',
                        "release_timestamp": publish_timestamp,
                        "summary": summary,
                        "fullContent": summary,
                        "link": link,
                        "image": image_url,
                        "related_tickers": related_tickers,
                        "impact": "positive"
                    }
        except Exception:
            continue

    articles = list(all_articles_map.values())
    articles.sort(key=lambda x: x.get('release_timestamp', 0), reverse=True)

    if not articles and len(symbols_to_fetch) == 1:
        return {
            "ticker": ticker_symbol,
            "success": False,
            "error": f"No news articles found for {ticker_symbol}.",
            "articles": []
        }

    return {
        "ticker": ticker_symbol,
        "success": True,
        "count": len(articles),
        "articles": articles
    }

if __name__ == "__main__":
    ticker = sys.argv[1] if len(sys.argv) > 1 else "AAPL"
    result = fetch_news_for_ticker(ticker)
    print(json.dumps(result, indent=2))
