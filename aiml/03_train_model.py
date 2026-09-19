

import re
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest

MP_COLUMN = "Hon'ble Members of Parliament"
MIN_GROUP_SIZE = 5  # minimum samples needed before we trust a cost baseline


def normalize_text(s):
    s = str(s).lower()
    s = re.sub(r'[^a-z0-9 ]', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    return s



def build_cost_baseline(merged):
    global_median = merged['recommended_amount'].median()
    global_std = merged['recommended_amount'].std()

    state_stats = (merged.groupby(['work_type', 'State'])['recommended_amount']
                   .agg(['median', 'std', 'count']).reset_index())
    state_stats.columns = ['work_type', 'State', 'state_median', 'state_std', 'state_count']

    cat_stats = (merged.groupby('work_type')['recommended_amount']
                 .agg(['median', 'std', 'count']).reset_index())
    cat_stats.columns = ['work_type', 'cat_median', 'cat_std', 'cat_count']

    merged = merged.merge(state_stats, on=['work_type', 'State'], how='left')
    merged = merged.merge(cat_stats, on='work_type', how='left')

    use_state = merged['state_count'] >= MIN_GROUP_SIZE
    use_cat = (~use_state) & (merged['cat_count'] >= MIN_GROUP_SIZE)

    merged['baseline_median'] = np.where(
        use_state, merged['state_median'],
        np.where(use_cat, merged['cat_median'], global_median))
    merged['baseline_std'] = np.where(
        use_state, merged['state_std'],
        np.where(use_cat, merged['cat_std'], global_std))
    merged['baseline_level'] = np.where(
        use_state, 'state+category',
        np.where(use_cat, 'category-only', 'global-fallback'))

    merged['cost_zscore'] = (
        (merged['recommended_amount'] - merged['baseline_median'])
        / pd.Series(merged['baseline_std']).replace(0, np.nan)
    ).fillna(0)

    merged.drop(columns=['state_median', 'state_std', 'state_count',
                          'cat_median', 'cat_std', 'cat_count'], inplace=True)
    return merged


def build_features(merged, comp, exp):
    merged = build_cost_baseline(merged)
    merged['is_sanctioned_flag'] = merged['is_sanctioned'].astype(int)

    # Missing photo-evidence — only meaningful for completed works
    img_map = comp[['work_id', 'image_missing', 'amount_disbursed']].drop_duplicates('work_id')
    merged = merged.merge(img_map, on='work_id', how='left')
    merged['is_completed'] = merged['image_missing'].notna()
    merged['image_missing_flag'] = merged['image_missing'].fillna(False).astype(int)
    merged.drop(columns=['image_missing'], inplace=True)

    
    all_dates = pd.concat([
        merged['recommended_date'], merged['sanction_date'],
        comp['completion_date'],
        pd.to_datetime(exp['Expenditure Date'], errors='coerce', dayfirst=True)
    ])
    as_of_date = all_dates.max()

    stuck_days = np.where(
        merged['is_completed'], 0,
        np.where(
            merged['is_sanctioned'],
            (as_of_date - merged['sanction_date']).dt.days,   # stuck in execution
            (as_of_date - merged['recommended_date']).dt.days  # stuck in sanctioning
        )
    )
    merged['stuck_days'] = stuck_days
    merged['delay_feature'] = merged['sanction_delay_days'].fillna(merged['stuck_days'])

  
    merged['disbursement_gap_pct'] = np.where(
        merged['is_completed'],
        ((merged['recommended_amount'] - merged['amount_disbursed'])
         / merged['recommended_amount'] * 100).clip(lower=0).fillna(0),
        0
    )


    exp_norm = exp[['work_id', 'Vendor Name']].copy()
    exp_norm['vendor_key'] = exp_norm['Vendor Name'].apply(normalize_text)
    vendor_totals = exp_norm.groupby('vendor_key')['work_id'].nunique().rename('vendor_total_works')
    exp_vendor = exp_norm.merge(vendor_totals, on='vendor_key', how='left')
    worst_vendor_per_work = exp_vendor.groupby('work_id')['vendor_total_works'].max()
    merged = merged.merge(worst_vendor_per_work.rename('vendor_total_works'), on='work_id', how='left')

    merged['vendor_data_available'] = merged['vendor_total_works'].notna().astype(int)
    known_scores = np.log1p(merged.loc[merged['vendor_data_available'] == 1, 'vendor_total_works'])
    neutral_fill = float(known_scores.median()) if len(known_scores) else 0.0
    merged['vendor_concentration_score'] = np.where(
        merged['vendor_data_available'] == 1,
        np.log1p(merged['vendor_total_works'].fillna(0)),
        neutral_fill
    )
    merged['vendor_total_works'] = merged['vendor_total_works'].fillna(0)

    
    total_disbursed = exp.groupby('work_id')['fund_disbursed'].sum().rename('total_disbursed_so_far')
    merged = merged.merge(total_disbursed, on='work_id', how='left')
    merged['spent_pct_of_recommended'] = (
        merged['total_disbursed_so_far'] / merged['recommended_amount'] * 100
    ).fillna(0)
    merged['funds_exhausted_not_completed_flag'] = (
        (~merged['is_completed']) & (merged['spent_pct_of_recommended'] >= 90)
    ).astype(int)

 
    merged['desc_norm'] = merged['Work description'].apply(normalize_text)
    rep_key = [MP_COLUMN, 'Constituency', 'desc_norm', 'recommended_amount']
    merged['repetition_count'] = merged.groupby(rep_key)['work_id'].transform('count')
    merged.drop(columns=['desc_norm'], inplace=True)

    return merged



def train_models(merged):
    fraud_features = merged[[
        'cost_zscore', 'image_missing_flag', 'vendor_concentration_score',
        'disbursement_gap_pct', 'funds_exhausted_not_completed_flag'
    ]].copy()
    ineff_features = merged[['stuck_days', 'is_sanctioned_flag']].copy()

    fraud_model = IsolationForest(contamination='auto', random_state=42, n_estimators=200)
    ineff_model = IsolationForest(contamination='auto', random_state=42, n_estimators=200)
    fraud_model.fit(fraud_features)
    ineff_model.fit(ineff_features)

    def scale(raw):
        return ((raw - raw.min()) / (raw.max() - raw.min()) * 100).round(1)

    merged['fraud_risk_score'] = scale(-fraud_model.score_samples(fraud_features))
    merged['inefficiency_score'] = scale(-ineff_model.score_samples(ineff_features))

    def tier(score):
        if score >= 70:
            return 'High'
        elif score >= 40:
            return 'Medium'
        return 'Low'

    merged['fraud_risk_tier'] = merged['fraud_risk_score'].apply(tier)
    merged['inefficiency_tier'] = merged['inefficiency_score'].apply(tier)

    return merged, fraud_model, ineff_model


def data_confidence(row):
    """How much real corroborating evidence backs this score (0-100)."""
    signals = 1  # cost/delay features are always computed
    signals += 1 if row['is_completed'] else 0
    signals += int(row['vendor_data_available'])
    return round(signals / 3 * 100)


def generate_reasons(row):
    """Reasons ranked by actual magnitude, not a fixed if/elif chain."""
    scored = []

    if abs(row['cost_zscore']) > 2.5:
        direction = "higher" if row['cost_zscore'] > 0 else "lower"
        scored.append((abs(row['cost_zscore']),
            f"Cost is unusually {direction} than comparable works "
            f"({row['baseline_level']} baseline, z={row['cost_zscore']:.1f})"))

    if row['is_completed'] and row['image_missing_flag'] == 1:
        scored.append((2.5, "Marked completed but no photo evidence uploaded"))

    if row['is_completed'] and row['disbursement_gap_pct'] >= 30:
        scored.append((row['disbursement_gap_pct'] / 10,
            f"Marked completed but only {100 - row['disbursement_gap_pct']:.0f}% of recommended "
            f"funds were disbursed — check for incomplete work or fund diversion"))

    if row['funds_exhausted_not_completed_flag'] == 1:
        scored.append((row['spent_pct_of_recommended'] / 10,
            f"{row['spent_pct_of_recommended']:.0f}% of funds spent but work not completed "
            f"(same pattern as a confirmed CAG-audited case)"))

    if row['vendor_data_available'] == 1 and row['vendor_total_works'] >= 50:
        scored.append((row['vendor_concentration_score'],
            f"Vendor unusually concentrated — {int(row['vendor_total_works'])} works nationwide "
            f"(needs manual favoritism/collusion review)"))
    elif row['vendor_data_available'] == 0:
        scored.append((0.1, "No payment record yet — vendor pattern unverified"))

    if row['repetition_count'] >= 10:
        scored.append((0.5, f"{int(row['repetition_count'])} works share identical "
                             f"description+amount under this MP/constituency — review for duplicate billing "
                             f"(may be legitimate bulk procurement)"))

    scored.sort(key=lambda x: -x[0])
    fraud_reason = "; ".join(r[1] for r in scored[:3]) if scored else "No strong fraud signal"

    ineff = []
    if row['is_completed']:
        ineff.append("Completed — no execution backlog")
    elif not row['is_sanctioned']:
        ineff.append(f"Stuck at sanctioning stage for {int(row['stuck_days'])} days since recommendation")
    elif row['stuck_days'] > 365:
        ineff.append(f"Sanctioned but stuck in execution for {int(row['stuck_days'])} days (>1 year, no completion)")
    elif row['stuck_days'] > 150:
        ineff.append(f"Sanctioned but stuck in execution for {int(row['stuck_days'])} days")
    ineff_reason = "; ".join(ineff) if ineff else "No delay concern"

    return pd.Series({'fraud_reason': fraud_reason, 'inefficiency_reason': ineff_reason})


def compliance_flags(row):
    
    flags = []
    if row['is_completed'] and row['image_missing_flag'] == 1:
        flags.append("No photo evidence on record for a completed work")
    if row['is_completed'] and row['disbursement_gap_pct'] >= 30:
        flags.append(f"Only {100 - row['disbursement_gap_pct']:.0f}% of recommended funds disbursed despite completion")
    if row['vendor_data_available'] == 1 and row['vendor_total_works'] >= 50:
        flags.append(f"Vendor handled {int(row['vendor_total_works'])} works nationwide — concentration review required")
    if abs(row['cost_zscore']) >= 3:
        flags.append("Cost more than 3 standard deviations from comparable works")
    if row['funds_exhausted_not_completed_flag'] == 1:
        flags.append(f"{row['spent_pct_of_recommended']:.0f}% of funds already spent but work not completed "
                     f"(matches confirmed CAG-audited waste pattern — Report 22/2025, Para 3.1)")
    return "; ".join(flags) if flags else ""


def main():
    print("=" * 70)
    print("MODEL TRAINING v2 — judge-mode revision")
    print("=" * 70)

    print("\n[1/6] Loading Step 1 output")
    try:
        merged = pd.read_pickle('step1_merged_output.pkl')
        comp = pd.read_pickle('step1_completed_output.pkl')
        exp = pd.read_pickle('step1_expenditure_output.pkl')
    except FileNotFoundError:
        print("\n❌ Step 1 output files NOT FOUND. Run 01_data_pipeline.py first.\n")
        return
    print(f"  ✅ {len(merged)} works loaded")

    print("\n[2/6] Building features (hierarchical cost baseline, vendor, image, repetition)")
    merged = build_features(merged, comp, exp)
    print(f"  Baseline level used: {merged['baseline_level'].value_counts().to_dict()}")
    print(f"  Vendor data available for: {merged['vendor_data_available'].mean()*100:.1f}% of works")

    print("\n[3/6] Training separate FRAUD and INEFFICIENCY models")
    merged, fraud_model, ineff_model = train_models(merged)
    print("  ✅ Both models trained")

    print("\n[4/6] Generating ranked, magnitude-based explanations")
    merged[['fraud_reason', 'inefficiency_reason']] = merged.apply(generate_reasons, axis=1)
    merged['data_confidence'] = merged.apply(data_confidence, axis=1)
    merged['compliance_flags'] = merged.apply(compliance_flags, axis=1)
    merged['compliance_flag_count'] = merged['compliance_flags'].apply(lambda s: 0 if s == "" else len(s.split("; ")))

    
    merged['needs_fraud_review'] = (
        (merged['fraud_risk_tier'] == 'High') | (merged['compliance_flag_count'] > 0)
    )

    print("\n[5/6] Saving model + scored data")
    joblib.dump({'fraud_model': fraud_model, 'ineff_model': ineff_model}, 'trained_anomaly_model.pkl')
    merged.to_csv('mplads_final_scored_works.csv', index=False)

    print("\n[6/6] Summary")
    print("=" * 70)
    print("\n📊 FRAUD RISK DISTRIBUTION:")
    print(merged['fraud_risk_tier'].value_counts().to_string())
    print("\n📊 INEFFICIENCY DISTRIBUTION:")
    print(merged['inefficiency_tier'].value_counts().to_string())

    print(f"\n📊 NEEDS_FRAUD_REVIEW (statistical High OR any compliance rule tripped): "
          f"{merged['needs_fraud_review'].sum()} works ({merged['needs_fraud_review'].mean()*100:.1f}%)")
    print(f"   (Separately, inefficiency_tier=='High' covers pure administrative "
          f"stagnation — {(merged['inefficiency_tier']=='High').sum()} works — that's a different queue for a different team)")

    print("\n🔝 TOP 5 FRAUD-RISK CASES:\n")
    top5 = merged.sort_values('fraud_risk_score', ascending=False).head(5)
    for _, row in top5.iterrows():
        print(f"  MP: {row[MP_COLUMN]} | {row['State']} | Fraud risk: {row['fraud_risk_score']}/100 "
              f"| Confidence: {row['data_confidence']}%")
        print(f"    {row['fraud_reason']}")
        print()

    print("Files saved:")
    print("  - trained_anomaly_model.pkl      <- dict with fraud_model + ineff_model")
    print("  - mplads_final_scored_works.csv  <- dashboard-ready data\n")


if __name__ == "__main__":
    main()