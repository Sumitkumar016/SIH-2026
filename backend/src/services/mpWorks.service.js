import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Finds the vendor name from the largest expenditure record for a work.
 */
function resolveVendorName(expenditures = []) {
  if (!Array.isArray(expenditures) || expenditures.length === 0) {
    return "Not Appointed";
  }

  let largest = expenditures[0];
  for (const exp of expenditures) {
    if (Number(exp.amount || 0) > Number(largest.amount || 0)) {
      largest = exp;
    }
  }

  return largest?.vendor?.vendor_name || "Not Appointed";
}

/**
 * services/mpWorks.service.js
 * Full portfolio of development works for the logged-in Member of Parliament.
 *
 * @param {number|string} mpId - MP Primary Key
 * @param {Object} filters - { search, status, category, riskLevel }
 * @returns {Promise<{ data: Array, mp: Object }>}
 */
export async function getMyWorks(mpId, filters = {}) {
  const parsedMpId = parseInt(mpId, 10);
  if (isNaN(parsedMpId)) {
    const error = new Error("Invalid MP ID");
    error.statusCode = 400;
    throw error;
  }

  const { search, status, category, riskLevel } = filters;

  // 1. Fetch MP profile metadata
  const mp = await prisma.mp.findUnique({
    where: { mp_id: parsedMpId },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
      works: {
        select: {
          district: {
            select: {
              district_name: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  if (!mp) {
    const error = new Error("MP profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Build Prisma where clause
  const where = {
    mp_id: parsedMpId,
  };

  // Filter by category
  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // Filter by risk level
  if (riskLevel && riskLevel !== "All") {
    where.current_risk_score = {
      risk_level: riskLevel,
    };
  }

  // Search filter across workId, description, and category
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
      { work_id: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  // 3. Query all works matching database filters
  const works = await prisma.work.findMany({
    where,
    include: {
      current_risk_score: true,
      expenditures: {
        include: {
          vendor: {
            select: {
              vendor_name: true,
            },
          },
        },
      },
      auditor_reports: {
        select: {
          status: true,
        },
      },
      escalations: {
        select: {
          escalation_id: true,
        },
      },
    },
    orderBy: {
      recommended_date: "desc",
    },
  });

  // 4. Apply status filter in memory using computed display status
  let filteredWorks = works;
  if (status && status !== "All") {
    const targetStatus = status.trim().toLowerCase();
    filteredWorks = filteredWorks.filter(
      (w) => getDisplayStatus(w).toLowerCase() === targetStatus
    );
  }

  // 5. Map works to response shape
  const data = [];

  for (const work of filteredWorks) {
    const rs = work.current_risk_score;
    const vendorName = resolveVendorName(work.expenditures);

    let numericRiskScore = null;
    if (rs?.risk_score !== null && rs?.risk_score !== undefined) {
      numericRiskScore = Number(rs.risk_score);
    }

    const recommendedDate = work.recommended_date
      ? new Date(work.recommended_date).toISOString()
      : null;

    const sanctionDate = work.sanction_date
      ? new Date(work.sanction_date).toISOString()
      : null;

    data.push({
      workId: work.work_id,
      description: work.description || "",
      flagReason: rs?.flag_reason || "",
      category: work.category || "",
      recommendedDate,
      sanctionDate,
      sanctionedAmount: Number(Number(work.sanctioned_amount || 0).toFixed(2)),
      status: getDisplayStatus(work),
      riskLevel: rs?.risk_level || null,
      riskScore: numericRiskScore,
      vendorName,
    });
  }

  const districtName =
    mp.works[0]?.district?.district_name || mp.constituency || "";

  return {
    data,
    mp: {
      mpName: mp.mp_name || "",
      constituency: mp.constituency || "",
      state: mp.state?.state_name || "",
      district: districtName,
    },
  };
}

export default {
  getMyWorks,
};
