"""
07_action_queue.py — AI-Prioritized Action Queue

NOT a new ML model. A deterministic RULE + RANKING engine built on top of
signals we already computed and validated (fraud_reason, compliance_flags,
fraud_risk_score, early_warning_score). It answers a different question
than the model does: not "is this risky" (already answered) but
"what specific action should a human take, and in what order."

THREE ENGINE COMPONENTS:

  1. ACTION-TYPE MAPPING (rule-based, deterministic)
     Converts a work's specific fraud_reason text into ONE concrete verb —
     Inspect / Verify Payment / Review Estimate / Audit Vendor / Investigate.
     Same priority-ordering discipline as generate_reasons() in
     03_train_model.py: check the most specific/severe condition first.

  2. PRIORITY SCORE (ranking only — does not change WHAT action is taken,
     only what ORDER the queue is worked in)
        priority = fraud_risk_score
                 + (compliance_flag_count * 5)      # each independent
                                                       violation adds real
                                                       weight, not just one
                 + (data_confidence - 50) * 0.2       # a well-evidenced
                                                       flag deserves to be
                                                       worked before an
                                                       unverified one

  3. ROUTING (which stakeholder role owns this action type)
     Inspect          -> District Authority (closest to the ground)
     Verify Payment    -> State Nodal Authority (financial oversight)
     Review Estimate   -> District Authority
     Audit Vendor      -> Ministry / Auditor (vendor spans multiple
                                                districts, needs a
                                                cross-district view)
     Investigate       -> Auditor (most severe: funds exhausted pattern)
     Monitor           -> MP + District (proactive, Early Warning only)

TWO SEPARATE QUEUES — mirrors the fraud/inefficiency split (Fix 5). Mixing
"already a problem" and "might become one" into one ranked list would hide
the difference between reactive and proactive work:

  - REACTIVE queue: works with needs_fraud_review == True
  - PROACTIVE queue: ongoing works with a high Early Warning Score
                      (from 06_early_warning_model.py output)
"""

import pandas as pd


def map_action(fraud_reason: str):
    """Priority-ordered — check the most specific/severe pattern first."""
    r = str(fraud_reason)
    if 'funds spent but work not completed' in r:
        return 'Investigate'
    if 'photo evidence' in r:
        return 'Inspect'
    if 'funds were disbursed' in r or 'disbursement' in r.lower():
        return 'Verify Payment'
    if 'Vendor unusually concentrated' in r:
        return 'Audit Vendor'
    if 'Cost is unusually' in r:
        return 'Review Estimate'
    return 'Review'


ACTION_ROUTING = {
    'Investigate':      'Auditor',
    'Inspect':           'District Authority',
    'Verify Payment':    'State Nodal Authority',
    'Audit Vendor':      'Ministry / Auditor',
    'Review Estimate':   'District Authority',
    'Review':            'District Authority',
    'Monitor':           'MP + District Authority',
}


def compute_priority(row):
    base = row['fraud_risk_score']
    compliance_boost = row['compliance_flag_count'] * 5
    confidence_adjustment = (row['data_confidence'] - 50) * 0.2
    return round(min(100, base + compliance_boost + confidence_adjustment), 1)


def build_reactive_queue(df):
    """Already-flagged works -> concrete action, ranked by priority."""
    flagged = df[df['needs_fraud_review'] == True].copy()
    flagged['action_type'] = flagged['fraud_reason'].apply(map_action)
    flagged['assigned_to'] = flagged['action_type'].map(ACTION_ROUTING)
    flagged['priority_score'] = flagged.apply(compute_priority, axis=1)
    flagged['queue_type'] = 'reactive'

    cols = ['work_id', "Hon'ble Members of Parliament", 'State', 'action_type',
            'assigned_to', 'priority_score', 'data_confidence', 'fraud_reason', 'queue_type']
    return flagged[cols].sort_values('priority_score', ascending=False)


def build_proactive_queue(early_warning_csv='early_warning_scored_ongoing_works.csv', threshold=70):
    """High Early Warning Score ongoing works -> Monitor, BEFORE a problem
    is confirmed. Kept separate from the reactive queue on purpose (see
    module docstring) — this is a different kind of action for a different
    reason: prevention, not correction."""
    ew = pd.read_csv(early_warning_csv)
    high_ew = ew[ew['early_warning_score'] >= threshold].copy()
    high_ew['action_type'] = 'Monitor'
    high_ew['assigned_to'] = ACTION_ROUTING['Monitor']
    high_ew['priority_score'] = high_ew['early_warning_score']
    high_ew['queue_type'] = 'proactive'

    cols = ['work_id', "Hon'ble Members of Parliament", 'State', 'action_type',
            'assigned_to', 'priority_score', 'stuck_days', 'queue_type']
    return high_ew[cols].sort_values('priority_score', ascending=False)


def main():
    print("=" * 70)
    print("AI-PRIORITIZED ACTION QUEUE")
    print("=" * 70)

    df = pd.read_csv('mplads_final_scored_works.csv', low_memory=False)

    print("\n[1/2] Building REACTIVE queue (already-flagged works)")
    reactive = build_reactive_queue(df)
    print(f"  {len(reactive)} action items generated")
    print("\n  Action type breakdown:")
    print(reactive['action_type'].value_counts().to_string())
    print("\n  Assigned-to breakdown:")
    print(reactive['assigned_to'].value_counts().to_string())

    print("\n[2/2] Building PROACTIVE queue (high Early Warning Score, ongoing works)")
    try:
        proactive = build_proactive_queue()
        print(f"  {len(proactive)} action items generated")
    except FileNotFoundError:
        print("  ⚠️  early_warning_scored_ongoing_works.csv not found — run 06_early_warning_model.py first")
        proactive = pd.DataFrame()

    reactive.to_csv('action_queue_reactive.csv', index=False)
    if not proactive.empty:
        proactive.to_csv('action_queue_proactive.csv', index=False)

    print("\n" + "=" * 70)
    print("TOP 5 HIGHEST-PRIORITY ACTIONS (reactive queue):\n")
    for _, r in reactive.head(5).iterrows():
        mp_name = r["Hon'ble Members of Parliament"]
        print(f"  [{r['priority_score']}] {r['action_type']} -> {r['assigned_to']}")
        print(f"    {mp_name} ({r['State']}) | work_id: {r['work_id']}")
        print(f"    Confidence: {r['data_confidence']}% | {r['fraud_reason'][:90]}")
        print()

    print("Saved: action_queue_reactive.csv, action_queue_proactive.csv\n")


if __name__ == "__main__":
    main()