"""Opening-range breakout detection setup for analysis_engine."""

import datetime
from .data import to_eastern, utc_of, INTERVAL, OPEN_MIN, CLOSE_MIN


class SetupError(Exception):
    pass


def evaluate_setup(result: dict, target_date: str = None, or_minutes: int = 15, now_utc: datetime.datetime = None) -> dict:
    meta = result.get("meta") or {}
    stamps = result.get("timestamp") or []
    q = ((result.get("indicators") or {}).get("quote") or [{}])[0] or {}
    cols = [q.get(k) or [] for k in ("open", "high", "low", "close", "volume")]

    now_utc = now_utc or datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
    rmt = meta.get("regularMarketTime")
    as_of = utc_of(rmt) if isinstance(rmt, (int, float)) and utc_of(rmt) < now_utc else now_utc

    bars_by_date = {}
    for i, ts in enumerate(stamps):
        o, h, l, c, v = [col[i] if i < len(col) else None for col in cols]
        if ts is None or None in (o, h, l, c):
            continue
        ts = int(ts)
        if ts % INTERVAL:
            continue
        start = utc_of(ts)
        local = to_eastern(start)
        mins = local.hour * 60 + local.minute - OPEN_MIN
        if mins < 0 or mins >= 390:
            continue
        if start + datetime.timedelta(seconds=INTERVAL) > as_of:
            continue  # incomplete bar
        d_str = local.date().isoformat()
        slot = mins // 5
        bars_by_date.setdefault(d_str, {})[slot] = {
            "slot": slot,
            "start": local.strftime("%H:%M"),
            "o": o, "h": h, "l": l, "c": c, "v": v or 0
        }

    if not bars_by_date:
        return {"status": "no_setup", "reason": "No complete session bars available.", "opening_range": None, "trigger": None}

    eval_date = target_date or max(bars_by_date.keys())
    day_bars = bars_by_date.get(eval_date)
    if not day_bars or len(day_bars) < 3:
        return {"status": "no_setup", "reason": f"Insufficient bars for date {eval_date}.", "opening_range": None, "trigger": None}

    n_or = or_minutes // 5
    or_slots = [i for i in range(n_or) if i in day_bars]
    if not or_slots:
        return {"status": "no_setup", "reason": "Opening range bars missing.", "opening_range": None, "trigger": None}

    or_rows = [day_bars[i] for i in or_slots]
    oh = max(b["h"] for b in or_rows)
    ol = min(b["l"] for b in or_rows)
    opening_range = {"high": round(oh, 2), "low": round(ol, 2), "minutes": or_minutes}

    # Check breakout in bars after opening range (slot >= n_or)
    trigger = None
    status = "waiting"
    reason = "Opening range set; waiting for breakout close above high."

    for slot in sorted(day_bars.keys()):
        if slot < n_or:
            continue
        b = day_bars[slot]
        if b["c"] > oh:
            trigger = {
                "time": b["start"],
                "bar_index": slot,
                "price": round(b["c"], 2),
                "volume": b["v"]
            }
            status = "triggered"
            reason = f"Closed above opening range high at {b['start']} ET."
            break

    if status == "waiting" and max(day_bars.keys()) >= 77:
        status = "expired"
        reason = "Session ended without breakout close above range high."

    return {
        "status": status,
        "date": eval_date,
        "reason": reason,
        "opening_range": opening_range,
        "trigger": trigger,
        "all_bars_count": len(day_bars)
    }
