import { prisma } from "../config/db.js";
import {
  getLatestAuditorReport,
  getLatestEscalation,
} from "./shared/latestFor.service.js";

/**
 * Formats database status values to user-facing caseStatus:
 * 'Under Review' | 'Escalated' | 'Resolved' | 'New'
 */
function formatCaseStatus(status) {
  if (!status) return "New";

  const upper = String(status).trim().toUpperCase();
  if (upper === "UNDER_REVIEW" || upper === "UNDER REVIEW") {
    return "Under Review";
  }
  if (upper === "RESOLVED") {
    return "Resolved";
  }
  if (upper === "ESCALATED") {
    return "Escalated";
  }

  return status;
}

/**
 * Checks if a work matches the search query across ID, MP, district, state, or vendor name.
 */
function matchesSearch(work, searchLower) {
  if (!searchLower) return true;

  if ((work.work_id || "").toLowerCase().includes(searchLower)) return true;
  if ((work.mp?.mp_name || "").toLowerCase().includes(searchLower)) return true;
  if ((work.district?.district_name || "").toLowerCase().includes(searchLower)) return true;
  if ((work.state?.state_name || "").toLowerCase().includes(searchLower)) return true;

  if (Array.isArray(work.expenditures)) {
    for (const exp of work.expenditures) {
      const vendorName = exp.vendor?.vendor_name || "";
      if (vendorName.toLowerCase().includes(searchLower)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * PART 2 — High-Risk Case Queue Service
 * Nationwide high-risk queue: returns works with RiskScore.risk_level IN ('Medium', 'High').
 *
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {string} [filters.riskLevel] - 'All' | 'High' | 'Medium'
 * @param {string} [filters.caseStatus] - 'All' | 'New' | 'Under Review' | 'Escalated' | 'Resolved'
 * @param {string} [filters.source] - 'All' | 'ai' | 'district'
 * @returns {Promise<{ data: Array }>}
 */
export async function getCaseQueue(filters = {}) {
  const { search, riskLevel, caseStatus, source } = filters;

  // 1. Base query: only Medium and High risk cases nationwide
  const where = {
    current_risk_score: {
      risk_level: {
        in: ["Medium", "High"],
      },
    },
  };

  // Filter by risk level if specified
  if (riskLevel && riskLevel !== "All") {
    where.current_risk_score.risk_level = riskLevel;
  }

  // 2. Fetch qualifying works with linked details
  const works = await prisma.work.findMany({
    where,
    include: {
      mp: {
        select: {
          mp_id: true,
          mp_name: true,
        },
      },
      district: {
        select: {
          district_id: true,
          district_name: true,
        },
      },
      state: {
        select: {
          state_id: true,
          state_name: true,
        },
      },
      current_risk_score: true,
      auditor_reports: {
        orderBy: [
          { submitted_date: "desc" },
          { report_id: "desc" },
        ],
        take: 1,
      },
      escalations: {
        orderBy: [
          { escalated_date: "desc" },
          { escalation_id: "desc" },
        ],
        take: 1,
      },
      expenditures: {
        include: {
          vendor: {
            select: {
              vendor_name: true,
            },
          },
        },
      },
    },
  });

  const searchLower = search && search.trim() !== "" ? search.toLowerCase().trim() : null;
  const results = [];

  for (const w of works) {
    // 3. Resolve latest report & escalation
    const latestReport = w.auditor_reports?.[0] || (await getLatestAuditorReport(w.work_id));
    const latestEscalation = w.escalations?.[0] || (await getLatestEscalation(w.work_id));

    // Case status ('New' if no report filed yet)
    const derivedCaseStatus = formatCaseStatus(latestReport?.status);

    // Escalation source ('ai' if no escalation row exists)
    const derivedEscalationSource =
      latestEscalation?.escalation_source ||
      latestEscalation?.escalationSource ||
      "ai";

    const derivedEscalationNote =
      latestEscalation?.escalation_note ||
      latestEscalation?.escalationNote ||
      null;

    // Filter by case status if requested
    if (caseStatus && caseStatus !== "All") {
      if (derivedCaseStatus.toLowerCase() !== caseStatus.toLowerCase()) {
        continue;
      }
    }

    // Filter by source if requested
    if (source && source !== "All") {
      if (derivedEscalationSource.toLowerCase() !== source.toLowerCase()) {
        continue;
      }
    }

    // Filter by search term
    if (!matchesSearch(w, searchLower)) {
      continue;
    }

    let numericRiskScore = 0;
    if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
      numericRiskScore = Number(w.current_risk_score.risk_score);
    }

    results.push({
      workId: w.work_id,
      mpName: w.mp?.mp_name || "Unknown MP",
      category: w.category || "",
      state: w.state?.state_name || "",
      district: w.district?.district_name || "",
      riskLevel: w.current_risk_score?.risk_level || "Medium",
      riskScore: numericRiskScore,
      flagReason: w.current_risk_score?.flag_reason || "",
      caseStatus: derivedCaseStatus,
      escalationSource: derivedEscalationSource,
      escalationNote: derivedEscalationNote,
    });
  }

  // Sort results by riskScore descending
  results.sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

  return { data: results };
}

export default {
  getCaseQueue,
};
