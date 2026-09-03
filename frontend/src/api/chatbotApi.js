/**
 * Chatbot API Service (src/api/chatbotApi.js)
 * Frontend-only mock intelligence engine for the MPLADS platform.
 * 
 * SWAPPABILITY NOTE:
 * When connecting a real LLM / AI backend (e.g. POST /api/chatbot/query),
 * simply replace the mock logic inside `getMockResponse` with:
 * 
 * const data = await apiFetch('/api/chatbot/query', {
 *   method: 'POST',
 *   body: JSON.stringify({ message: userMessage, role })
 * });
 * return data.reply;
 */

/**
 * Returns role-tailored initial greeting
 * @param {string} role - 'ministry' | 'mp' | 'district' | 'state' | 'auditor'
 * @returns {string}
 */
export function getRoleInitialGreeting(role) {
  switch (role) {
    case 'ministry':
      return "Hi, I can help you navigate flagged cases, trends, and predictive alerts. What would you like to know?";
    case 'mp':
      return "Hi, I can help you check your constituency's works and fund utilization. What would you like to know?";
    case 'district':
      return "Hi, I can help with verification queues and escalations. What would you like to know?";
    case 'auditor':
      return "Hi, I can help you investigate flagged cases and vendor patterns. What would you like to know?";
    case 'state':
      return "Hi, I can help you review district-wise performance in your state. What would you like to know?";
    default:
      return "Hi, I can help you navigate the MPLADS platform. What would you like to know?";
  }
}

/**
 * Generates an intelligent, role-aware canned response after a simulated thinking latency.
 * 
 * @param {string} userMessage - Text prompt submitted by user
 * @param {string} role - Active user role from AuthContext
 * @returns {Promise<string>}
 */
export async function getMockResponse(userMessage, role = 'ministry') {
  return new Promise((resolve) => {
    // Simulate thinking latency (800ms - 1300ms)
    const delay = Math.floor(Math.random() * 500) + 800;

    setTimeout(() => {
      const q = (userMessage || '').trim().toLowerCase();

      // 1. Flagged cases / Anomalies / Risk
      if (q.includes('flagged') || q.includes('anomaly') || q.includes('anomalies') || q.includes('risk')) {
        if (role === 'ministry') {
          return resolve(
            "Under the National Flagged Cases view, high-risk works are prioritized using multi-factor risk scores (cost overrun, milestone slippage, and fund velocity anomalies). You can filter by state or status to investigate critical bottlenecks."
          );
        }
        if (role === 'auditor') {
          return resolve(
            "The Auditor Queue lists prioritized cases requiring forensic review. Check the discrepancy flags, physical progress vs photographic evidence, and AI diagnostic summaries before submitting your audit conclusion."
          );
        }
        if (role === 'district') {
          return resolve(
            "In your District Verification Queue, you can review flagged works marked with unverified progress or missing geotagged photos. Upload field inspection reports to resolve discrepancies."
          );
        }
        if (role === 'mp') {
          return resolve(
            "Your Constituency Overview highlights delayed or flagged works in your area. You can check sanction dates and submit official MP justifications directly from the works list."
          );
        }
        if (role === 'state') {
          return resolve(
            "State Overview aggregates risk levels across all districts in your state, highlighting districts with higher-than-average project delays or documentation gaps."
          );
        }
      }

      // 2. Vendor / Contractor / Cross-reference
      if (q.includes('vendor') || q.includes('contractor') || q.includes('agency')) {
        if (role === 'auditor') {
          return resolve(
            "The Vendor Cross-Reference Tool analyzes executing agencies across districts to detect contractor clustering, shared registration numbers, and repeat cost-overrun histories."
          );
        }
        return resolve(
          "Vendor assignments and disbursements are linked per expenditure record. You can track payment status, released amounts, and contractor performance trends."
        );
      }

      // 3. Fund / Utilization / Expenditure / Budget
      if (q.includes('fund') || q.includes('utilization') || q.includes('expenditure') || q.includes('budget') || q.includes('money')) {
        if (role === 'mp') {
          return resolve(
            "Your MP entitlement reflects the standard ₹5 Cr/year scheme allocation, while the cumulative allocated amount is tracked in your overview. Fund utilization is calculated as total disbursed expenditure divided by sanctioned amounts."
          );
        }
        if (role === 'ministry') {
          return resolve(
            "National fund utilization metrics and state-wise expenditure rankings are available on the National Overview and MP Performance Leaderboard pages."
          );
        }
        if (role === 'state') {
          return resolve(
            "State Nodal Overview tracks district-wise fund absorption and utilization percentages to identify regions lagging in project expenditure."
          );
        }
        return resolve(
          "Fund utilization compares actual expenditures against sanctioned budget thresholds. Real-time disbursements are tracked per work."
        );
      }

      // 4. Prediction / Forecast / Delay / Overrun
      if (q.includes('predict') || q.includes('forecast') || q.includes('delay') || q.includes('overrun') || q.includes('slippage')) {
        return resolve(
          "The Predictive Forecasting engine calculates 30-day risk deltas and estimated completion timelines using historical milestone delivery rates and contractor velocity."
        );
      }

      // 5. Verification / Inspection / Escalation
      if (q.includes('verification') || q.includes('inspect') || q.includes('escalat') || q.includes('photo')) {
        if (role === 'district' || role === 'auditor') {
          return resolve(
            "Works require physical verification and geotagged evidence before milestone funds are released. Unverified reports can be escalated to state and central oversight."
          );
        }
        return resolve(
          "Physical progress is monitored through geotagged photos and district authority verification sign-offs to prevent ghost asset creation."
        );
      }

      // 6. Greetings / Conversational
      if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('help') || q.includes('who are you')) {
        return resolve(
          `Hello! I am your MPLADS Sentinel Assistant (${role.toUpperCase()} View). Ask me about flagged works, risk scores, vendor cross-referencing, or fund utilization.`
        );
      }

      // 7. Generic Fallback
      return resolve(
        "I'm still learning — try asking about flagged works, risk scores, vendor patterns, or fund utilization."
      );
    }, delay);
  });
}

export default { getRoleInitialGreeting, getMockResponse };
