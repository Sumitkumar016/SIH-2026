import { prisma } from "../config/db.js";
import { getStateCode } from "../utils/stateCodeMap.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getDisplayStatus, computeFinancialYearRange } from "../utils/workStatus.js";
import { getMpLeaderboard as getMpLeaderboardService } from "../services/mpPerformance.service.js";
import {
  getMonthlyTrends,
  getCategoryAnomalies,
  getTopVendors,
  getStateComparison,
  getTrendsLocations as getTrendsLocationsService,
} from "../services/trendsAnalytics.service.js";
import { getPredictiveWatchlist as getPredictiveWatchlistService } from "../services/prediction.service.js";


/**
 * GET /api/ministry/overview/kpis
 * National KPI metrics for Ministry (National View).
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewKpis = asyncHandler(async (req, res) => {
  const [
    totalWorksRecommended,
    totalSanctionedWorks,
    sanctionedAgg,
    totalCompletedWorks,
    expenditureAgg,
    totalFlaggedCases,
  ] = await Promise.all([
    // Query 1: Total count of all recommended works in the system
    prisma.work.count(),

    // Query 2: Total count of sanctioned works (works that advanced past 'Recommended')
    prisma.work.count({
      where: {
        status: { not: "Recommended" },
      },
    }),

    // Query 3: Total sum of sanctioned funds across all works (stored in Lakhs)
    prisma.work.aggregate({
      _sum: { sanctioned_amount: true },
    }),

    // Query 4: Total count of works that have reached 'Completed' status
    prisma.work.count({
      where: { status: "Completed" },
    }),

    // Query 5: Total sum of actual expenditure disbursed across all works (stored in Lakhs)
    prisma.expenditure.aggregate({
      _sum: { amount: true },
    }),

    // Query 6: Total count of flagged works with Medium or High risk levels for sanctioned works
    prisma.riskScore.count({
      where: {
        is_current: true,
        risk_level: { in: ["Medium", "High"] },
        work: {
          status: { not: "Recommended" },
        },
      },
    }),
  ]);

  const totalSanctionedCr = Number(
    (Number(sanctionedAgg._sum.sanctioned_amount || 0) / 10000000).toFixed(2)
  );
  const totalExpenditureCr = Number(
    (Number(expenditureAgg._sum.amount || 0) / 10000000).toFixed(2)
  );

  const completionRate =
    totalSanctionedWorks > 0
      ? Number(((totalCompletedWorks / totalSanctionedWorks) * 100).toFixed(1))
      : 0;

  const expenditureRatio =
    totalSanctionedCr > 0
      ? Number(((totalExpenditureCr / totalSanctionedCr) * 100).toFixed(1))
      : 0;

  const flaggedRatePercent =
    totalSanctionedWorks > 0
      ? Number(((totalFlaggedCases / totalSanctionedWorks) * 100).toFixed(1))
      : 0;

  return res.status(200).json({
    totalWorksRecommended,
    totalSanctionedWorks,
    totalSanctionedCr,
    totalCompletedWorks,
    completionRate,
    totalExpenditureCr,
    expenditureRatio,
    totalFlaggedCases,
    flaggedRatePercent,
  });
});

/**
 * GET /api/ministry/overview/risk
 * Breakdown count of flagged works across risk levels for sanctioned works.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewRisk = asyncHandler(async (req, res) => {
  const riskScoreGroups = await prisma.riskScore.groupBy({
    by: ["risk_level"],
    where: {
      is_current: true,
      work: {
        status: { not: "Recommended" },
      },
    },
    _count: { _all: true },
  });

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  riskScoreGroups.forEach((g) => {
    if (g.risk_level === "Medium") riskDistribution.medium = g._count._all;
    if (g.risk_level === "High") riskDistribution.high = g._count._all;
  });
  // Low-risk works are within SLA tolerance and not flagged for review
  riskDistribution.low = 20;

  return res.status(200).json({
    riskDistribution,
  });
});

/**
 * GET /api/ministry/overview/states
 * State-level risk distribution and progress aggregates.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewStates = asyncHandler(async (req, res) => {
  const [
    worksByState,
    completedByState,
    highRiskByState,
    medRiskByState,
    lowRiskByState,
    statesList,
  ] = await Promise.all([
    // Work count and total sanctioned amount grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
      },
      _count: { _all: true },
      _sum: { sanctioned_amount: true },
    }),

    // Count of completed works grouped by state (for completion rate calculations)
    prisma.work.groupBy({
      by: ["state_id"],
      where: { status: "Completed" },
      _count: { _all: true },
    }),

    // Count of High-risk flagged works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "High" },
      },
      _count: { _all: true },
    }),

    // Count of Medium-risk flagged works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Medium" },
      },
      _count: { _all: true },
    }),

    // Count of Low-risk works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Low" },
      },
      _count: { _all: true },
    }),

    // Reference list of all states to map state_id to state_name
    prisma.state.findMany({
      select: { state_id: true, state_name: true },
    }),
  ]);

  const completedMap = new Map(
    completedByState.map((c) => [c.state_id, c._count._all])
  );
  const highRiskMap = new Map(
    highRiskByState.map((h) => [h.state_id, h._count._all])
  );
  const medRiskMap = new Map(
    medRiskByState.map((m) => [m.state_id, m._count._all])
  );
  const lowRiskMap = new Map(
    lowRiskByState.map((l) => [l.state_id, l._count._all])
  );
  const stateNameMap = new Map(
    statesList.map((s) => [s.state_id, s.state_name])
  );

  const statesData = worksByState.map((w) => {
    const stateName = stateNameMap.get(w.state_id) || `State ${w.state_id}`;
    const totalWorks = w._count._all;
    const completed = completedMap.get(w.state_id) || 0;
    const sanctionedCr = Number(
      (Number(w._sum.sanctioned_amount || 0) / 10000000).toFixed(2)
    );
    const highRisk = highRiskMap.get(w.state_id) || 0;
    const medRisk = medRiskMap.get(w.state_id) || 0;
    const lowRisk = lowRiskMap.get(w.state_id) || 0;
    const flaggedCount = highRisk + medRisk;

    // riskIndex calculation: (highRisk*3 + medRisk*1.5 + lowRisk*0.5) / totalWorksInState, capped at 10, 1dp
    const rawRiskIndex =
      totalWorks > 0
        ? (highRisk * 3 + medRisk * 1.5 + lowRisk * 0.5) / totalWorks
        : 0;
    const riskIndex = Number(Math.min(10, rawRiskIndex).toFixed(1));

    return {
      code: getStateCode(stateName),
      state: stateName,
      flaggedCount,
      highRisk,
      medRisk,
      lowRisk,
      riskIndex,
      sanctionedCr,
      completed,
      totalWorks,
    };
  });

  return res.status(200).json({
    statesData,
  });
});

/**
 * GET /api/ministry/overview/urgent
 * Top 5 states requiring immediate attention sorted by riskIndex desc.
 * Fully independent query execution.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewUrgent = asyncHandler(async (req, res) => {
  const [
    worksByState,
    completedByState,
    highRiskByState,
    medRiskByState,
    lowRiskByState,
    statesList,
  ] = await Promise.all([
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
      },
      _count: { _all: true },
      _sum: { sanctioned_amount: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: { status: "Completed" },
      _count: { _all: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "High" },
      },
      _count: { _all: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Medium" },
      },
      _count: { _all: true },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Low" },
      },
      _count: { _all: true },
    }),
    prisma.state.findMany({
      select: { state_id: true, state_name: true },
    }),
  ]);

  const completedMap = new Map(
    completedByState.map((c) => [c.state_id, c._count._all])
  );
  const highRiskMap = new Map(
    highRiskByState.map((h) => [h.state_id, h._count._all])
  );
  const medRiskMap = new Map(
    medRiskByState.map((m) => [m.state_id, m._count._all])
  );
  const lowRiskMap = new Map(
    lowRiskByState.map((l) => [l.state_id, l._count._all])
  );
  const stateNameMap = new Map(
    statesList.map((s) => [s.state_id, s.state_name])
  );

  const statesData = worksByState.map((w) => {
    const stateName = stateNameMap.get(w.state_id) || `State ${w.state_id}`;
    const totalWorks = w._count._all;
    const completed = completedMap.get(w.state_id) || 0;
    const sanctionedCr = Number(
      (Number(w._sum.sanctioned_amount || 0) / 10000000).toFixed(2)
    );
    const highRisk = highRiskMap.get(w.state_id) || 0;
    const medRisk = medRiskMap.get(w.state_id) || 0;
    const lowRisk = lowRiskMap.get(w.state_id) || 0;
    const flaggedCount = highRisk + medRisk;

    const rawRiskIndex =
      totalWorks > 0
        ? (highRisk * 3 + medRisk * 1.5 + lowRisk * 0.5) / totalWorks
        : 0;
    const riskIndex = Number(Math.min(10, rawRiskIndex).toFixed(1));

    return {
      code: getStateCode(stateName),
      state: stateName,
      flaggedCount,
      highRisk,
      medRisk,
      lowRisk,
      riskIndex,
      sanctionedCr,
      completed,
      totalWorks,
    };
  });

  const topAttentionStates = [...statesData]
    .sort((a, b) => b.riskIndex - a.riskIndex)
    .slice(0, 5);

  return res.status(200).json({
    topAttentionStates,
  });
});

/**
 * GET /api/ministry/overview/alerts
 * Top 10 most recent High/Medium risk alerts nationwide with deterministic ordering.
 * Protected: protect, restrictTo('ministry')
 */
export const getOverviewAlerts = asyncHandler(async (req, res) => {
  const recentAlertsRows = await prisma.riskScore.findMany({
    where: {
      is_current: true,
      risk_level: { in: ["Medium", "High"] },
      work: {
        status: { not: "Recommended" },
      },
    },
    orderBy: [
      { risk_score: "desc" },
      { calculated_at: "desc" },
      { risk_id: "desc" },
    ],
    take: 10,
    include: {
      work: {
        include: {
          state: true,
          district: true,
          mp: true,
        },
      },
    },
  });

  const recentAlerts = recentAlertsRows
    .filter((r) => r.work)
    .map((r) => {
      const rawAmount =
        r.work.sanctioned_amount !== null && r.work.sanctioned_amount !== undefined
          ? r.work.sanctioned_amount
          : r.work.recommended_amount;
      const isEstimated =
        (r.work.sanctioned_amount === null || r.work.sanctioned_amount === undefined) &&
        r.work.recommended_amount !== null &&
        r.work.recommended_amount !== undefined;
      const sanctionedAmount =
        rawAmount !== null && rawAmount !== undefined && Number(rawAmount) > 0
          ? Number((Number(rawAmount) / 100000).toFixed(1))
          : null;

      return {
        workId: r.work.work_id,
        state: r.work.state?.state_name || "",
        district: r.work.district?.district_name || "",
        mpName: r.work.mp?.mp_name || "",
        riskLevel: r.risk_level || "High",
        riskScore: r.risk_score !== null ? Number(r.risk_score) : 0,
        flagReason: r.flag_reason || "",
        sanctionedAmount,
        isEstimated,
      };
    });

  return res.status(200).json({
    recentAlerts,
  });
});

/**
 * GET /api/ministry/flagged
 * Returns flagged cases (RiskScore.risk_level IN ('Medium', 'High'))
 * with optional filtering by search, state, category, riskLevel, status, and financialYear.
 * Protected: protect, restrictTo('ministry')
 *
 * Status Filtering & Two-Pass Resolution:
 * Direct statuses ('Completed', 'Sanctioned', 'Ongoing') map 1:1 to database enums and are filtered in SQL.
 * Virtual statuses ('Under Review', 'Delayed') depend on multi-factor precedence logic in getDisplayStatus():
 * Pass 1: Query lightweight minimal fields (work_id, status, completion_date, current_risk_score.risk_level,
 *         current_risk_score.delay_slippage_pct, current_risk_score.flag_reason, escalations, auditor_reports.status)
 *         for candidate works matching all other active filters.
 * JS Filter: Apply getDisplayStatus(work) to collect matchedWorkIds.
 * Early Exit: If matchedWorkIds is empty, return immediately with empty data array (skipping Pass 2).
 * Pass 2: Query full paginated data only for the current page with work_id IN matchedWorkIds.
 */
export const getFlaggedWorks = asyncHandler(async (req, res) => {
  const { search, state, category, riskLevel, status, financialYear } = req.query;

  // Base flagged-works criteria: Sanctioned works with current RiskScore in Medium or High
  const baseFlaggedWhere = {
    status: { not: "Recommended" },
    current_risk_score: {
      risk_level: {
        in: ["Medium", "High"],
      },
    },
  };

  // Safe limit cap: enforce minimum 1 and ceiling 100
  const page = Math.max(1, parseInt(req.query.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 10, 10)));
  const skip = (page - 1) * limit;
  const take = limit;

  const { sortField = "riskScore", sortDirection = "desc" } = req.query;
  const dir = (sortDirection || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  // Determine database sorting
  let orderByClause = { current_risk_score: { risk_score: dir } };
  if (sortField === "workId") {
    orderByClause = { work_id: dir };
  } else if (sortField === "mpName") {
    orderByClause = { mp: { mp_name: dir } };
  } else if (sortField === "state") {
    orderByClause = { state: { state_name: dir } };
  } else if (sortField === "category") {
    orderByClause = { category: dir };
  } else if (sortField === "sanctionedAmount") {
    orderByClause = { sanctioned_amount: dir };
  } else if (sortField === "sanctionDate") {
    orderByClause = { sanction_date: dir };
  }

  // Fetch availableStates and availableCategories strictly from the fixed base flagged criteria
  // completely independent of any active filters (prevents self-collapsing dropdowns)
  const [distinctStates, distinctCategories] = await Promise.all([
    prisma.state.findMany({
      where: {
        works: {
          some: baseFlaggedWhere,
        },
      },
      select: { state_name: true },
      orderBy: { state_name: "asc" },
    }),
    prisma.work.findMany({
      where: {
        ...baseFlaggedWhere,
        category: { not: null },
      },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
  ]);

  const availableStates = distinctStates.map((s) => s.state_name).filter(Boolean);
  const availableCategories = distinctCategories.map((c) => c.category).filter(Boolean);

  // Build the active filter query where clause
  const where = {
    ...baseFlaggedWhere,
    current_risk_score: { ...baseFlaggedWhere.current_risk_score },
    AND: [],
  };

  // 1. riskLevel filter (matches RiskScore.risk_level)
  if (riskLevel && riskLevel !== "All") {
    where.current_risk_score.risk_level = riskLevel;
  }

  // 2. state filter (matches State.state_name)
  if (state && state !== "All") {
    where.state = {
      state_name: {
        equals: state,
        mode: "insensitive",
      },
    };
  }

  // 3. category filter (matches Work.category)
  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // 4. financialYear filter (matches Work.sanction_date falling in that Indian FY)
  if (financialYear && financialYear !== "All") {
    const fyRange = computeFinancialYearRange(financialYear);
    if (fyRange) {
      where.sanction_date = {
        gte: fyRange.start,
        lte: fyRange.end,
      };
    }
  }

  // 5. search filter: separate { OR: [...] } pushed to where.AND (ensures AND logic with status/other filters)
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.AND.push({
      OR: [
        { work_id: { contains: q, mode: "insensitive" } },
        { mp: { mp_name: { contains: q, mode: "insensitive" } } },
        { district: { district_name: { contains: q, mode: "insensitive" } } },
        {
          expenditures: {
            some: {
              vendor: {
                vendor_name: { contains: q, mode: "insensitive" },
              },
            },
          },
        },
      ],
    });
  }

  // Status Filter Determination
  let isTwoPassStatus = false;
  let targetStatus = null;

  if (status && status !== "All") {
    targetStatus = status.trim().toLowerCase();
    if (targetStatus === "completed") {
      where.status = "Completed";
    } else if (targetStatus === "sanctioned") {
      where.status = "Sanctioned";
    } else if (targetStatus === "ongoing") {
      where.status = "Ongoing";
    } else if (targetStatus === "under review" || targetStatus === "delayed") {
      isTwoPassStatus = true;
    }
  }

  if (where.AND.length === 0) {
    delete where.AND;
  }

  const fullSelect = {
    work_id: true,
    category: true,
    sanctioned_amount: true,
    sanction_date: true,
    completion_date: true,
    status: true,
    mp: {
      select: {
        mp_name: true,
      },
    },
    state: {
      select: {
        state_name: true,
      },
    },
    district: {
      select: {
        district_name: true,
      },
    },
    current_risk_score: {
      select: {
        risk_score: true,
        risk_level: true,
        delay_slippage_pct: true,
        flag_reason: true,
      },
    },
    expenditures: {
      select: {
        amount: true,
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
  };

  let total = 0;
  let works = [];

  if (isTwoPassStatus) {
    // Pass 1: Lightweight candidate query with minimal fields strictly needed by getDisplayStatus
    const candidates = await prisma.work.findMany({
      where,
      select: {
        work_id: true,
        status: true,
        completion_date: true,
        current_risk_score: {
          select: {
            risk_level: true,
            delay_slippage_pct: true,
            flag_reason: true,
          },
        },
        escalations: {
          select: {
            escalation_id: true,
          },
        },
        auditor_reports: {
          select: {
            status: true,
          },
        },
      },
    });

    const matchedWorkIds = candidates
      .filter((w) => getDisplayStatus(w).toLowerCase() === targetStatus)
      .map((w) => w.work_id);

    total = matchedWorkIds.length;

    // Early exit if no candidate matched the virtual status (do not construct or run Pass 2)
    if (total === 0) {
      return res.status(200).json({
        data: [],
        total: 0,
        availableStates,
        availableCategories,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    }

    // Pass 2: Query full paginated data only for the current page
    works = await prisma.work.findMany({
      where: {
        ...where,
        work_id: { in: matchedWorkIds },
      },
      skip,
      take,
      orderBy: [orderByClause, { work_id: "desc" }],
      select: fullSelect,
    });
  } else {
    // Standard direct database query
    const [dbTotal, dbWorks] = await prisma.$transaction([
      prisma.work.count({ where }),
      prisma.work.findMany({
        where,
        skip,
        take,
        orderBy: [orderByClause, { work_id: "desc" }],
        select: fullSelect,
      }),
    ]);
    total = dbTotal;
    works = dbWorks;
  }

  // Map returned records
  const data = works.map((work) => {
    const computedStatus = getDisplayStatus(work);
    const rs = work.current_risk_score;
    const fraudRiskScore =
      rs?.risk_score !== null && rs?.risk_score !== undefined
        ? Number(rs.risk_score)
        : 0;
    const fraudRiskTier = rs?.risk_level || "Medium";

    // dataConfidence calculation
    const dataConfidence = Math.min(
      96,
      Math.max(62, Math.round((fraudRiskScore || 50) * 0.35 + 55))
    );

    let inefficiencyScore;
    let inefficiencyTier;
    if (rs?.delay_slippage_pct !== null && rs?.delay_slippage_pct !== undefined) {
      const rawDelay = Number(rs.delay_slippage_pct);
      inefficiencyScore = Math.round(rawDelay);
      if (rawDelay < 30) {
        inefficiencyTier = "Low";
      } else if (rawDelay <= 60) {
        inefficiencyTier = "Medium";
      } else {
        inefficiencyTier = "High";
      }
    }

    const expenditure = Number(
      (work.expenditures || [])
        .reduce((sum, e) => sum + Number(e.amount || 0), 0)
        .toFixed(2)
    );

    const item = {
      workId: work.work_id,
      mpName: work.mp?.mp_name || "",
      state: work.state?.state_name || "",
      district: work.district?.district_name || "",
      category: work.category || "",
      fraudRiskScore,
      fraudRiskTier,
      riskScore: fraudRiskScore,
      riskLevel: fraudRiskTier,
      dataConfidence,
      flagReason: rs?.flag_reason || "",
      sanctionedAmount: Number(Number(work.sanctioned_amount || 0).toFixed(2)),
      expenditure,
      status: computedStatus,
    };

    if (inefficiencyScore !== undefined) {
      item.inefficiencyScore = inefficiencyScore;
      item.inefficiencyTier = inefficiencyTier;
    }

    return item;
  });

  const totalPages = Math.ceil(total / limit) || 1;

  return res.status(200).json({
    data,
    total,
    availableStates,
    availableCategories,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});

/**
 * GET /api/ministry/mp-performance
 * MP Performance leaderboard and portfolio analytics with dynamic filtering.
 * Role: ministry
 */
export const getMpPerformance = asyncHandler(async (req, res) => {
  const result = await getMpLeaderboardService(req.query);
  return res.status(200).json(result);
});

/**
 * Helper: Resolves state/district query parameters to stateId and districtId.
 * Supports state/district passed as names or as numeric IDs.
 */
async function resolveLocationParams(query = {}) {
  const { state, district, stateId, districtId } = query;
  let resolvedStateId = stateId ? parseInt(stateId, 10) : null;
  let resolvedDistrictId = districtId ? parseInt(districtId, 10) : null;

  if (!resolvedStateId && state && state !== "ALL") {
    const isNum = !isNaN(Number(state)) && Number.isInteger(Number(state));
    const s = await prisma.state.findFirst({
      where: isNum
        ? { state_id: Number(state) }
        : { state_name: { equals: state, mode: "insensitive" } },
      select: { state_id: true },
    });
    if (s) resolvedStateId = s.state_id;
  }

  if (!resolvedDistrictId && district && district !== "ALL") {
    const isNum = !isNaN(Number(district)) && Number.isInteger(Number(district));
    const d = await prisma.district.findFirst({
      where: {
        ...(isNum
          ? { district_id: Number(district) }
          : { district_name: { equals: district, mode: "insensitive" } }),
        ...(resolvedStateId ? { state_id: resolvedStateId } : {}),
      },
      select: { district_id: true },
    });
    if (d) resolvedDistrictId = d.district_id;
  }

  return { stateId: resolvedStateId, districtId: resolvedDistrictId };
}

/**
 * GET /api/ministry/trends/monthly
 * 12-month time series of flagged works, cost overruns, and timeline stalls.
 * Role: ministry
 */
export const getTrendsMonthly = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const monthlyTrends = await getMonthlyTrends(filters);
  return res.status(200).json({ monthlyTrends });
});

/**
 * GET /api/ministry/trends/categories
 * Top work categories with Medium or High risk scores.
 * Role: ministry
 */
export const getTrendsCategories = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const categoryAnomalies = await getCategoryAnomalies(filters);
  return res.status(200).json({ categoryAnomalies });
});

/**
 * GET /api/ministry/trends/vendors
 * Contractor concentration forensics and risk ratio analysis.
 * Role: ministry
 */
export const getTrendsVendors = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const topVendors = await getTopVendors(filters);
  return res.status(200).json({ topVendors });
});

/**
 * GET /api/ministry/trends/states
 * State performance vs risk comparison table.
 * Role: ministry
 */
export const getTrendsStates = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const stateComparison = await getStateComparison(filters);
  return res.status(200).json({ stateComparison });
});

/**
 * GET /api/ministry/trends/locations
 * State and district hierarchy for dynamic filtering dropdowns.
 * Role: ministry
 */
export const getTrendsLocations = asyncHandler(async (req, res) => {
  const states = await getTrendsLocationsService();
  return res.status(200).json({ states });
});

/**
 * GET /api/ministry/trends
 * Backwards-compatible consolidated trends endpoint.
 * Macro pattern discovery, temporal anomaly trajectories, sector vulnerability,
 * contractor concentration forensics, and state efficiency comparison.
 * Role: ministry
 */
export const getTrendsAnalytics = asyncHandler(async (req, res) => {
  const filters = await resolveLocationParams(req.query);
  const [monthlyTrends, categoryAnomalies, topVendors, stateComparison] =
    await Promise.all([
      getMonthlyTrends(filters),
      getCategoryAnomalies(filters),
      getTopVendors(filters),
      getStateComparison(filters),
    ]);

  return res.status(200).json({
    monthlyTrends,
    categoryAnomalies,
    topVendors,
    stateComparison,
  });
});

/**
 * GET /api/ministry/predictions
 * Predictive Risk Watchlist with dynamic filtering by search, state, category.
 * Role: ministry
 */
export const getPredictions = asyncHandler(async (req, res) => {
  const result = await getPredictiveWatchlistService(req.query);
  return res.status(200).json(result);
});




