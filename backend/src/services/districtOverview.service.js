import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * services/districtOverview.service.js
 * Comprehensive district-wide analytics across all MPs with works in this jurisdiction.
 *
 * @param {number|string} districtId - District Primary Key (from req.user.district_id)
 * @returns {Promise<{ district: Object, kpis: Object, mpBreakdown: Array }>}
 */
export async function getDistrictOverview(districtId) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  // 1. Load District record with linked State
  const district = await prisma.district.findUnique({
    where: { district_id: parsedDistrictId },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
    },
  });

  if (!district) {
    const error = new Error("District profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Load all works situated in this district
  const works = await prisma.work.findMany({
    where: {
      district_id: parsedDistrictId,
    },
    include: {
      mp: {
        select: {
          mp_id: true,
          mp_name: true,
          constituency: true,
        },
      },
      risk_score: true,
      expenditures: true,
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
  });

  // 3. Compute district-wide summary KPIs in a single clean pass
  const totalWorks = works.length;
  let totalSanctionedCount = 0;
  let totalSanctionedAmount = 0;
  let totalCompletedCount = 0;
  let totalFlaggedCount = 0;

  for (const w of works) {
    if (w.status !== "Recommended") {
      totalSanctionedCount += 1;
      totalSanctionedAmount += Number(w.sanctioned_amount || 0);
    }
    if (w.status === "Completed") {
      totalCompletedCount += 1;
    }
    if (
      w.risk_score &&
      (w.risk_score.risk_level === "Medium" || w.risk_score.risk_level === "High")
    ) {
      totalFlaggedCount += 1;
    }
  }

  // Convert sanctioned amount from Lakhs to Crores (1 Crore = 100 Lakhs)
  const totalSanctionedCr = Number((totalSanctionedAmount / 100).toFixed(2));

  const completionRate =
    totalSanctionedCount > 0
      ? Number(((totalCompletedCount / totalSanctionedCount) * 100).toFixed(1))
      : 0;

  const kpis = {
    totalWorks,
    totalSanctionedCr,
    totalSanctionedCount,
    totalCompletedCount,
    completionRate,
    totalFlaggedCount,
  };

  // 4. Group works by MP
  const mpMap = new Map();

  for (const work of works) {
    const mpId = work.mp_id || work.mp?.mp_id || 0;
    const mpName = work.mp?.mp_name || "Unknown MP";
    const constituency = work.mp?.constituency || district.district_name;

    if (!mpMap.has(mpId)) {
      mpMap.set(mpId, {
        mpName,
        constituency,
        rawWorks: [],
      });
    }

    mpMap.get(mpId).rawWorks.push(work);
  }

  // 5. Build MP performance breakdown
  const mpBreakdown = [];

  for (const entry of mpMap.values()) {
    const mpWorks = entry.rawWorks;
    const count = mpWorks.length;
    let completed = 0;
    let flagged = 0;
    let mpSanctionedAmount = 0;

    for (const w of mpWorks) {
      if (w.status === "Completed") completed += 1;
      if (
        w.risk_score &&
        (w.risk_score.risk_level === "Medium" || w.risk_score.risk_level === "High")
      ) {
        flagged += 1;
      }
      mpSanctionedAmount += Number(w.sanctioned_amount || 0);
    }

    const compRate =
      count > 0 ? Number(((completed / count) * 100).toFixed(1)) : 0;
    const mpSanctionedCr = Number((mpSanctionedAmount / 100).toFixed(2));

    const worksList = [];
    for (const w of mpWorks) {
      let numericRiskScore = null;
      if (w.risk_score?.risk_score !== null && w.risk_score?.risk_score !== undefined) {
        numericRiskScore = Number(w.risk_score.risk_score);
      }

      worksList.push({
        workId: w.work_id,
        category: w.category || "",
        riskLevel: w.risk_score?.risk_level || null,
        riskScore: numericRiskScore,
        description: w.description || "",
        flagReason: w.risk_score?.flag_reason || null,
        sanctionedAmount: Number(Number(w.sanctioned_amount || 0).toFixed(2)),
        status: getDisplayStatus(w),
      });
    }

    mpBreakdown.push({
      mpName: entry.mpName,
      constituency: entry.constituency,
      totalSanctionedCr: mpSanctionedCr,
      totalWorks: count,
      completedCount: completed,
      completionRate: compRate,
      flaggedCount: flagged,
      works: worksList,
    });
  }

  // Sort MP breakdown alphabetically by name
  mpBreakdown.sort((a, b) => a.mpName.localeCompare(b.mpName));

  return {
    district: {
      districtName: district.district_name || "",
      state: district.state?.state_name || "",
      headquarters: district.headquarters || `${district.district_name} Collectorate`,
      nodalOfficer:
        district.nodal_officer ||
        district.nodalOfficer ||
        "District Nodal Officer (DNO)",
    },
    kpis,
    mpBreakdown,
  };
}

export default {
  getDistrictOverview,
};
