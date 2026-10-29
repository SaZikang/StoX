"""Trade plan calculator for analysis_engine."""

import math
from decimal import Decimal, ROUND_FLOOR, ROUND_HALF_UP


def D(x):
    if isinstance(x, float):
        return Decimal(repr(x))
    return Decimal(str(x))


def cents(x):
    return D(x).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def floor_cents(x):
    return D(x).quantize(Decimal("0.01"), rounding=ROUND_FLOOR)


def compute_plan(entry: float, opening_range: dict, target_r: float = 1.0, flat_by: str = "15:55") -> dict:
    e = cents(entry)
    oh = cents(opening_range["high"])
    ol = cents(opening_range["low"])

    # Stop at opening-range midpoint
    raw_stop = (oh + ol) / Decimal("2")
    stop = floor_cents(raw_stop)
    if stop >= e:
        stop = floor_cents(ol)  # fallback to low if midpoint is above entry
    if stop >= e:
        stop = cents(e * Decimal("0.99"))

    risk = e - stop
    target = cents(e + D(target_r) * risk)
    reward_risk = ((target - e) / risk).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    return {
        "entry": float(e),
        "stop": float(stop),
        "stop_label": "opening-range midpoint",
        "target": float(target),
        "target_r": float(target_r),
        "target_label": f"{target_r}R",
        "risk_per_share": float(risk),
        "reward_to_risk": float(reward_risk),
        "flat_by": flat_by
    }
