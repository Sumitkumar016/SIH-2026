import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Checks whether fund utilization falls within the chosen percentage range.
 */
function matchesUtilizationRange(utilization, range) {
  if (!range || range === "All") return true;
  if (utilization === null || isNaN(utilization)) return false;

  if (range === ">100") return utilization > 100;
  if (range === "75-100") return utilization >= 75 && utilization <= 100;
  if (range === "50-75") return utilization >= 50 && utilization < 75;
  if (range === "25-50") return utilization >= 25 && utilization < 50;
  if (range === "0-25") return utilization >= 0 && utilization < 25;

  return true;
}

/**
 * Checks whether project completion rate falls within the chosen percentage range.
 */
function matchesCompletionRange(completionRate, range) {
  if (!range || range === "All") return true;
  if (completionRate === null || isNaN(completionRate)) return false;

  if (range === "75-100") return completionRate >= 75 && completionRate <= 100;
  if (range === "50-75") return completionRate >= 50 && completionRate < 75;
  if (range === "25-50") return completionRate >= 25 && completionRate < 50;
  if (range === "0-25") return completionRate >= 0 && completionRate < 25;

  return true;
}

/**
 * services/mpPerformance.service.js
 * Aggregates MP-level performance metrics across Works and Expenditures.
 * Supports filtering by search, state, district, utilizationRange, completionRange,
 * and sorting by sortField and sortDirection.
 *
 * @param {Object} filters
 * @returns {Promise<{ data: Array, availableStates: Array<string>, availableDistricts: Array<string> }>}
 */
export async function getMpLeaderboard(filters = {}) {
  const {
    search,
    state,
    district,
    utilizationRange,
    completionRange,
    sortField = "fundUtilization",
    sortDirection = "desc",
  } = filters;

  // 1. Query MPs with their works and expenditures
  const mps = await prisma.mp.findMany({
    where: {
      works: {
        some: {},
      },
    },
    select: {
      mp_id: true,
      mp_name: true,
      constituency: true,
      state: {
        select: {
          state_name: true,
        },
      },
      works: {
        select: {
          work_id: true,
          category: true,
          sanctioned_amount: true,
          status: true,
          completion_date: true,
          district: {
            select: {
              district_name: true,
            },
          },
          state: {
            select: {
              state_name: true,
            },
          },
          expenditures: {
            select: {
              amount: true,
            },
          },
          current_risk_score: {
            select: {
              delay_slippage_pct: true,
              flag_reason: true,
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
      },
    },
  });

  const allStatesSet = new Set();
  const allDistrictsSet = new Set();

  // 2. Aggregate metrics for each MP
  const aggregatedMps = [];

  for (const mp of mps) {
    let totalSanctionedAmount = 0;
    let totalExpenditure = 0;
    const totalWorks = mp.works.length;
    let completedWorks = 0;
    let ongoingWorks = 0;
    let underReviewWorks = 0;
    const categories = {};
    const mpDistricts = new Set();

    for (const work of mp.works) {
      const sanctioned = Number(work.sanctioned_amount || 0);
      totalSanctionedAmount += sanctioned;

      // Sum expenditures for this work
      let workExp = 0;
      for (const e of work.expenditures || []) {
        workExp += Number(e.amount || 0);
      }
      totalExpenditure += workExp;

      if (work.status === "Completed") {
        completedWorks += 1;
      }

      const dispStatus = getDisplayStatus(work);
      if (dispStatus === "Ongoing") {
        ongoingWorks += 1;
      } else if (dispStatus === "Under Review") {
        underReviewWorks += 1;
      }

      if (work.category) {
        categories[work.category] = (categories[work.category] || 0) + 1;
      }

      if (work.district?.district_name) {
        mpDistricts.add(work.district.district_name);
        allDistrictsSet.add(work.district.district_name);
      }
    }

    const stateName =
      mp.state?.state_name || (mp.works[0]?.state?.state_name || "");
    if (stateName) {
      allStatesSet.add(stateName);
    }

    const primaryDistrict =
      Array.from(mpDistricts)[0] || mp.constituency || "";
    if (primaryDistrict) {
      allDistrictsSet.add(primaryDistrict);
    }

    totalSanctionedAmount = Number(totalSanctionedAmount.toFixed(2));
    totalExpenditure = Number(totalExpenditure.toFixed(2));

    // Calculate fund utilization percentage (null if no sanctioned funds)
    const fundUtilization =
      totalSanctionedAmount > 0
        ? Number(((totalExpenditure / totalSanctionedAmount) * 100).toFixed(1))
        : null;

    // Calculate completion rate percentage (null if no works)
    const completionRate =
      totalWorks > 0
        ? Number(((completedWorks / totalWorks) * 100).toFixed(1))
        : null;

    aggregatedMps.push({
      mpName: mp.mp_name || "",
      state: stateName,
      district: primaryDistrict,
      constituency: mp.constituency || "",
      fundUtilization,
      totalSanctionedAmount,
      totalExpenditure,
      totalWorks,
      completedWorks,
      ongoingWorks,
      underReviewWorks,
      completionRate,
      categories,
      _allDistricts: Array.from(mpDistricts),
    });
  }

  const availableStates = Array.from(allStatesSet).sort();
  const availableDistricts = Array.from(allDistrictsSet).sort();

  // 3. Apply filters in memory
  let filtered = [...aggregatedMps];

  // Search filter
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.mpName.toLowerCase().includes(q) ||
        m.constituency.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q) ||
        m._allDistricts.some((d) => d.toLowerCase().includes(q))
    );
  }

  // State filter
  if (state && state !== "All") {
    const targetState = state.trim().toLowerCase();
    filtered = filtered.filter((m) => m.state.toLowerCase() === targetState);
  }

  // District filter
  if (district && district !== "All") {
    const targetDistrict = district.trim().toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.district.toLowerCase() === targetDistrict ||
        m.constituency.toLowerCase() === targetDistrict ||
        m._allDistricts.some((d) => d.toLowerCase() === targetDistrict)
    );
  }

  // Utilization range filter
  if (utilizationRange && utilizationRange !== "All") {
    filtered = filtered.filter((m) =>
      matchesUtilizationRange(m.fundUtilization, utilizationRange)
    );
  }

  // Completion range filter
  if (completionRange && completionRange !== "All") {
    filtered = filtered.filter((m) =>
      matchesCompletionRange(m.completionRate, completionRange)
    );
  }

  // 4. Sort results
  const validFields = [
    "mpName",
    "state",
    "constituency",
    "district",
    "fundUtilization",
    "completionRate",
    "totalWorks",
    "totalSanctionedAmount",
    "totalExpenditure",
  ];
  const field = validFields.includes(sortField) ? sortField : "fundUtilization";
  const direction = (sortDirection || "desc").toLowerCase() === "asc" ? "asc" : "desc";

  filtered.sort((a, b) => {
    const valA = a[field];
    const valB = b[field];

    // Place nulls at the end
    if (valA === null || valA === undefined || isNaN(valA)) {
      return valB === null || valB === undefined || isNaN(valB) ? 0 : 1;
    }
    if (valB === null || valB === undefined || isNaN(valB)) {
      return -1;
    }

    if (typeof valA === "string") {
      const cmp = valA.localeCompare(valB, undefined, { sensitivity: "base" });
      return direction === "asc" ? cmp : -cmp;
    }

    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // 5. Rankable Top 5 / Bottom 5 (by fundUtilization)
  const rankableMps = aggregatedMps.filter(
    (mp) => mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
  );

  const top5 = [...rankableMps]
    .sort((a, b) => b.fundUtilization - a.fundUtilization)
    .slice(0, 5)
    .map((mp, index) => {
      const { _allDistricts, ...rest } = mp;
      return { ...rest, rank: index + 1 };
    });

  const bottom5 = [...rankableMps]
    .sort((a, b) => a.fundUtilization - b.fundUtilization)
    .slice(0, 5)
    .map((mp, index) => {
      const { _allDistricts, ...rest } = mp;
      return { ...rest, rank: index + 1 };
    });

  // Remove internal helper field _allDistricts from output
  const data = filtered.map(({ _allDistricts, ...cleanItem }) => cleanItem);

  return {
    data,
    availableStates,
    availableDistricts,
    top5,
    bottom5,
  };
}

export default {
  getMpLeaderboard,
};
