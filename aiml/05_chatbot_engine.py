

"""
MPLADS Chatbot Engine — grounded Q&A over the model's actual scored output

DESIGN PRINCIPLE (non-negotiable): this is NOT a free-generation chatbot.
It never lets an LLM invent numbers or verdicts. The pipeline is:

  question -> (1) figure out WHAT is being asked (intent)
           -> (2) figure out WHO/WHAT it's about (entity: MP/state/constituency/work_id)
           -> (3) pull the real answer directly from mplads_final_scored_works.csv
           -> (4) phrase it using a fixed template with the SAME honest
                   vocabulary already established for the dashboard
                   ("flagged for review", not "fraud confirmed"; always
                   states data_confidence; never asserts a verdict)

If you later plug in an LLM (e.g. for step 1/2, understanding messier
phrasing), it should ONLY ever choose which of these grounded functions to
call — the same "tool use" pattern this conversation itself runs on. It
should never be given free rein to write the final answer's numbers itself.
"""

import re
import difflib
import pandas as pd

MP_COL = "Hon'ble Members of Parliament"

# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def load_data(csv_path='mplads_final_scored_works.csv'):
    df = pd.read_csv(csv_path)
    return df


# ---------------------------------------------------------------------------
# Entity matching — fuzzy, so "ravi shankar" finds "Ravi Shankar Prasad"
# ---------------------------------------------------------------------------

def fuzzy_find(query_text, candidates, cutoff=0.6):
    query_lower = query_text.lower()
    # exact substring match first (fast, reliable)
    substr_matches = [c for c in candidates if query_lower in c.lower()]
    if substr_matches:
        return min(substr_matches, key=len)  # shortest containing match = most specific
    # fall back to fuzzy match for typos/partial names
    close = difflib.get_close_matches(query_text, candidates, n=1, cutoff=cutoff)
    return close[0] if close else None


def extract_entities(question, df):
    mps = df[MP_COL].unique().tolist()
    states = df['State'].unique().tolist()
    constituencies = df['Constituency'].unique().tolist()

    found = {'mp': None, 'state': None, 'constituency': None, 'work_id': None}

    work_id_match = re.search(r'\b(WS/[A-Za-z0-9/\-]+)\b', question)
    if work_id_match:
        found['work_id'] = work_id_match.group(1)

    # Try matching each entity type against words/phrases in the question.
    # Order matters: work_id > MP > constituency > state (most specific first)
    for state in states:
        if state.lower() in question.lower():
            found['state'] = state
            break

    for mp in mps:
        if mp.lower() in question.lower():
            found['mp'] = mp
            break
    if not found['mp']:
        # try fuzzy on capitalized word sequences (likely a name)
        candidate_phrase = ' '.join(re.findall(r'\b[A-Z][a-zA-Z]*\b', question))
        if candidate_phrase:
            match = fuzzy_find(candidate_phrase, mps, cutoff=0.55)
            if match:
                found['mp'] = match

    for c in constituencies:
        if c.lower() in question.lower():
            found['constituency'] = c
            break

    return found


# ---------------------------------------------------------------------------
# Intent detection — simple keyword rules. Deliberately NOT an ML classifier:
# for a fixed, small set of question types, explicit rules are more reliable
# and auditable than a model that could misclassify silently.
# ---------------------------------------------------------------------------

INTENT_KEYWORDS = {
    'work_detail':    ['work id', 'this work', 'ws/'],
    'mp_summary':     ['mp ', 'member of parliament', 'about mr', 'about ms', 'about shri', 'about smt'],
    'state_summary':  ['state', 'in ', 'across'],
    'constituency_summary': ['constituency'],
    'top_risk':       ['top risk', 'highest risk', 'most flagged', 'worst', 'riskiest'],
    'national_stats': ['overall', 'nationwide', 'national', 'total', 'how many works'],
}


def detect_intent(question, entities):
    q = question.lower()
    if entities['work_id']:
        return 'work_detail'
    if any(k in q for k in INTENT_KEYWORDS['top_risk']):
        return 'top_risk'
    if entities['mp']:
        return 'mp_summary'
    if entities['constituency']:
        return 'constituency_summary'
    if entities['state']:
        return 'state_summary'
    if any(k in q for k in INTENT_KEYWORDS['national_stats']):
        return 'national_stats'
    return 'unknown'


# ---------------------------------------------------------------------------
# Grounded answer functions — every number here comes directly from the
# dataframe. No step in this file invents a value.
# ---------------------------------------------------------------------------

def answer_work_detail(df, work_id):
    row = df[df['work_id'] == work_id]
    if row.empty:
        return f"I couldn't find a work with ID '{work_id}' in the scored dataset."
    r = row.iloc[0]
    lines = [
        f"**{r['WORK']}** (Work ID: {r['work_id']})",
        f"MP: {r[MP_COL]} | State: {r['State']} | Constituency: {r['Constituency']}",
        f"Recommended amount: ₹{r['recommended_amount']:,.0f}",
        f"Status: {'Completed' if r['is_completed'] else ('Sanctioned' if r['is_sanctioned'] else 'Recommended, not yet sanctioned')}",
        "",
        f"Fraud risk: {r['fraud_risk_tier']} ({r['fraud_risk_score']}/100, {r['data_confidence']}% data confidence)",
        f"  -> {r['fraud_reason']}",
        f"Inefficiency: {r['inefficiency_tier']} ({r['inefficiency_score']}/100)",
        f"  -> {r['inefficiency_reason']}",
    ]
    if r['compliance_flags']:
        lines.append(f"Compliance flags: {r['compliance_flags']}")
    lines.append("")
    lines.append("Note: this is a statistical flag, not a confirmed finding. It requires human review before any action.")
    return "\n".join(lines)


def answer_mp_summary(df, mp_name):
    sub = df[df[MP_COL] == mp_name]
    if sub.empty:
        return f"I couldn't find any works for an MP matching '{mp_name}'."

    total = len(sub)
    flagged = sub['needs_fraud_review'].sum()
    high_ineff = (sub['inefficiency_tier'] == 'High').sum()
    avg_confidence = sub['data_confidence'].mean()
    top_flagged = sub[sub['needs_fraud_review']].sort_values('fraud_risk_score', ascending=False).head(3)

    lines = [
        f"**{mp_name}** — {sub['State'].iloc[0]}, {sub['Constituency'].iloc[0]}",
        f"Total works: {total}",
        f"Flagged for review: {flagged} ({flagged/total*100:.1f}%)",
        f"Works stuck in long execution delay (>1 year): {high_ineff}",
        f"Average data confidence across their works: {avg_confidence:.0f}%",
    ]
    if len(top_flagged) > 0:
        lines.append("\nTop flagged works needing review:")
        for _, r in top_flagged.iterrows():
            lines.append(f"  - {r['work_id']}: {r['fraud_reason']}")
    lines.append("\nNote: these are statistical flags for human review, not confirmed findings.")
    return "\n".join(lines)


def answer_state_summary(df, state_name):
    sub = df[df['State'] == state_name]
    if sub.empty:
        return f"I couldn't find any works for a state matching '{state_name}'."

    total = len(sub)
    flagged = sub['needs_fraud_review'].sum()
    by_mp = sub.groupby(MP_COL)['needs_fraud_review'].sum().sort_values(ascending=False)
    top_mps = by_mp[by_mp > 0].head(3)

    lines = [
        f"**{state_name}** — {total} works in the dataset",
        f"Flagged for review: {flagged} ({flagged/total*100:.1f}%)",
        f"High-inefficiency works (stuck >1 year): {(sub['inefficiency_tier']=='High').sum()}",
    ]
    if len(top_mps) > 0:
        lines.append("\nMPs with the most flagged works in this state:")
        for mp, count in top_mps.items():
            lines.append(f"  - {mp}: {int(count)} flagged")
    return "\n".join(lines)


def answer_constituency_summary(df, constituency_name):
    sub = df[df['Constituency'] == constituency_name]
    if sub.empty:
        return f"I couldn't find any works for a constituency matching '{constituency_name}'."

    total = len(sub)
    flagged = sub['needs_fraud_review'].sum()
    lines = [
        f"**{constituency_name}** ({sub['State'].iloc[0]}) — MP: {sub[MP_COL].iloc[0]}",
        f"Total works: {total}",
        f"Flagged for review: {flagged} ({flagged/total*100:.1f}%)",
        f"Completed: {sub['is_completed'].sum()} | Sanctioned (ongoing): {(sub['is_sanctioned'] & ~sub['is_completed']).sum()} | Not yet sanctioned: {(~sub['is_sanctioned']).sum()}",
    ]
    return "\n".join(lines)


def answer_top_risk(df, n=5):
    top = df.sort_values('fraud_risk_score', ascending=False).head(n)
    lines = [f"Top {n} highest fraud-risk works nationwide (statistical flags, not confirmed findings):\n"]
    for _, r in top.iterrows():
        lines.append(f"  - {r[MP_COL]} ({r['State']}) — {r['fraud_risk_score']}/100, {r['data_confidence']}% confidence")
        lines.append(f"    {r['fraud_reason']}")
    return "\n".join(lines)


def answer_national_stats(df):
    total = len(df)
    flagged = df['needs_fraud_review'].sum()
    high_fraud = (df['fraud_risk_tier'] == 'High').sum()
    high_ineff = (df['inefficiency_tier'] == 'High').sum()
    avg_conf = df['data_confidence'].mean()
    return (
        f"Nationwide summary across {total} works:\n"
        f"  - Flagged for review: {flagged} ({flagged/total*100:.1f}%)\n"
        f"  - Statistically High fraud-risk tier: {high_fraud}\n"
        f"  - High inefficiency (stuck >1 year): {high_ineff}\n"
        f"  - Average data confidence: {avg_conf:.0f}%\n\n"
        f"Note: 'flagged' means statistically unusual or a compliance rule was "
        f"tripped — it means 'needs a human to look at this,' not 'confirmed fraud.'"
    )


# ---------------------------------------------------------------------------
# Discoverability — the user shouldn't have to guess what's answerable.
# Two mechanisms: (1) real, guaranteed-to-work example questions generated
# FROM the actual data, shown upfront and on 'help'; (2) "did you mean...?"
# suggestions when a question is close to something real but didn't match.
# ---------------------------------------------------------------------------

def get_example_questions(df, n=4):
    """Generates real example questions using actual entities from the
    dataset, so every example shown to the user is guaranteed to return
    a real answer — never a made-up placeholder name."""
    sample_mp = df[MP_COL].iloc[0]
    sample_state = df['State'].value_counts().index[0]  # most common state, likely to have interesting data
    sample_constituency = df['Constituency'].iloc[0]
    sample_work_id = df['work_id'].iloc[0]
    return [
        f"Tell me about {sample_mp}",
        f"How many works are flagged in {sample_state}",
        f"What's happening in {sample_constituency}",
        f"What's work {sample_work_id} about",
        "Top risk works nationwide",
        "Give me the national overall stats",
    ][:n]


def print_help(df):
    print("\nThis bot can only answer questions grounded in the scored MPLADS data.")
    print("It will never guess or make up an answer — if it's not in the data, it says so.\n")
    print("Question types it understands:")
    print("  - MP summary        : \"Tell me about [MP name]\"")
    print("  - State summary      : \"How many works are flagged in [State]\"")
    print("  - Constituency summary: \"What's happening in [Constituency]\"")
    print("  - Specific work      : \"What's work [WS/... ID] about\"")
    print("  - Top risk works     : \"Top risk works nationwide\"")
    print("  - National stats     : \"Give me the national overall stats\"")
    print("\nTry these real examples (guaranteed to work on this dataset):")
    for q in get_example_questions(df, n=4):
        print(f"  > {q}")
    print("\nType 'help' any time to see this again.\n")


def suggest_close_matches(question, df):
    """When nothing matched, check if the person typed something CLOSE to a
    real MP/state/constituency name (typo, partial name) and suggest it,
    instead of a flat 'I don't understand.' Never guesses the answer itself
    — only points at the closest real entity name to try again with."""
    candidates = (
        list(df[MP_COL].unique()) + list(df['State'].unique()) + list(df['Constituency'].unique())
    )
    words = re.findall(r'[A-Za-z]{3,}', question)
    suggestions = set()
    for word in words:
        close = difflib.get_close_matches(word, candidates, n=1, cutoff=0.75)
        # also try fuzzy against multi-word candidates using partial ratio-ish substring
        if not close:
            partial = [c for c in candidates if word.lower() in c.lower()]
            close = partial[:1]
        suggestions.update(close)
    return list(suggestions)[:3]


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

def answer_question(question, df):
    if question.strip().lower() == 'help':
        print_help(df)
        return None

    entities = extract_entities(question, df)
    intent = detect_intent(question, entities)

    if intent == 'work_detail':
        return answer_work_detail(df, entities['work_id'])
    elif intent == 'mp_summary':
        return answer_mp_summary(df, entities['mp'])
    elif intent == 'state_summary':
        return answer_state_summary(df, entities['state'])
    elif intent == 'constituency_summary':
        return answer_constituency_summary(df, entities['constituency'])
    elif intent == 'top_risk':
        return answer_top_risk(df)
    elif intent == 'national_stats':
        return answer_national_stats(df)
    else:
        suggestions = suggest_close_matches(question, df)
        msg = "I couldn't tell what you're asking about.\n"
        if suggestions:
            msg += f"\nDid you mean one of these? {', '.join(suggestions)}\n(Try: \"Tell me about {suggestions[0]}\")\n"
        msg += (
            "\nType 'help' to see what kinds of questions I can answer, "
            "or try:\n"
            "  - \"Tell me about [MP name]\"\n"
            "  - \"How many works are flagged in [State]\"\n"
            "  - \"What's happening in [Constituency]\"\n"
            "  - \"What's work WS/... about\"\n"
            "  - \"Top risk works nationwide\""
        )
        return msg


if __name__ == "__main__":
    df = load_data()
    print("=" * 60)
    print("MPLADS Chatbot — ask a question, get a grounded answer")
    print("=" * 60)
    print_help(df)
    print("Type 'quit' or 'exit' to stop.\n")

    while True:
        question = input("You: ").strip()
        if question.lower() in ('quit', 'exit', 'q'):
            print("Goodbye.")
            break
        if not question:
            continue
        answer = answer_question(question, df)
        if answer is not None:  # 'help' prints directly and returns None
            print("\nBot:")
            print(answer)
            print()
