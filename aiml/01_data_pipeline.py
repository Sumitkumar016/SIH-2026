

import pandas as pd
import re
import os


# STEP 1.1: Work ID ko normalize karne wala function

def normalize_id(raw_work_id):
    
    if pd.isna(raw_work_id):
        return None
    
    cleaned = str(raw_work_id).replace('\t', '').replace(' ', '')
    
    match = re.search(r'WS/MP\d+/\d{4}-\d{4}/\d+', cleaned)
    return match.group(0) if match else None



# STEP 1.2: Work description se "work_type" (category) nikaalna

def extract_work_type(raw_work_id):
    
    if pd.isna(raw_work_id):
        return "Unknown"
    
    match = re.search(r'.*\d+-(.+)$', str(raw_work_id).strip())
    return match.group(1).strip() if match else "Unknown"



# STEP 1.3: Ek CSV file ko safely load aur clean karna

def load_and_clean(filename):
    
    if not os.path.exists(filename):
        raise FileNotFoundError(
            f"\n\n❌ '{filename}' nahi mili! Check karo ki ye file isi folder "
            f"me hai jaha ye script hai.\n"
        )
    df = pd.read_csv(filename)
    df = df[df['Sr. No.'] != 'Grand Total'].copy()
    print(f"  ✅ {filename} loaded — {len(df)} rows (Grand Total row hata di)")
    return df



# MAIN PIPELINE 

def main():
    print("=" * 60)
    print("STEP 1: DATA PIPELINE SHURU HO RAHA HAI")
    print("=" * 60)

    print("\n[1/5] Files load kar rahe hain...")
    rec = load_and_clean('Works_Recommended.csv')
    san = load_and_clean('Works_Sanctioned.csv')
    comp = load_and_clean('Works_Completed.csv')
    exp = load_and_clean('Expenditure_on_Completed_and_On-going_Works_as_on_Date.csv')
    alloc = load_and_clean('Allocated_Limit_for_Honble_MPs.csv')

    print("\n[2/5] Work IDs normalize kar rahe hain (taaki files match ho sakein)...")
    rec['work_id'] = rec['WORK'].apply(normalize_id)
    san['work_id'] = san['Work'].apply(normalize_id)
    comp['work_id'] = comp['Work'].apply(normalize_id)
    exp['work_id'] = exp['Work ID'].apply(normalize_id)

    print("\n[3/5] Work category (type) nikaal rahe hain description se...")
    rec['work_type'] = rec['WORK'].apply(extract_work_type)

    print("\n[4/5] Dates aur amounts ko proper format me convert kar rahe hain...")
    rec['recommended_amount'] = pd.to_numeric(rec['RECOMMENDED AMOUNT   ( ₹ )'], errors='coerce')
    san['sanction_amount'] = pd.to_numeric(san['Sanction Amount ( ₹ )'], errors='coerce')
    comp['amount_disbursed'] = pd.to_numeric(comp['Amount Disbursed ( ₹ )'], errors='coerce')
    exp['fund_disbursed'] = pd.to_numeric(exp['Fund Disbursed Amount ( ₹ )'], errors='coerce')

    rec['recommended_date'] = pd.to_datetime(rec['Recommended date'], errors='coerce', dayfirst=True)
    san['sanction_date'] = pd.to_datetime(san['Sanction Date'], errors='coerce', dayfirst=True)
    comp['completion_date'] = pd.to_datetime(comp['Completion Date'], errors='coerce', dayfirst=True)

    # Missing photo evidence flag 
    comp['image_missing'] = comp['Image'].isna() | (comp['Image'].astype(str).str.strip() == '')

    print("\n[5/5] Recommended + Sanctioned files ko Work ID se jod (merge) rahe hain...")
    merged = rec.merge(
        san[['work_id', 'sanction_date', 'sanction_amount', 'Work Status']],
        on='work_id', how='left'
    )
    merged['sanction_delay_days'] = (merged['sanction_date'] - merged['recommended_date']).dt.days
    merged['is_sanctioned'] = merged['sanction_date'].notna()

    sanction_rate = merged['is_sanctioned'].mean() * 100
    print(f"\n  📊 Sanction rate: {sanction_rate:.1f}% works sanctioned ho paye")

    # Sab everything for next step
    merged.to_pickle('step1_merged_output.pkl')
    comp.to_pickle('step1_completed_output.pkl')
    exp.to_pickle('step1_expenditure_output.pkl')
    alloc.to_pickle('step1_allocated_output.pkl')

    print("\n" + "=" * 60)
    print("✅ STEP 1 COMPLETE!")
    print("=" * 60)
    print("\nAgla step: 02_train_model.py chalao")
    print("Command:  python 02_train_model.py\n")


if __name__ == "__main__":
    main()
