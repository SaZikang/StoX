"""Backtest engine for analysis_engine (historical rule replay)."""

from .simulate import split_sessions, full_sessions


def opening_range(D, n):
    rows = [D[i] for i in range(n)]
    return max(b["h"] for b in rows), min(b["l"] for b in rows)


def run_backtest(bars, or_minutes: int = 15, target_r: float = 1.0, plan_date: str = None) -> dict:
    days = split_sessions(bars)
    sessions = full_sessions(days, plan_date or "9999-99-99")
    if not sessions:
        sessions = full_sessions(days, "9999-99-99")

    n = or_minutes // 5
    trades = []
    wins = 0
    losses = 0
    neither = 0

    for d, D in sessions:
        if len(D) < 78:
            continue
        oh, ol = opening_range(D, n)
        # Find first breakout bar after opening range
        kk = next((i for i in range(n, 78) if D[i]["c"] > oh), None)
        if kk is None:
            continue
        e = round(D[kk]["c"], 2)
        s = round((oh + ol) / 2.0, 2)
        if s >= e:
            s = round(ol, 2)
        if s >= e:
            s = round(e * 0.99, 2)
        risk = e - s
        if risk <= 0:
            continue
        t = round(e + target_r * risk, 2)

        oc = None
        for b in D[kk + 1:]:
            if b["l"] <= s:
                oc = "stop"
                break
            if b["h"] >= t:
                oc = "target"
                break
        if oc == "target":
            wins += 1
        elif oc == "stop":
            losses += 1
        else:
            neither += 1
        trades.append({"date": d, "outcome": oc or "close"})

    total_signals = len(trades)
    win_rate = round((wins / total_signals * 100), 1) if total_signals > 0 else 0.0

    return {
        "sessions": len(sessions),
        "signals": total_signals,
        "wins": wins,
        "losses": losses,
        "neither": neither,
        "win_rate": win_rate
    }
