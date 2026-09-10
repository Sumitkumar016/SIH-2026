import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Business Rule Helper:
 * Checks if a vendor has a flagged works ratio greater than 40%.
 */
function hasHighFlaggedRate(flaggedCount, worksAwarded) {
  if (!worksAwarded || worksAwarded <= 0) return false;
  const flaggedRate = flaggedCount / worksAwarded;
  return flaggedRate > 0.4;
}

/**
 * Business Rule Helper:
 * Checks if a vendor operates exclusively in a single state across 5 or more awarded contracts.
 */
function worksMostlyInOneState(stateCount, worksAwarded) {
  return stateCount === 1 && worksAwarded >= 5;
}

/**
 * 1. getMonthlyTrends
 * Last 12 months, oldest first, bucketed by RiskScore.calculated_at.
 * - totalFlagged = count of RiskScore rows with riskLevel IN ('Medium','High')
 * - costOverrun = flagged rows where cost_overrun_pct > 0
 * - delayStall = flagged works where getDisplayStatus(work) === 'Delayed'
 *
 * @returns {Promise<Array<{ month: string, totalFlagged: number, costOverrun: number, delayStall: number }>>}
 */
export async function getMonthlyTrends() {
  // Find the most recent risk calculation date to use as reference
  const latestRow = await prisma.riskScore.findFirst({
    where: { risk_level: { in: ["Medium", "High"] } },
    orderBy: { calculated_at: "desc" },
    select: { calculated_at: true },
  });

  const now = new Date();
  const refDate = latestRow?.calculated_at ? new Date(latestRow.calculated_at) : now;

  const months = [];
  const monthMap = new Map();

  // Generate buckets for the last 12 months (oldest first)
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth() - i, 1));
    const year = d.getUTCFullYear();
    const monthIndex = d.getUTCMonth();
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

    const bucket = {
      month: label,
      totalFlagged: 0,
      costOverrun: 0,
      delayStall: 0,
    };

    months.push(bucket);
    monthMap.set(key, bucket);
  }

  const startDate = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth() - 11, 1, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));

  // Query risk scores in the 12-month window
  const riskScores = await prisma.riskScore.findMany({
    where: {
      risk_level: { in: ["Medium", "High"] },
      calculated_at: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      calculated_at: true,
      cost_overrun_pct: true,
      delay_slippage_pct: true,
      flag_reason: true,
      risk_score: true,
      work: {
        select: {
          work_id: true,
          status: true,
          completion_date: true,
          auditor_reports: {
            select: { status: true },
          },
          escalations: {
            select: { escalation_id: true },
          },
        },
      },
    },
  });

  for (const rs of riskScores) {
    if (!rs.calculated_at) continue;

    const d = new Date(rs.calculated_at);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const bucket = monthMap.get(key);
    if (!bucket) continue;

    bucket.totalFlagged += 1;

    if (Number(rs.cost_overrun_pct || 0) > 0) {
      bucket.costOverrun += 1;
    }

    const workData = {
      ...rs.work,
      risk_score: rs,
    };
    if (getDisplayStatus(workData) === "Delayed") {
      bucket.delayStall += 1;
    }
  }

  return months;
}

/**
 * 2. getCategoryAnomalies
 * Top 6 work categories with Medium or High risk scores, sorted by count descending.
 *
 * @returns {Promise<Array<{ category: string, count: number }>>}
 */
export async function getCategoryAnomalies() {
  const groups = await prisma.work.groupBy({
    by: ["category"],
    where: {
      category: { not: null },
      risk_score: {
        risk_level: { in: ["Medium", "High"] },
      },
    },
    _count: {
      work_id: true,
    },
  });

  const formatted = groups
    .filter((g) => g.category)
    .map((g) => ({
        category: g.category,
        count: g._count.work_id,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return formatted;
}

/**
 * 3. getTopVendors
 * Groups expenditures by vendor, evaluates concentration risk, and returns top 5.
 *
 * @returns {Promise<Array<{
 *   vendor: string,
 *   stateConcentration: string,
 *   isSuspicious: boolean,
 *   riskRatio: string,
 *   worksAwarded: number,
 *   totalAmountCr: number,
 *   flaggedCount: number
 * }>>}
 */
export async function getTopVendors() {
  const vendors = await prisma.vendor.findMany({
    where: {
      expenditures: {
        some: {},
      },
    },
    select: {
      vendor_id: true,
      vendor_name: true,
      expenditures: {
        select: {
          amount: true,
          work: {
            select: {
              work_id: true,
              state: {
                select: {
                  state_name: true,
                },
              },
              risk_score: {
                select: {
                  risk_level: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const vendorStats = [];

  for (const v of vendors) {
    let totalExpenditureAmount = 0;
    const workMap = new Map();
    const stateSet = new Set();

    for (const exp of v.expenditures) {
      totalExpenditureAmount += Number(exp.amount || 0);

      if (exp.work) {
        const wId = exp.work.work_id;
        if (!workMap.has(wId)) {
          const stateName = exp.work.state?.state_name;
          if (stateName) {
            stateSet.add(stateName);
          }
          const riskLevel = exp.work.risk_score?.risk_level;
          const isFlagged = riskLevel === "Medium" || riskLevel === "High";
          workMap.set(wId, {
            stateName,
            isFlagged,
          });
        }
      }
    }

    const worksAwarded = workMap.size;
    if (worksAwarded === 0) continue;

    let flaggedCount = 0;
    for (const w of workMap.values()) {
      if (w.isFlagged) flaggedCount++;
    }

    const stateConcentration = Array.from(stateSet).sort().join(", ") || "N/A";
    const totalAmountCr = Number((totalExpenditureAmount / 100).toFixed(2));

    // Evaluate concentration risk criteria using descriptive helpers
    const highFlagged = hasHighFlaggedRate(flaggedCount, worksAwarded);
    const oneState = worksMostlyInOneState(stateSet.size, worksAwarded);
    const isSuspicious = highFlagged || oneState;

    const riskRatio = `${flaggedCount}:${worksAwarded}`;

    vendorStats.push({
      vendor: v.vendor_name,
      stateConcentration,
      isSuspicious,
      riskRatio,
      worksAwarded,
      totalAmountCr,
      flaggedCount,
    });
  }

  // Sort top 5 vendors by works awarded descending, then by total amount descending
  vendorStats.sort((a, b) => {
    if (b.worksAwarded !== a.worksAwarded) {
      return b.worksAwarded - a.worksAwarded;
    }
    return b.totalAmountCr - a.totalAmountCr;
  });

  return vendorStats.slice(0, 5);
}

/**
 * 4. getStateComparison
 * Top 10 states by total work count; completion rate and flagged percentage (0-100, 1dp).
 *
 * @returns {Promise<Array<{ state: string, completionRate: number, flaggedPercent: number }>>}
 */
export async function getStateComparison() {
  const stateWorkCounts = await prisma.work.groupBy({
    by: ["state_id"],
    _count: {
      work_id: true,
    },
    orderBy: {
      _count: {
        work_id: "desc",
      },
    },
    take: 10,
  });

  if (stateWorkCounts.length === 0) {
    return [];
  }

  const stateIds = stateWorkCounts.map((s) => s.state_id);

  // Fetch state names, completed counts, and flagged counts in parallel
  const [states, completedByState, flaggedByState] = await Promise.all([
    prisma.state.findMany({
      where: {
        state_id: { in: stateIds },
      },
      select: {
        state_id: true,
        state_name: true,
      },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        state_id: { in: stateIds },
        status: "Completed",
      },
      _count: {
        work_id: true,
      },
    }),
    prisma.work.groupBy({
      by: ["state_id"],
      where: {
        state_id: { in: stateIds },
        risk_score: {
          risk_level: { in: ["Medium", "High"] },
        },
      },
      _count: {
        work_id: true,
      },
    }),
  ]);

  const stateNameMap = new Map(states.map((s) => [s.state_id, s.state_name]));
  const completedMap = new Map(completedByState.map((c) => [c.state_id, c._count.work_id]));
  const flaggedMap = new Map(flaggedByState.map((f) => [f.state_id, f._count.work_id]));

  return stateWorkCounts.map((sw) => {
    const totalWorks = sw._count.work_id;
    const completedCount = completedMap.get(sw.state_id) || 0;
    const flaggedCount = flaggedMap.get(sw.state_id) || 0;

    const completionRate =
      totalWorks > 0
        ? Number(((completedCount / totalWorks) * 100).toFixed(1))
        : 0;

    const flaggedPercent =
      totalWorks > 0
        ? Number(((flaggedCount / totalWorks) * 100).toFixed(1))
        : 0;

    return {
      state: stateNameMap.get(sw.state_id) || `State ${sw.state_id}`,
      completionRate,
      flaggedPercent,
    };
    });
  }

export default {
  getMonthlyTrends,
  getCategoryAnomalies,
  getTopVendors,
  getStateComparison,
};
