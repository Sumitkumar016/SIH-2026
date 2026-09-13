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

  const page = Math.max(1, parseInt(filters.page || 1, 10));
  const limit = Math.max(1, parseInt(filters.limit || 20, 10));
  const skip = (page - 1) * limit;
  const take = limit;

  // 1. Base query: only Medium and High risk sanctioned cases nationwide
  const where = {
    status: { not: "Recommended" },
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

  // Filter by source
  if (source && source !== "All") {
    if (source.toLowerCase() === "district") {
      where.escalations = {
        some: {
          escalation_source: { equals: "district", mode: "insensitive" },
        },
      };
    } else if (source.toLowerCase() === "ai") {
      where.escalations = {
        none: {},
      };
    }
  }

  // Filter by case status
  if (caseStatus && caseStatus !== "All") {
    const targetStatus = caseStatus.trim().toLowerCase();
    if (targetStatus === "new") {
      where.auditor_reports = {
        none: {},
      };
    } else if (targetStatus === "under review") {
      where.auditor_reports = {
        some: {
          status: { in: ["UNDER_REVIEW", "Under Review", "under_review", "under review"] },
        },
      };
    } else if (targetStatus === "resolved") {
      where.auditor_reports = {
        some: {
          status: { in: ["RESOLVED", "Resolved", "resolved"] },
        },
      };
    } else if (targetStatus === "escalated") {
      where.auditor_reports = {
        some: {
          status: { in: ["ESCALATED", "Escalated", "escalated"] },
        },
      };
    }
  }

  // Filter by search term
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
      { work_id: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { mp: { mp_name: { contains: q, mode: "insensitive" } } },
      { district: { district_name: { contains: q, mode: "insensitive" } } },
      { state: { state_name: { contains: q, mode: "insensitive" } } },
    ];
  }

  // 2. Parallel Count and Paginated Query strictly in PostgreSQL
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: [
        { current_risk_score: { risk_score: "desc" } },
        { sanction_date: "desc" },
        { work_id: "desc" },
      ],
      select: {
        work_id: true,
        category: true,
        description: true,
        sanction_date: true,
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
        current_risk_score: {
          select: {
            risk_level: true,
            risk_score: true,
            flag_reason: true,
            calculated_at: true,
          },
        },
        escalations: {
          orderBy: [{ escalated_date: "desc" }, { escalation_id: "desc" }],
          take: 1,
          select: {
            escalation_source: true,
            escalation_note: true,
            escalated_date: true,
          },
        },
        auditor_reports: {
          orderBy: [{ submitted_date: "desc" }, { report_id: "desc" }],
          take: 1,
          select: {
            status: true,
            conclusion: true,
            notes: true,
            submitted_date: true,
          },
        },
      },
    }),
  ]);

  // 3. Map ONLY the returned page records (e.g. 20 items)
  const results = works.map((w) => {
    const latestReport = w.auditor_reports?.[0] || null;
    const latestEscalation = w.escalations?.[0] || null;

    const derivedCaseStatus = formatCaseStatus(latestReport?.status);
    const derivedEscalationSource =
      latestEscalation?.escalation_source || "ai";
    const derivedEscalationNote =
      latestEscalation?.escalation_note || null;

    return {
      workId: w.work_id,
      description: w.description || "",
      category: w.category || "",
      mpName: w.mp?.mp_name || "Unknown MP",
      district: w.district?.district_name || "Unknown District",
      state: w.state?.state_name || "Unknown State",
      riskLevel: w.current_risk_score?.risk_level || "Medium",
      riskScore:
        w.current_risk_score?.risk_score !== null &&
        w.current_risk_score?.risk_score !== undefined
          ? Number(w.current_risk_score.risk_score)
          : 50,
      flagReason:
        w.current_risk_score?.flag_reason || "Flagged by AI sentinel logic",
      caseStatus: derivedCaseStatus,
      escalationSource: derivedEscalationSource,
      escalationNote: derivedEscalationNote,
      escalatedDate: latestEscalation?.escalated_date || null,
      lastActionDate:
        latestReport?.submitted_date ||
        latestEscalation?.escalated_date ||
        w.sanction_date ||
        null,
    };
  });

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data: results,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export default {
  getCaseQueue,
};
