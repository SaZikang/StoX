#!/usr/bin/env python3
"""Local HTTP API for StoX's yfinance-backed news feed."""

import sys
import os
import json
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

# Ensure current directory is in sys.path for isolated python execution
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetch_news import fetch_news_for_ticker, fetch_article_from_web


class NewsRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        request = urlparse(self.path)
        if request.path == "/api/article":
            article_url = parse_qs(request.query).get("url", [""])[0].strip()
            if not article_url:
                self._send_json(400, {"success": False, "error": "Provide a valid article URL."})
                return
            result = fetch_article_from_web(article_url)
            self._send_json(200 if result["success"] else 502, result)
            return

        if request.path != "/api/news":
            self.send_error(404)
            return

        ticker = parse_qs(request.query).get("ticker", [""])[0].strip().upper()
        if not ticker:
            ticker = "ALL"
        if not re.fullmatch(r"[A-Z0-9.^-]{1,20}", ticker):
            self._send_json(400, {"success": False, "error": "Provide a valid ticker symbol.", "articles": []})
            return

        result = fetch_news_for_ticker(ticker)
        self._send_json(200 if result["success"] else 502, result)

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8001), NewsRequestHandler)
    print("StoX news API listening on http://127.0.0.1:8001")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping StoX news API.")
    finally:
        server.server_close()
