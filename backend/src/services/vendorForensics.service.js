import { prisma } from "../config/db.js";

/**
 * services/vendorForensics.service.js
 * Vendor Cross-Reference & Cartel Forensics Tool.
 * Analyzes multi-contract concentration, repeat identical amounts,
 * and simultaneous fund disbursement signatures.
 */

// Named thresholds for pattern detection rules (easy to tune)
export const ROUND_FIGURE_REPEAT_THRESHOLD = 3;
export const SAME_DAY_RELEASE_THRESHOLD = 2;
export const SINGLE_STATE_MIN_WORKS_THRESHOLD = 5;

/**
 * Searches and evaluates a vendor profile and cross-referenced works.
 *
 * @param {string} searchName - Partial or exact vendor name to search
 * @returns {Promise<Object>}
 */
export async function getVendorProfile(searchName) {
  let query = "M/s Apex Infra Projects"; // Default sample vendor if input is empty
  if (searchName && typeof searchName === "string" && searchName.trim()) {
    query = searchName.trim();
  }

  // 1. Find matching vendors (case-insensitive partial search)
  const matchingVendors = await prisma.vendor.findMany({
    where: {
      vendor_name: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      vendor_name: "asc",
    },
  });

  if (!matchingVendors || matchingVendors.length === 0) {
    const error = new Error("Vendor not found");
    error.statusCode = 404;
    throw error;
  }

  // Select exact match first if available, otherwise default to first alphabetical match
  let vendor = matchingVendors[0];
  for (const v of matchingVendors) {
    if (v.vendor_name.toLowerCase() === query.toLowerCase()) {
      vendor = v;
      break;
    }
  }

  // 2. Load all expenditure payments made to this vendor
  const expenditures = await prisma.expenditure.findMany({
    where: {
      vendor_id: vendor.vendor_id,
    },
    include: {
      work: {
        include: {
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
          risk_score: true,
        },
      },
    },
    orderBy: {
      payment_date: "desc",
    },
  });

  // 3. Deduplicate expenditures by work (a vendor can receive multiple payment tranches per work)
  const distinctWorksMap = new Map();
  let totalPaymentLakhs = 0;

  for (const exp of expenditures) {
    totalPaymentLakhs += Number(exp.amount || 0);

    if (exp.work && !distinctWorksMap.has(exp.work_id)) {
      distinctWorksMap.set(exp.work_id, exp.work);
    }
  }

  const works = Array.from(distinctWorksMap.values());
  const totalWorks = works.length;

  const totalPaymentCr = Number((totalPaymentLakhs / 100).toFixed(2));
  const avgPaymentLakhs =
    totalWorks > 0 ? Number((totalPaymentLakhs / totalWorks).toFixed(1)) : 0;

  // Track high-risk works and geographical reach
  let highRiskCount = 0;
  const mpsSet = new Set();
  const districtsSet = new Set();
  const statesSet = new Set();

  for (const w of works) {
    if (w.risk_score && w.risk_score.risk_level === "High") {
      highRiskCount += 1;
    }
    if (w.mp?.mp_name) mpsSet.add(w.mp.mp_name);
    if (w.district?.district_name) districtsSet.add(w.district.district_name);
    if (w.state?.state_name) statesSet.add(w.state.state_name);
  }

  const distinctMps = Array.from(mpsSet).sort();
  const distinctDistricts = Array.from(districtsSet).sort();
  const distinctStates = Array.from(statesSet).sort();

  // 4. Pattern Detection Rules

  // Map to store per-work red flags: workId -> string[]
  const workFlagsMap = new Map();
  for (const w of works) {
    workFlagsMap.set(w.work_id, []);
  }

  const patternAlerts = [];

  // RULE 1: ROUND_FIGURE_REPEAT (3+ different works with identical sanctionedAmount)
  const amountToWorksMap = new Map();
  for (const w of works) {
    const amtStr = Number(w.sanctioned_amount || 0).toFixed(2);
    if (!amountToWorksMap.has(amtStr)) {
      amountToWorksMap.set(amtStr, []);
    }
    amountToWorksMap.get(amtStr).push(w.work_id);
  }

  for (const [amtStr, workIds] of amountToWorksMap.entries()) {
    if (workIds.length >= ROUND_FIGURE_REPEAT_THRESHOLD) {
      const flagText = `Identical Amount (₹${amtStr}L) ×${workIds.length}`;
      for (const wid of workIds) {
        workFlagsMap.get(wid).push(flagText);
      }
      patternAlerts.push(
        `Round-Figure Anomaly: ${workIds.length} works awarded with identical ₹${amtStr}L amounts.`
      );
    }
  }

  // RULE 2: SAME_DAY_RELEASE (2+ different works with funds released on the exact same date)
  const releaseDateToWorksMap = new Map();
  for (const w of works) {
    if (w.fund_released_date) {
      const dateKey = new Date(w.fund_released_date).toISOString().split("T")[0];
      if (!releaseDateToWorksMap.has(dateKey)) {
        releaseDateToWorksMap.set(dateKey, []);
      }
      releaseDateToWorksMap.get(dateKey).push(w.work_id);
    }
  }

  for (const [dateStr, workIds] of releaseDateToWorksMap.entries()) {
    if (workIds.length >= SAME_DAY_RELEASE_THRESHOLD) {
      const flagText = `Same-day Release (${workIds.length} contracts)`;
      for (const wid of workIds) {
        workFlagsMap.get(wid).push(flagText);
      }
      patternAlerts.push(
        `Simultaneous Disbursement: Multiple contract tranches (${workIds.length} works) released on the exact same date (${dateStr}).`
      );
    }
  }

  // RULE 3: SINGLE_STATE_CONCENTRATION (exclusive operation in 1 state across 5+ works)
  if (distinctStates.length === 1 && totalWorks >= SINGLE_STATE_MIN_WORKS_THRESHOLD) {
    patternAlerts.push(
      `Vendor operates exclusively within ${distinctStates[0]} across ${totalWorks} contracts — check for regional favoritism.`
    );
  }

  // 5. Build works list with flags
  const formattedWorks = works.map((w) => {
    const flags = workFlagsMap.get(w.work_id) || [];
    const isRedFlagged = flags.length > 0;
    const fundReleasedDate = w.fund_released_date
      ? new Date(w.fund_released_date).toISOString().split("T")[0]
      : null;

    let numericRiskScore = null;
    if (w.risk_score?.risk_score !== null && w.risk_score?.risk_score !== undefined) {
      numericRiskScore = Number(w.risk_score.risk_score);
    }

    return {
      workId: w.work_id,
      mpName: w.mp?.mp_name || "Unknown MP",
      category: w.category || "",
      state: w.state?.state_name || "",
      district: w.district?.district_name || "",
      sanctionedAmount: Number(Number(w.sanctioned_amount || 0).toFixed(2)),
      fundReleasedDate,
      riskLevel: w.risk_score?.risk_level || null,
      riskScore: numericRiskScore,
      flags,
      isRedFlagged,
    };
  });

  // Sort works: red-flagged works first, then by riskScore descending
  formattedWorks.sort((a, b) => {
    if (a.isRedFlagged !== b.isRedFlagged) {
      return a.isRedFlagged ? -1 : 1;
    }
    return (b.riskScore || 0) - (a.riskScore || 0);
  });

  return {
    vendorName: vendor.vendor_name,
    totalWorks,
    highRiskCount,
    totalPaymentCr,
    distinctMpsCount: distinctMps.length,
    distinctMps,
    distinctDistrictsCount: distinctDistricts.length,
    distinctStatesCount: distinctStates.length,
    distinctStates,
    avgPaymentLakhs,
    patternAlerts,
    works: formattedWorks,
  };
}

export default {
  ROUND_FIGURE_REPEAT_THRESHOLD,
  SAME_DAY_RELEASE_THRESHOLD,
  SINGLE_STATE_MIN_WORKS_THRESHOLD,
  getVendorProfile,
};
