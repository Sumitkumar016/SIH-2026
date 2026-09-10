import { prisma } from "../config/db.js";
import { buildWorkDetailResponse } from "./workDetail.service.js";

/**
 * services/stateOverview.service.js
 * State-level rollup of all districts in this state with comparative risk statistics.
 *
 * @param {number|string} stateId - State Primary Key (from req.user.state_id)
 * @returns {Promise<{ state: Object, kpis: Object, districts: Array }>}
 */
export async function getStateOverview(stateId) {
  const parsedStateId = parseInt(stateId, 10);
  if (isNaN(parsedStateId)) {
    const error = new Error("Invalid State ID");
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch State record
  const state = await prisma.state.findUnique({
    where: { state_id: parsedStateId },
  });

  if (!state) {
    const error = new Error("State profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch all districts belonging to this state
  const districts = await prisma.district.findMany({
    where: { state_id: parsedStateId },
    orderBy: { district_name: "asc" },
  });

  // 3. Fetch all works situated in this state
  const works = await prisma.work.findMany({
    where: { state_id: parsedStateId },
    include: {
      district: {
        select: {
          district_id: true,
          district_name: true,
        },
      },
      risk_score: true,
    },
  });

  // 4. Compute state-level summary KPIs in a single clean pass
  const totalWorks = works.length;
  const coveredDistrictIds = new Set();
  let totalSanctionedWorks = 0;
  let totalSanctionedAmount = 0;
  let totalCompleted = 0;
  let totalFlaggedCount = 0;
  let totalRiskScoreSum = 0;
  let scoredWorksCount = 0;

  for (const w of works) {
    if (w.district_id) {
      coveredDistrictIds.add(w.district_id);
    }

    if (w.status !== "Recommended") {
      totalSanctionedWorks += 1;
      totalSanctionedAmount += Number(w.sanctioned_amount || 0);
    }

    if (w.status === "Completed") {
      totalCompleted += 1;
    }

    if (
      w.risk_score &&
      (w.risk_score.risk_level === "Medium" || w.risk_score.risk_level === "High")
    ) {
      totalFlaggedCount += 1;
    }

    if (w.risk_score?.risk_score !== null && w.risk_score?.risk_score !== undefined) {
      totalRiskScoreSum += Number(w.risk_score.risk_score);
      scoredWorksCount += 1;
    }
  }

  const totalDistrictsCovered = coveredDistrictIds.size;
  const totalSanctionedCr = Number((totalSanctionedAmount / 100).toFixed(1));

  const completionRate =
    totalSanctionedWorks > 0
      ? Number(((totalCompleted / totalSanctionedWorks) * 100).toFixed(1))
      : 0;

  const avgRiskScore =
    scoredWorksCount > 0 ? Math.round(totalRiskScoreSum / scoredWorksCount) : 0;

  const kpis = {
    totalWorks,
    totalDistrictsCovered,
    totalSanctionedCr,
    totalCompleted,
    completionRate,
    totalFlaggedCount,
    avgRiskScore,
  };

  // 5. Per-district comparative statistics
  const districtWorksMap = new Map();
  for (const d of districts) {
    districtWorksMap.set(d.district_id, []);
  }
  for (const w of works) {
    if (districtWorksMap.has(w.district_id)) {
      districtWorksMap.get(w.district_id).push(w);
    }
  }

  const districtList = [];

  for (const d of districts) {
    const dWorks = districtWorksMap.get(d.district_id) || [];
    const dTotalWorks = dWorks.length;
    let dSanctionedAmount = 0;
    let dCompleted = 0;
    let flaggedCount = 0;
    let dRiskSum = 0;
    let dScoredCount = 0;

    for (const w of dWorks) {
      dSanctionedAmount += Number(w.sanctioned_amount || 0);
      if (w.status === "Completed") dCompleted += 1;

      if (
        w.risk_score &&
        (w.risk_score.risk_level === "Medium" || w.risk_score.risk_level === "High")
      ) {
        flaggedCount += 1;
      }

      if (w.risk_score?.risk_score !== null && w.risk_score?.risk_score !== undefined) {
        dRiskSum += Number(w.risk_score.risk_score);
        dScoredCount += 1;
      }
    }

    const sanctionedCr = Number((dSanctionedAmount / 100).toFixed(1));
    const dCompRate =
      dTotalWorks > 0 ? Number(((dCompleted / dTotalWorks) * 100).toFixed(1)) : 0;
    const dAvgRiskScore = dScoredCount > 0 ? Math.round(dRiskSum / dScoredCount) : 0;

    districtList.push({
      district: d.district_name,
      totalWorks: dTotalWorks,
      sanctionedCr,
      completionRate: dCompRate,
      flaggedCount,
      avgRiskScore: dAvgRiskScore,
    });
  }

  // Sort districts: highest flagged count first, then alphabetical by district name
  districtList.sort((a, b) => {
    if (b.flaggedCount !== a.flaggedCount) {
      return b.flaggedCount - a.flaggedCount;
    }
    return a.district.localeCompare(b.district);
  });

  return {
    state: {
      stateName: state.state_name || "",
      headquarters:
        state.headquarters || `State Secretariat, ${state.state_name}`,
      nodalDepartment:
        state.nodal_department ||
        state.nodalDepartment ||
        `Planning & Development Department, Govt of ${state.state_name}`,
    },
    kpis,
    districts: districtList,
  };
}

/**
 * Detailed drill-down summary for a single district under the authenticated state.
 * Returns district KPIs and top 3 highest-risk projects in full WorkDetail format.
 *
 * @param {number|string} stateId
 * @param {string} districtName
 * @returns {Promise<Object>}
 */
export async function getDistrictSummary(stateId, districtName) {
  const parsedStateId = parseInt(stateId, 10);
  if (isNaN(parsedStateId)) {
    const error = new Error("Invalid State ID");
    error.statusCode = 400;
    throw error;
  }

  if (!districtName || typeof districtName !== "string" || !districtName.trim()) {
    const error = new Error("District name is required");
    error.statusCode = 400;
    throw error;
  }

  // 1. Verify the district belongs to this state
  const district = await prisma.district.findFirst({
    where: {
      state_id: parsedStateId,
      district_name: {
        equals: districtName.trim(),
        mode: "insensitive",
      },
    },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
    },
  });

  if (!district) {
    const error = new Error("District not found in this state");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch all works for this district
  const works = await prisma.work.findMany({
    where: {
      district_id: district.district_id,
    },
    include: {
      mp: {
        select: {
          mp_id: true,
          mp_name: true,
          constituency: true,
        },
      },
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
      risk_score: true,
      prediction: true,
      auditor_reports: {
        orderBy: {
          submitted_date: "desc",
        },
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
        orderBy: {
          amount: "desc",
        },
      },
      work_progress: {
        orderBy: {
          report_date: "desc",
        },
        take: 1,
      },
      escalations: {
        select: {
          escalation_id: true,
        },
      },
    },
  });

  // 3. Compute district metrics in a single pass
  const totalWorks = works.length;
  let totalSanctionedAmount = 0;
  let completed = 0;
  let flaggedCount = 0;
  let totalRiskScoreSum = 0;
  let scoredCount = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  for (const w of works) {
    if (w.status !== "Recommended") {
      totalSanctionedAmount += Number(w.sanctioned_amount || 0);
    }
    if (w.status === "Completed") {
      completed += 1;
    }

    const rLevel = w.risk_score?.risk_level;
    if (rLevel === "High") high += 1;
    if (rLevel === "Medium") medium += 1;
    if (rLevel === "Low") low += 1;

    if (rLevel === "Medium" || rLevel === "High") {
      flaggedCount += 1;
    }

    if (w.risk_score?.risk_score !== null && w.risk_score?.risk_score !== undefined) {
      totalRiskScoreSum += Number(w.risk_score.risk_score);
      scoredCount += 1;
    }
  }

  const sanctionedCr = Number((totalSanctionedAmount / 100).toFixed(1));
  const completionRate =
    totalWorks > 0 ? Number(((completed / totalWorks) * 100).toFixed(1)) : 0;
  const avgRiskScore = scoredCount > 0 ? Math.round(totalRiskScoreSum / scoredCount) : 0;

  // 4. Top 3 highest-risk projects in this district
  const sortedWorks = [...works].sort((a, b) => {
    const scoreA = Number(a.risk_score?.risk_score || 0);
    const scoreB = Number(b.risk_score?.risk_score || 0);
    return scoreB - scoreA;
  });

  const top3Works = sortedWorks.slice(0, 3);
  const topRiskProjects = top3Works.map((w) => buildWorkDetailResponse(w));

  return {
    district: district.district_name,
    state: district.state?.state_name || "",
    totalWorks,
    sanctionedCr,
    completionRate,
    flaggedCount,
    avgRiskScore,
    completed,
    riskBreakdown: {
      high,
      medium,
      low,
    },
    topRiskProjects,
    topProjects: topRiskProjects,
  };
}

export default {
  getStateOverview,
  getDistrictSummary,
};
