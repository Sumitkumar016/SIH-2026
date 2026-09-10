/**
 * utils/stateCodeMap.js
 * 
 * Standard 2-letter postal/ISO abbreviation mapping for Indian States
 * and Union Territories. Used for compact state badges and chart labels.
 */

export const STATE_CODE_MAP = {
  // 28 Indian States
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OD",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",

  // 8 Union Territories
  "Andaman and Nicobar Islands": "AN",
  "Chandigarh": "CH",
  "Dadra and Nagar Haveli and Daman and Diu": "DD",
  "Delhi": "DL",
  "Jammu and Kashmir": "JK",
  "Ladakh": "LA",
  "Lakshadweep": "LD",
  "Puducherry": "PY",
};

/**
 * Resolves a state name to its standard 2-letter uppercase code.
 * Supports exact match, case-insensitive match, and fallback.
 *
 * @param {string} stateName - e.g. "Bihar", "UTTAR PRADESH"
 * @returns {string} 2-letter uppercase code (e.g. "BR", "UP")
 */
export function getStateCode(stateName) {
  if (!stateName || typeof stateName !== "string") {
    return "IN";
  }

  const trimmed = stateName.trim();

  // 1. Direct match
  if (STATE_CODE_MAP[trimmed]) {
    return STATE_CODE_MAP[trimmed];
  }

  // 2. Case-insensitive lookup
  const lower = trimmed.toLowerCase();
  for (const [name, code] of Object.entries(STATE_CODE_MAP)) {
    if (name.toLowerCase() === lower) {
      return code;
    }
  }

  // 3. Fallback: first 2 characters in uppercase
  const fallback = trimmed.slice(0, 2).toUpperCase();
  return fallback || "IN";
}

export default STATE_CODE_MAP;
