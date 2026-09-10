import { prisma } from "../config/db.js";

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
 * services/mpOverview.service.js
 * Scoped analytics and flagged cases for the logged-in Member of Parliament.
 *
 * @param {number|string} mpId - MP Primary Key (from req.user.mp_id)
 * @returns {Promise<{ mp: Object, kpis: Object, flaggedWorks: Array }>}
 */
export async function getConstituencyOverview(mpId) {
  const parsedMpId = parseInt(mpId, 10);
  if (isNaN(parsedMpId)) {
    const error = new Error("Invalid MP ID");
    error.statusCode = 400;
    throw error;
  }

  // 1. Load MP with state, district, and all works including risk scores and expenditures
  const mp = await prisma.mp.findUnique({
    where: { mp_id: parsedMpId },
    include: {
      state: {
        select: {
          state_name: true,
        },
      },
      works: {
        include: {
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
      },
    },
  });

  if (!mp) {
    const error = new Error("MP profile not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Determine MP's primary district
  let districtName = "";
  for (const w of mp.works) {
    if (w.district?.district_name) {
      districtName = w.district.district_name;
      break;
    }
  }
  if (!districtName) {
    districtName = mp.constituency || "";
  }

  const mpState = mp.state?.state_name || mp.works[0]?.state?.state_name || "";

  // 3. Compute KPIs
  // 500 Lakhs = 5 Cr standard annual MPLADS entitlement
  const rawEntitlement = Number(mp.allocated_amount || 500);
  const annualEntitlementLakhs = Number(rawEntitlement.toFixed(1));
  const annualEntitlementCr = Number((rawEntitlement / 100).toFixed(2));

  const totalRecommendedCount = mp.works.length;
  let totalSanctionedCount = 0;
  let totalSanctionedLakhs = 0;
  let totalCompletedCount = 0;
  let totalExpenditureLakhs = 0;

  for (const w of mp.works) {
    const sanctionedAmount = Number(w.sanctioned_amount || 0);

    if (w.status !== "Recommended") {
      totalSanctionedCount += 1;
      totalSanctionedLakhs += sanctionedAmount;
    }

    if (w.status === "Completed") {
      totalCompletedCount += 1;
    }

    for (const exp of w.expenditures || []) {
      totalExpenditureLakhs += Number(exp.amount || 0);
    }
  }

  totalSanctionedLakhs = Number(totalSanctionedLakhs.toFixed(1));
  totalExpenditureLakhs = Number(totalExpenditureLakhs.toFixed(1));
  const totalExpenditureCr = Number((totalExpenditureLakhs / 100).toFixed(2));

  const utilizationRatePercent =
    annualEntitlementLakhs > 0
      ? Number(((totalExpenditureLakhs / annualEntitlementLakhs) * 100).toFixed(1))
      : 0;

  const kpis = {
    annualEntitlementCr,
    annualEntitlementLakhs,
    totalRecommendedCount,
    totalSanctionedCount,
    totalSanctionedLakhs,
    totalCompletedCount,
    totalExpenditureCr,
    totalExpenditureLakhs,
    utilizationRatePercent,
  };

  // Flagged works: every Work belonging to this MP where RiskScore.riskLevel IN ('Medium','High')
  const flaggedRaw = mp.works.filter(
    (w) =>
      w.risk_score &&
      (w.risk_score.risk_level === "Medium" || w.risk_score.risk_level === "High")
  );

  // Order flagged works by calculated_at descending
  flaggedRaw.sort((a, b) => {
    const dateA = new Date(a.risk_score.calculated_at || 0).getTime();
    const dateB = new Date(b.risk_score.calculated_at || 0).getTime();
    return dateB - dateA;
  });

  const flaggedWorks = [];

  for (const work of flaggedRaw) {
    const vendorName = resolveVendorName(work.expenditures);

    let numericRiskScore = 0;
    if (work.risk_score.risk_score !== null && work.risk_score.risk_score !== undefined) {
      numericRiskScore = Number(work.risk_score.risk_score);
    }

    flaggedWorks.push({
      workId: work.work_id,
      category: work.category || "",
      description: work.description || "",
      flagReason: work.risk_score.flag_reason || "",
      riskLevel: work.risk_score.risk_level || "Medium",
      riskScore: numericRiskScore,
      sanctionedAmount: Number(Number(work.sanctioned_amount || 0).toFixed(2)),
      vendorName,
    });
  }

  return {
    mp: {
      mpName: mp.mp_name || "",
      house: "Lok Sabha",
      term: "18th Lok Sabha",
      constituency: mp.constituency || "",
      state: mpState,
      district: districtName,
    },
    kpis,
    flaggedWorks,
  };
}

export default {
  getConstituencyOverview,
};
