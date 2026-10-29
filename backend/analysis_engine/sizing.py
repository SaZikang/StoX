"""Position sizing module for analysis_engine."""

import math


def calculate_sizing(entry: float, risk_per_share: float, account_size: float = 5000.0, max_loss: float = 50.0) -> dict:
    if risk_per_share <= 0:
        shares = 0
    else:
        shares = int(math.floor(max_loss / risk_per_share))

    # Also cap by account size
    max_shares_by_account = int(math.floor(account_size / entry)) if entry > 0 else 0
    shares = min(shares, max_shares_by_account)
    shares = max(0, shares)

    cost = round(shares * entry, 2)
    loss_at_stop = round(shares * risk_per_share, 2)

    return {
        "shares": shares,
        "cost": cost,
        "loss_at_stop": loss_at_stop,
        "account_size": account_size,
        "max_loss": max_loss
    }
