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

  const {
    search,
    status,
    category,
    riskLevel,
    page = 1,
    limit = 10,
    sortField = "recommendedDate",
    sortDirection = "desc",
  } = filters;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

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

  // Filter by status in DB
  if (status && status !== "All") {
    const targetStatus = status.trim().toLowerCase();
    if (targetStatus === "completed") {
      where.status = "Completed";
    } else if (targetStatus === "sanctioned") {
      where.status = "Sanctioned";
    } else if (targetStatus === "recommended") {
      where.status = "Recommended";
    } else if (targetStatus === "ongoing") {
      where.status = "Ongoing";
    } else if (targetStatus === "under review") {
      where.OR = [
        ...(where.OR || []),
        { escalations: { some: {} } },
        {
          auditor_reports: {
            some: {
              status: { in: ["UNDER_REVIEW", "UNDER REVIEW", "ESCALATED", "Escalated"] },
            },
          },
        },
      ];
    } else if (targetStatus === "delayed") {
      where.status = "Ongoing";
      where.OR = [
        ...(where.OR || []),
        { completion_date: { lt: new Date() } },
        { current_risk_score: { delay_slippage_pct: { gte: 25 } } },
        { current_risk_score: { flag_reason: { contains: "delay", mode: "insensitive" } } },
      ];
    }
  }

  // Sorting
  const dir = (sortDirection || "desc").toLowerCase() === "asc" ? "asc" : "desc";
  let orderByClause = { recommended_date: dir };
  if (sortField === "workId") {
    orderByClause = { work_id: dir };
  } else if (sortField === "category") {
    orderByClause = { category: dir };
  } else if (sortField === "sanctionDate") {
    orderByClause = { sanction_date: dir };
  } else if (sortField === "sanctionedAmount") {
    orderByClause = { sanctioned_amount: dir };
  } else if (sortField === "status") {
    orderByClause = { status: dir };
  } else if (sortField === "riskScore") {
    orderByClause = { current_risk_score: { risk_score: dir } };
  }

  // 3. Query count and paginated works strictly in PostgreSQL
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: [orderByClause, { work_id: "desc" }],
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
    }),
  ]);

  // 4. Map ONLY the returned page works
  const data = [];
  for (const work of works) {
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

    const rawAmt =
      work.sanctioned_amount !== null && work.sanctioned_amount !== undefined
        ? work.sanctioned_amount
        : work.recommended_amount;
    const isEstimated =
      (work.sanctioned_amount === null || work.sanctioned_amount === undefined) &&
      work.recommended_amount !== null &&
      work.recommended_amount !== undefined;

    const sanctionedAmountLakhs =
      rawAmt !== null && rawAmt !== undefined && Number(rawAmt) > 0
        ? Number((Number(rawAmt) / 100000).toFixed(2))
        : 0;

    data.push({
      workId: work.work_id,
      description: work.description || "",
      flagReason: rs?.flag_reason || "",
      category: work.category || "",
      recommendedDate,
      sanctionDate,
      sanctionedAmount: sanctionedAmountLakhs,
      isEstimated,
      status: getDisplayStatus(work),
      riskLevel: rs?.risk_level || null,
      riskScore: numericRiskScore,
      vendorName,
    });
  }

  const districtName =
    mp.works[0]?.district?.district_name || mp.constituency || "";

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    data,
    mp: {
      mpName: mp.mp_name || "",
      constituency: mp.constituency || "",
      state: mp.state?.state_name || "",
      district: districtName,
    },
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  };
}

export default {
  getMyWorks,
};
