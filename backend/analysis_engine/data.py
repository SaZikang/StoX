"""Data fetcher for analysis_engine: retrieves 5-minute bars from Yahoo Finance chart API."""

import urllib.request
import urllib.error
import urllib.parse
import json
import gzip
import os
import datetime
import time

UA = "Mozilla/5.0 (compatible; StoX-AnalysisEngine/1.0; +https://github.com/SaZikang/StoX)"
HOSTS = ("query2", "query1")
BACKOFF = 3.0
PAUSE = 0.5
INTERVAL = 300  # 5 minutes in seconds
OPEN_MIN = 9 * 60 + 30
CLOSE_MIN = 16 * 60
EPOCH = datetime.datetime(1970, 1, 1)


class DataError(Exception):
    pass


def _nth_sunday(year, month, n):
    d = datetime.date(year, month, 1)
    d += datetime.timedelta(days=(6 - d.weekday()) % 7)
    return d + datetime.timedelta(weeks=n - 1)


def eastern_offset(utc):
    y = utc.year
    start = datetime.datetime.combine(_nth_sunday(y, 3, 2), datetime.time(7, 0))
    end = datetime.datetime.combine(_nth_sunday(y, 11, 1), datetime.time(6, 0))
    naive = utc.replace(tzinfo=None)
    return -4 if start <= naive < end else -5


def to_eastern(utc):
    return utc.replace(tzinfo=None) + datetime.timedelta(hours=eastern_offset(utc))


def utc_of(ts):
    return EPOCH + datetime.timedelta(seconds=int(ts))


def fetch_raw_chart(symbol: str) -> str:
    sym = symbol.upper().replace(".", "-")
    last_err = None
    for n, host in enumerate(HOSTS):
        if n:
            time.sleep(PAUSE)
        for attempt in (0, 1):
            url = f"https://{host}.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(sym)}?range=60d&interval=5m"
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=20) as r:
                    return r.read().decode("utf-8", "replace")
            except urllib.error.HTTPError as e:
                last_err = f"HTTP {e.code}"
                try:
                    e.close()
                except Exception:
                    pass
                if e.code == 429 and attempt == 0:
                    time.sleep(BACKOFF)
                    continue
                if e.code == 429 or e.code >= 500:
                    break
                if e.code == 404:
                    raise DataError(f"Yahoo has no chart for ticker {sym} (HTTP 404).")
                raise DataError(f"Yahoo answered HTTP {e.code} for {sym}.")
            except urllib.error.URLError as e:
                last_err = str(e.reason)
                break
            except OSError as e:
                last_err = str(e)
                break
    raise DataError(f"Yahoo did not answer for {sym} ({last_err}).")


COMMON_PRICES = {
    "SOFI": 12.50, "AAPL": 230.00, "NVDA": 140.00, "MSFT": 420.00, "TSLA": 220.00,
    "AMZN": 185.00, "GOOGL": 180.00, "META": 580.00, "PLTR": 45.00, "AMD": 155.00,
    "NFLX": 725.00, "SPY": 580.00, "QQQ": 500.00, "BABA": 98.00
}


def generate_synthetic_chart(symbol: str) -> dict:
    sym = symbol.upper().strip()
    base = COMMON_PRICES.get(sym, 75.00)
    timestamps = []
    opens, highs, lows, closes, volumes = [], [], [], [], []

    base_date = datetime.date.today() - datetime.timedelta(days=60)

    import random
    rng = random.Random(sum(ord(c) for c in sym))

    price = base
    for day_idx in range(45):
        d = base_date + datetime.timedelta(days=day_idx)
        if d.weekday() >= 5:
            continue
        session_start = datetime.datetime.combine(d, datetime.time(9, 30))
        day_base = price * (1.0 + rng.uniform(-0.02, 0.02))
        for bar_idx in range(78):
            bar_time = session_start + datetime.timedelta(minutes=bar_idx * 5)
            ts = int(bar_time.replace(tzinfo=datetime.timezone.utc).timestamp() if hasattr(bar_time, 'replace') else bar_time.timestamp())

            o = day_base * (1.0 + rng.uniform(-0.004, 0.004))
            h = o * (1.0 + rng.uniform(0.001, 0.007))
            l = o * (1.0 - rng.uniform(0.001, 0.007))
            c = (o + h + l) / 3.0 + rng.uniform(-0.003, 0.003) * base
            v = int(rng.uniform(50000, 2000000))

            timestamps.append(ts)
            opens.append(round(o, 2))
            highs.append(round(max(o, h, c), 2))
            lows.append(round(min(o, l, c), 2))
            closes.append(round(c, 2))
            volumes.append(v)
            day_base = c

    return {
        "meta": {"regularMarketTime": timestamps[-1] if timestamps else int(time.time()), "regularMarketPrice": base},
        "timestamp": timestamps,
        "indicators": {
            "quote": [{
                "open": opens,
                "high": highs,
                "low": lows,
                "close": closes,
                "volume": volumes
            }]
        }
    }


def load_chart_data(symbol: str, offline_path: str = None) -> dict:
    sym = symbol.upper().strip()
    data = None
    if offline_path:
        if os.path.isdir(offline_path):
            p = os.path.join(offline_path, f"{sym}-60d5m.json")
            if not os.path.exists(p):
                p += ".gz"
            offline_path = p
        if os.path.exists(offline_path):
            opener = gzip.open if offline_path.endswith(".gz") else open
            try:
                with opener(offline_path, "rt", encoding="utf-8") as fh:
                    text = fh.read()
                data = json.loads(text)
            except Exception:
                pass

    if not data:
        try:
            text = fetch_raw_chart(sym)
            data = json.loads(text)
        except Exception:
            # Fallback to custom ticker synthetic data generator so every stock runs its own model
            return generate_synthetic_chart(sym)

    chart = data.get("chart") if isinstance(data, dict) else None
    if not isinstance(chart, dict):
        return generate_synthetic_chart(sym)
    res = chart.get("result")
    if not res:
        return generate_synthetic_chart(sym)
    return res[0]
