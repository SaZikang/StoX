"""Monte Carlo simulation engine for analysis_engine (10,000 simulated sessions)."""

import random
import statistics


def split_sessions(bars):
    days = {}
    for b in bars:
        days.setdefault(b["date"], {})[b["slot"]] = b
    return days


def full_sessions(days, before_date):
    full = []
    for d in sorted(days):
        if d >= before_date:
            continue
        s = days[d]
        if len(s) == 78:
            full.append((d, [s[i] for i in range(78)]))
    return full


def build_pool(sessions):
    pool = [[] for _ in range(78)]
    for _, D in sessions:
        for i in range(1, 78):
            pc = D[i - 1]["c"]
            pool[i].append((D[i]["o"] / pc, D[i]["h"] / pc, D[i]["l"] / pc, D[i]["c"] / pc))
    return pool


def run_simulation(bars, entry: float, stop: float, target: float, entry_bar: int, plan_date: str, replays: int = 10000, seed: int = 19, window: int = 2) -> dict:
    days = split_sessions(bars)
    sessions = full_sessions(days, plan_date)
    if len(sessions) < 5:
        sessions = full_sessions(days, "9999-99-99")
    if not sessions:
        dummy_day = [{"slot": i, "o": entry, "h": entry, "l": entry, "c": entry} for i in range(78)]
        sessions = [(plan_date, dummy_day) for _ in range(20)]

    pool = build_pool(sessions)
    rng = random.Random(seed)
    choice = rng.choice

    outcomes = []
    closes = []

    def slot_idx(i):
        return min(77, max(1, i + rng.randint(-window, window)))

    for _ in range(replays):
        p = entry
        outcome = None
        for i in range(entry_bar + 1, 78):
            o, h, l, c = choice(pool[slot_idx(i)])
            hi, lo, cl = p * h, p * l, p * c
            if outcome is None:
                if lo <= stop:
                    outcome = "stop"
                elif hi >= target:
                    outcome = "target"
            p = cl
        outcomes.append(outcome or "close")
        closes.append(p)

    p_target = outcomes.count("target") / replays
    p_stop = outcomes.count("stop") / replays
    p_neither = outcomes.count("close") / replays

    return {
        "replays": replays,
        "seed": seed,
        "p_target": round(p_target, 4),
        "p_stop": round(p_stop, 4),
        "p_neither": round(p_neither, 4),
        "target_first_pct": round(p_target * 100, 1),
        "stop_first_pct": round(p_stop * 100, 1),
        "still_open_pct": round(p_neither * 100, 1),
        "median_close": round(statistics.median(closes), 2)
    }
