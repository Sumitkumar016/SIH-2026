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
} from "../services/trendsAnalytics.service.js";
import { getPredictiveWatchlist as getPredictiveWatchlistService } from "../services/prediction.service.js";


/**
 * GET /api/ministry/overview
 * National Overview metrics & telemetry for Ministry (National View).
 * Aggregates KPIs, state risk breakdown, top attention states, and recent alerts.
 * Protected: protect, restrictTo('ministry')
 */
export const getNationalOverview = asyncHandler(async (req, res) => {
  const [
    totalWorksRecommended,
    totalSanctionedWorks,
    sanctionedAgg,
    totalCompletedWorks,
    expenditureAgg,
    totalFlaggedCases,
    riskScoreGroups,
    worksByState,
    completedByState,
    highRiskByState,
    medRiskByState,
    lowRiskByState,
    statesList,
    recentAlertsRows,
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

    // Query 7: Breakdown count of flagged works across risk levels for sanctioned works
    prisma.riskScore.groupBy({
      by: ["risk_level"],
      where: {
        is_current: true,
        work: {
          status: { not: "Recommended" },
        },
      },
      _count: { _all: true },
    }),

    // Query 8: Work count and total sanctioned amount grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
      },
      _count: { _all: true },
      _sum: { sanctioned_amount: true },
    }),

    // Query 9: Count of completed works grouped by state (for completion rate calculations)
    prisma.work.groupBy({
      by: ["state_id"],
      where: { status: "Completed" },
      _count: { _all: true },
    }),

    // Query 10: Count of High-risk flagged works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "High" },
      },
      _count: { _all: true },
    }),

    // Query 11: Count of Medium-risk flagged works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Medium" },
      },
      _count: { _all: true },
    }),

    // Query 12: Count of Low-risk works grouped by state (sanctioned works)
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        status: { not: "Recommended" },
        current_risk_score: { risk_level: "Low" },
      },
      _count: { _all: true },
    }),

    // Query 13: Reference list of all states to map state_id to state_name
    prisma.state.findMany({
      select: { state_id: true, state_name: true },
    }),

    // Query 14: Top 10 most recent High/Medium risk alerts with deterministic ordering
    prisma.riskScore.findMany({
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
    }),
  ]);

  // Compute KPI numbers
  // Stored in Rupees. Rupees to Crores: / 10,000,000, rounded to 2 decimal places
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

  // Severity breakdown strictly represents the canonical flagged cases population (Medium + High)
  const riskDistribution = { low: 0, medium: 0, high: 0 };
  riskScoreGroups.forEach((g) => {
    if (g.risk_level === "Medium") riskDistribution.medium = g._count._all;
    if (g.risk_level === "High") riskDistribution.high = g._count._all;
  });
  // Low-risk works are within SLA tolerance and not flagged for review
  riskDistribution.low = 0;

  const kpis = {
    totalWorksRecommended,
    totalSanctionedWorks,
    totalSanctionedCr,
    totalCompletedWorks,
    completionRate,
    totalExpenditureCr,
    expenditureRatio,
    totalFlaggedCases,
    flaggedRatePercent,
    riskDistribution,
  };

  // Map state aggregates
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

  // Top 5 statesData entries sorted by riskIndex desc
  const topAttentionStates = [...statesData]
    .sort((a, b) => b.riskIndex - a.riskIndex)
    .slice(0, 5);

  // Map 10 recent alerts with robust amount handling and Lakh conversion
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
    kpis,
    statesData,
    topAttentionStates,
    recentAlerts,
  });
});

/**
 * GET /api/ministry/flagged
 * Returns flagged cases (RiskScore.risk_level IN ('Medium', 'High'))
 * with optional filtering by search, state, category, riskLevel, status, and financialYear.
 * Protected: protect, restrictTo('ministry')
 */
export const getFlaggedWorks = asyncHandler(async (req, res) => {
  const { search, state, category, riskLevel, status, financialYear } = req.query;

  // Base filter: Only include sanctioned works that have a current RiskScore with risk_level IN ('Medium', 'High')
  const where = {
    status: { not: "Recommended" },
    current_risk_score: {
      risk_level: {
        in: ["Medium", "High"],
      },
    },
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

  // 5. search filter (case-insensitive match against Work.work_id, Mp.mp_name, District.district_name, and Vendor.vendor_name)
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
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
    ];
  }

  // Fetch only necessary columns from database
  const works = await prisma.work.findMany({
    where,
    select: {
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
    },
    orderBy: {
      sanction_date: "desc",
    },
  });

  // Map to response shape and compute in-memory display status
  let data = works.map((work) => {
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

  // Apply display status filter in JS (NOT a raw Prisma where clause)
  if (status && status !== "All") {
    const targetStatus = status.trim().toLowerCase();
    data = data.filter((w) => w.status.toLowerCase() === targetStatus);
  }

  return res.status(200).json({
    data,
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
 * GET /api/ministry/trends
 * Macro pattern discovery, temporal anomaly trajectories, sector vulnerability,
 * contractor concentration forensics, and state efficiency comparison.
 * Role: ministry
 */
export const getTrendsAnalytics = asyncHandler(async (req, res) => {
  const [monthlyTrends, categoryAnomalies, topVendors, stateComparison] =
    await Promise.all([
      getMonthlyTrends(),
      getCategoryAnomalies(),
      getTopVendors(),
      getStateComparison(),
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




