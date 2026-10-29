import unittest
import os
import datetime
from analysis_engine import load_chart_data, evaluate_setup, compute_plan, run_simulation, run_backtest, calculate_sizing


class TestAnalysisEngine(unittest.TestCase):
    def setUp(self):
        self.fixture_path = os.path.join(os.path.dirname(__file__), "fixtures", "TSLA-60d5m.json.gz")

    def test_tsla_oct19_2026_example(self):
        self.assertTrue(os.path.exists(self.fixture_path))
        result = load_chart_data("TSLA", offline_path=self.fixture_path)
        self.assertIsNotNone(result)

        # Setup evaluation for Oct 19 2026
        setup_res = evaluate_setup(result, target_date="2026-10-19")
        self.assertEqual(setup_res["status"], "triggered")
        self.assertAlmostEqual(setup_res["opening_range"]["high"], 362.18, places=2)
        self.assertAlmostEqual(setup_res["opening_range"]["low"], 354.47, places=2)

        # Plan calculation
        entry = 364.18
        plan_res = compute_plan(entry, setup_res["opening_range"], target_r=1.0)
        self.assertAlmostEqual(plan_res["entry"], 364.18, places=2)
        self.assertAlmostEqual(plan_res["stop"], 358.32, places=2)
        self.assertAlmostEqual(plan_res["target"], 370.04, places=2)
        self.assertAlmostEqual(plan_res["risk_per_share"], 5.86, places=2)

        # Sizing
        sizing = calculate_sizing(plan_res["entry"], plan_res["risk_per_share"], account_size=5000, max_loss=50)
        self.assertEqual(sizing["shares"], 8)
        self.assertAlmostEqual(sizing["loss_at_stop"], 46.88, places=2)

        # Simulation
        # parse bars to pass to simulation
        meta, bars, _ = load_chart_data("TSLA", offline_path=self.fixture_path), [], {} # We can use data helper or setup helper
        # Let's test simulation with parsed bars
        from analysis_engine.data import utc_of, to_eastern, INTERVAL, OPEN_MIN
        stamps = result.get("timestamp") or []
        q = ((result.get("indicators") or {}).get("quote") or [{}])[0] or {}
        cols = [q.get(k) or [] for k in ("open", "high", "low", "close", "volume")]
        parsed_bars = []
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
            if 0 <= mins < 390:
                parsed_bars.append({
                    "date": local.date().isoformat(),
                    "slot": mins // 5,
                    "o": o, "h": h, "l": l, "c": c, "v": v or 0
                })

        sim_res = run_simulation(parsed_bars, entry=364.18, stop=358.32, target=370.04, entry_bar=8, plan_date="2026-10-19", replays=1000, seed=19)
        self.assertIn("p_target", sim_res)
        self.assertIn("p_stop", sim_res)

        backtest_res = run_backtest(parsed_bars, or_minutes=15, target_r=1.0, plan_date="2026-10-19")
        self.assertIn("signals", backtest_res)
        self.assertIn("win_rate", backtest_res)


if __name__ == "__main__":
    unittest.main()
