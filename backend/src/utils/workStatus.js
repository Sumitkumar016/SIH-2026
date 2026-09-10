/**
 * utils/workStatus.js
 * 
 * Utility functions for:
 * 1. Computing Indian Financial Year date ranges (1 April - 31 March).
 * 2. Deriving the user-facing display status for projects (including virtual
 *    statuses like 'Delayed' and 'Under Review' that don't exist as raw database enums).
 */

/**
 * Computes start and end Date objects for an Indian Financial Year (1 April - 31 March).
 * Accepts strings like "FY 2023-24", "2023-24", or "FY 2024-25".
 *
 * @param {string} fyString
 * @returns {{ start: Date, end: Date } | null}
 */
export function computeFinancialYearRange(fyString) {
  if (!fyString || typeof fyString !== "string" || fyString.trim() === "" || fyString === "All") {
    return null;
  }

  // Extract the starting 4-digit year from the string
  const match = fyString.match(/\b(20\d{2})\b/);
  if (!match) return null;

  const startYear = parseInt(match[1], 10);
  const endYear = startYear + 1;

  // Indian FY starts 1 April (month index 3) and ends 31 March (month index 2)
  const start = new Date(Date.UTC(startYear, 3, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(endYear, 2, 31, 23, 59, 59, 999));

  return { start, end };
}

/**
 * Derives the display status of a work.
 * 
 * Priority order:
 * 1. Already resolved virtual status ('Delayed' or 'Under Review')
 * 2. 'Completed'
 * 3. 'Under Review' (if active escalations or unclosed auditor reports exist)
 * 4. 'Delayed' (if completion target passed, slippage >= 25%, or delay flag present)
 * 5. Database enum status ('Sanctioned', 'Recommended', 'Ongoing')
 *
 * @param {Object} work - Work record with optional relations
 * @returns {string} One of 'Completed' | 'Under Review' | 'Delayed' | 'Ongoing' | 'Sanctioned' | 'Recommended'
 */
export function getDisplayStatus(work) {
  if (!work) return "Ongoing";

  // If the status was already pre-computed as Delayed or Under Review
  if (work.status === "Delayed" || work.status === "Under Review") {
    return work.status;
  }

  // 1. Completed
  if (work.status === "Completed") {
    return "Completed";
  }

  // 2. Under Review: has active escalation or report marked Under Review / Escalated
  const hasActiveEscalation = Array.isArray(work.escalations) && work.escalations.length > 0;
  
  let hasUnderReviewReport = false;
  if (Array.isArray(work.auditor_reports)) {
    for (const report of work.auditor_reports) {
      const repStatus = String(report.status || "").trim().toUpperCase();
      if (repStatus === "UNDER_REVIEW" || repStatus === "UNDER REVIEW" || repStatus === "ESCALATED") {
        hasUnderReviewReport = true;
        break;
      }
    }
  }

  if (hasActiveEscalation || hasUnderReviewReport) {
    return "Under Review";
  }

  // 3. Delayed: target date passed, delay slippage >= 25%, or flag notes delay
  const isPastCompletion =
    work.completion_date && new Date(work.completion_date).getTime() < Date.now();

  const delaySlippage = Number(work.risk_score?.delay_slippage_pct || 0);

  const flagReasonLower = String(work.risk_score?.flag_reason || "").toLowerCase();
  const isFlaggedForDelay =
    flagReasonLower.includes("delay") ||
    flagReasonLower.includes("stall") ||
    flagReasonLower.includes("overdue");

  if (isPastCompletion || delaySlippage >= 25 || isFlaggedForDelay) {
    return "Delayed";
  }

  // 4. Fallback to raw database enum value
  if (work.status === "Sanctioned") return "Sanctioned";
  if (work.status === "Recommended") return "Recommended";
  if (work.status === "Ongoing") return "Ongoing";

  return work.status || "Ongoing";
}

export default {
  computeFinancialYearRange,
  getDisplayStatus,
};
