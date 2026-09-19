

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, classification_report
)

MP_COL = "Hon'ble Members of Parliament"

EARLY_NUMERIC_FEATURES = [
    'recommended_amount', 'cost_zscore', 'sanction_delay_days',
    'is_sanctioned_flag', 'vendor_concentration_score', 'vendor_data_available',
]

ENCODED_FEATURES = ['mp_history_rate', 'state_history_rate', 'worktype_history_rate', 'district_history_rate']
FEATURE_COLS = EARLY_NUMERIC_FEATURES + ENCODED_FEATURES



def leave_one_out_encode(df, group_col, target_col, min_samples_shrinkage=10):
    global_mean = df[target_col].mean()
    grp = df.groupby(group_col)[target_col].agg(['sum', 'count'])
    grp = grp.reindex(df[group_col]).reset_index(drop=True)

    loo_sum = grp['sum'].values - df[target_col].values
    loo_count = grp['count'].values - 1

    weight = loo_count / (loo_count + min_samples_shrinkage)
    loo_rate = np.where(loo_count > 0, loo_sum / np.maximum(loo_count, 1), global_mean)
    encoded = weight * loo_rate + (1 - weight) * global_mean
    return encoded, global_mean


def build_encoding_map(df, group_col, target_col, min_samples_shrinkage=10):
    """For applying to data NOT used to build the encoding (test fold, or
    ongoing works) — plain shrunk average per category, no leave-one-out
    needed since these rows were never part of computing it."""
    global_mean = df[target_col].mean()
    grp = df.groupby(group_col)[target_col].agg(['mean', 'count'])
    weight = grp['count'] / (grp['count'] + min_samples_shrinkage)
    shrunk = weight * grp['mean'] + (1 - weight) * global_mean
    return shrunk.to_dict(), global_mean


def apply_encoding_maps(df, mp_map, mp_global, state_map, state_global, wt_map, wt_global,
                         district_map, district_global):
    df = df.copy()
    df['mp_history_rate'] = df[MP_COL].map(mp_map).fillna(mp_global)
    df['state_history_rate'] = df['State'].map(state_map).fillna(state_global)
    df['worktype_history_rate'] = df['work_type'].map(wt_map).fillna(wt_global)
    df['district_history_rate'] = df['district'].map(district_map).fillna(district_global)
    return df


def main():
    print("=" * 70)
    print("EARLY WARNING MODEL — trained on real completed-work outcomes")
    print("=" * 70)

    df = pd.read_csv('mplads_final_scored_works.csv')
    df['district'] = df['IDA'].str.extract(r'^([^(]+)')[0].str.strip()  # "DHARWAD(...)" -> "DHARWAD"
    completed = df[df['is_completed'] == True].copy().reset_index(drop=True)
    ongoing = df[df['is_completed'] == False].copy().reset_index(drop=True)

    completed['target'] = (
        (completed['image_missing_flag'] == 1) | (completed['disbursement_gap_pct'] >= 30)
    ).astype(int)

    print(f"\nTraining set: {len(completed)} completed works")
    print(f"  Base rate (ended up flagged): {completed['target'].mean()*100:.1f}%")
    print(f"Will be applied to: {len(ongoing)} ongoing works")

    
    print("\n[1/4] Train/test split (80/20), then encoding computed on train fold only")
    train_df, test_df = train_test_split(
        completed, test_size=0.2, random_state=42, stratify=completed['target']
    )

    train_df = train_df.copy()
    train_df['mp_history_rate'], mp_global = leave_one_out_encode(train_df, MP_COL, 'target')
    train_df['state_history_rate'], state_global = leave_one_out_encode(train_df, 'State', 'target')
    train_df['worktype_history_rate'], wt_global = leave_one_out_encode(train_df, 'work_type', 'target')
    train_df['district_history_rate'], district_global = leave_one_out_encode(train_df, 'district', 'target')

    mp_map, _ = build_encoding_map(train_df, MP_COL, 'target')
    state_map, _ = build_encoding_map(train_df, 'State', 'target')
    wt_map, _ = build_encoding_map(train_df, 'work_type', 'target')
    district_map, _ = build_encoding_map(train_df, 'district', 'target')

    test_df = apply_encoding_maps(test_df, mp_map, mp_global, state_map, state_global, wt_map, wt_global,
                                   district_map, district_global)

    X_train, y_train = train_df[FEATURE_COLS].fillna(0), train_df['target']
    X_test, y_test = test_df[FEATURE_COLS].fillna(0), test_df['target']

    print("\n[2/4] Training and evaluating on held-out test fold")
    eval_model = RandomForestClassifier(
        n_estimators=300, max_depth=8, min_samples_leaf=15,
        class_weight='balanced', random_state=42
    )
    eval_model.fit(X_train, y_train)
    y_pred = eval_model.predict(X_test)
    y_proba = eval_model.predict_proba(X_test)[:, 1]

    print(f"  Accuracy:  {accuracy_score(y_test, y_pred):.3f}")
    print(f"  Precision: {precision_score(y_test, y_pred):.3f}")
    print(f"  Recall:    {recall_score(y_test, y_pred):.3f}")
    print(f"  F1:        {f1_score(y_test, y_pred):.3f}")
    print(f"  ROC-AUC:   {roc_auc_score(y_test, y_proba):.3f}")
    print("\n  Full report:")
    print("  " + classification_report(y_test, y_pred).replace("\n", "\n  "))

    print("  Feature importance:")
    for feat, imp in sorted(zip(FEATURE_COLS, eval_model.feature_importances_), key=lambda x: -x[1]):
        print(f"    {feat:24s} {imp:.3f}")

    
    print("\n[3/4] Retraining final model on all completed works")
    completed_encoded = completed.copy()
    completed_encoded['mp_history_rate'], mp_global_full = leave_one_out_encode(completed_encoded, MP_COL, 'target')
    completed_encoded['state_history_rate'], state_global_full = leave_one_out_encode(completed_encoded, 'State', 'target')
    completed_encoded['worktype_history_rate'], wt_global_full = leave_one_out_encode(completed_encoded, 'work_type', 'target')
    completed_encoded['district_history_rate'], district_global_full = leave_one_out_encode(completed_encoded, 'district', 'target')

    X_final = completed_encoded[FEATURE_COLS].fillna(0)
    y_final = completed_encoded['target']

    final_model = RandomForestClassifier(
        n_estimators=300, max_depth=8, min_samples_leaf=15,
        class_weight='balanced', random_state=42
    )
    final_model.fit(X_final, y_final)


    mp_map_full, _ = build_encoding_map(completed, MP_COL, 'target')
    state_map_full, _ = build_encoding_map(completed, 'State', 'target')
    wt_map_full, _ = build_encoding_map(completed, 'work_type', 'target')
    district_map_full, _ = build_encoding_map(completed, 'district', 'target')

    print("\n[4/4] Scoring ongoing works")
    ongoing = apply_encoding_maps(
        ongoing, mp_map_full, mp_global_full, state_map_full, state_global_full,
        wt_map_full, wt_global_full, district_map_full, district_global_full
    )
    X_ongoing = ongoing[FEATURE_COLS].fillna(0)
    ongoing['early_warning_score'] = (final_model.predict_proba(X_ongoing)[:, 1] * 100).round(1)

    output_cols = [
        'work_id', MP_COL, 'State', 'Constituency', 'work_type',
        'recommended_amount', 'is_sanctioned', 'stuck_days', 'early_warning_score'
    ]
    result = ongoing[output_cols].sort_values('early_warning_score', ascending=False)
    result.to_csv('early_warning_scored_ongoing_works.csv', index=False)

    print(f"\nSaved: early_warning_scored_ongoing_works.csv ({len(result)} ongoing works)")
    print("\nTop 5 highest early-warning-score ongoing works (watch list):")
    for _, r in result.head(5).iterrows():
        print(f"  {r[MP_COL]} ({r['State']}) — {r['early_warning_score']}% predicted risk of ending up flagged")
        print(f"    work_id: {r['work_id']} | stuck {int(r['stuck_days'])} days | {r['work_type'][:50]}")

    print("\n" + "=" * 70)
    print("IMPORTANT: label this on the dashboard as 'Early Warning Score' or")
    print("'Predicted Compliance Risk' — NEVER as a dated forecast ('risk in 30")
    print("days'). This model has no time component; it's a probability based")
    print("on how similar historical works turned out, not a trajectory.")
    print("=" * 70)


if __name__ == "__main__":
    main()
