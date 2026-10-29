"""Analysis Engine package for StoX / day-trader logic."""

from .data import load_chart_data, DataError
from .setup import evaluate_setup, SetupError
from .plan import compute_plan
from .simulate import run_simulation
from .backtest import run_backtest
from .sizing import calculate_sizing
