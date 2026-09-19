

import numpy as np
import pandas as pd
import joblib

FRAUD_FEATURES = ['cost_zscore', 'image_missing_flag', 'vendor_concentration_score',
                   'disbursement_gap_pct', 'funds_exhausted_not_completed_flag']
INEFF_FEATURES = ['stuck_days', 'is_sanctioned_flag']

SCENARIOS = {
    'cost_spike': {'cost_zscore': 8.0},
    'missing_image_only': {'image_missing_flag': 1},
    'vendor_monopoly': {'vendor_concentration_score': 6.0},
    'fund_diversion': {'disbursement_gap_pct': 70.0, 'image_missing_flag': 1},
    'funds_exhausted_stalled': {'funds_exhausted_not_completed_flag': 1},
    'combined_severe_fraud': {'cost_zscore': 6.0, 'image_missing_flag': 1,
                               'vendor_concentration_score': 5.5, 'disbursement_gap_pct': 60.0},
    'long_stagnation': {'stuck_days': 900, 'is_sanctioned_flag': 0},
}


def tier(score):
    if score >= 70:
        return 'High'
    elif score >= 40:
        return 'Medium'
    return 'Low'


def main():
    print("=" * 70)
    print("SYNTHETIC ANOMALY VALIDATION")
    print("=" * 70)

    models = joblib.load('trained_anomaly_model.pkl')
    fraud_model = models['fraud_model']
    ineff_model = models['ineff_model']
    df = pd.read_csv('mplads_final_scored_works.csv')

    def fraud_score(feat_df):
        raw = -fraud_model.score_samples(feat_df[FRAUD_FEATURES])
        ref_raw = -fraud_model.score_samples(df[FRAUD_FEATURES])
        return ((raw - ref_raw.min()) / (ref_raw.max() - ref_raw.min()) * 100).clip(0, 100).round(1)

    def ineff_score(feat_df):
        raw = -ineff_model.score_samples(feat_df[INEFF_FEATURES])
        ref_raw = -ineff_model.score_samples(df[INEFF_FEATURES])
        return ((raw - ref_raw.min()) / (ref_raw.max() - ref_raw.min()) * 100).clip(0, 100).round(1)

    
    print("\n[TEST 1] False-positive check on already-clean rows")
    clean_sample = df[(df['fraud_risk_tier'] == 'Low')].sample(500, random_state=42)
    rescored = fraud_score(clean_sample)
    fp_rate = (rescored >= 40).mean() * 100
    print(f"  500 known-Low rows re-scored -> {fp_rate:.1f}% now show Medium/High (should be ~0%)")

    
    print("\n[TEST 2] Synthetic fraud injection (recall proxy)")
    base_clean = df[df['fraud_risk_tier'] == 'Low'].sample(200, random_state=1).reset_index(drop=True)

    results = []
    for name, overrides in SCENARIOS.items():
        injected = base_clean.copy()
        for col, val in overrides.items():
            injected[col] = val

        if set(overrides.keys()) & set(FRAUD_FEATURES):
            scores = fraud_score(injected)
            model_used = 'fraud'
        else:
            scores = ineff_score(injected)
            model_used = 'inefficiency'

        caught = (scores >= 40).mean() * 100
        caught_high = (scores >= 70).mean() * 100
        results.append((name, model_used, caught, caught_high))
        print(f"  {name:24s} [{model_used:12s}] -> {caught:5.1f}% flagged Medium+ | {caught_high:5.1f}% flagged High")

    print("\n" + "=" * 70)
    print("INTERPRETATION")
    print("=" * 70)
    print("""
  - Test 1 tells you the false-positive rate on data we already trust is clean.
  - Test 2 tells you: IF a fraud pattern like this existed in the real data,
    would our model actually catch it? Low catch-rate on any scenario above
    means that fraud TYPE is currently invisible to the model, no matter how
    confident the risk_score looks elsewhere.
  - This is a MECHANICAL validation, not a real-world validation. It proves
    the model responds correctly to known patterns. It does NOT prove any of
    the works currently flagged 'High' in your dataset are actually fraud —
    only a human domain expert reviewing real cases can tell you that.
""")

    results_df = pd.DataFrame(results, columns=['scenario', 'model', 'pct_flagged_medium_plus', 'pct_flagged_high'])
    results_df.to_csv('validation_results.csv', index=False)
    print("Saved: validation_results.csv")


if __name__ == "__main__":
    main()
