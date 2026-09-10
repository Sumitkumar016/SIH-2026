import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Generates an 8-point predictive risk curve from current score to predicted score.
 * Simulates non-linear progression accelerating towards the forecasted 30-day risk level.
 *
 * @param {number} currentScore - Starting risk score (0-100)
 * @param {number} predictedScore - Target risk score in 30 days (0-100)
 * @returns {number[]} Array of 8 integer values between 0 and 100
 */
function generateRiskTrajectory(currentScore, predictedScore) {
  const start = Math.round(Number(currentScore || 25));
  const end = Math.round(Number(predictedScore || 75));
  const trajectory = [];

  for (let i = 0; i < 8; i++) {
    // Progress fraction from 0.0 to 1.0
    const progress = i / 7;
    // Apply power curve (1.4 exponent) for non-linear escalation
    const pointValue = Math.round(start + (end - start) * Math.pow(progress, 1.4));
    // Clamp score between 0 and 100
    const clampedScore = Math.max(0, Math.min(100, pointValue));
    trajectory.push(clampedScore);
  }

  return trajectory;
}

/**
 * services/prediction.service.js
 * Fetches works on the predictive risk watchlist with query filtering.
 *
 * @param {Object} filters - { search, state, category }
 * @returns {Promise<{ data: Array }>}
 */
export async function getPredictiveWatchlist(filters = {}) {
  const { search, state, category } = filters;

  const where = {
    prediction: {
      isNot: null,
    },
  };

  // 1. State filter
  if (state && state !== "All") {
    where.state = {
      state_name: {
        equals: state,
        mode: "insensitive",
      },
    };
  }

  // 2. Category filter
  if (category && category !== "All") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // 3. Search filter
  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.OR = [
      { work_id: { contains: q, mode: "insensitive" } },
      { mp: { mp_name: { contains: q, mode: "insensitive" } } },
      { district: { district_name: { contains: q, mode: "insensitive" } } },
    ];
  }

  // 4. Query works with prediction records
  const works = await prisma.work.findMany({
    where,
    select: {
      work_id: true,
      category: true,
      sanctioned_amount: true,
      status: true,
      completion_date: true,
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
      prediction: true,
      current_risk_score: {
        select: {
          risk_score: true,
          risk_level: true,
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
    orderBy: {
      prediction: {
        predicted_at: "desc",
      },
    },
  });

  // 5. Filter and format watchlist items
  const data = [];

  for (const work of works) {
    const pred = work.prediction;
    if (!pred) continue;

    // Verify work is active on watchlist
    const isOnWatchlist =
      pred.is_on_watchlist !== undefined
        ? pred.is_on_watchlist
        : pred.isOnWatchlist !== undefined
        ? pred.isOnWatchlist
        : true;

    if (!isOnWatchlist) continue;

    const currentStatus = getDisplayStatus(work);

    const currentRiskScore =
      pred.current_risk_score !== null && pred.current_risk_score !== undefined
        ? Number(pred.current_risk_score)
        : 0;

    const predictedRiskScore30Days =
      pred.predicted_risk_score_30d !== null && pred.predicted_risk_score_30d !== undefined
        ? Number(pred.predicted_risk_score_30d)
        : 0;

    // Calculate delta percentage
    let riskDeltaPercent = "+0%";
    if (pred.risk_delta_pct !== null && pred.risk_delta_pct !== undefined) {
      const delta = Math.round(Number(pred.risk_delta_pct));
      riskDeltaPercent = `${delta >= 0 ? "+" : ""}${delta}%`;
    } else {
      const delta = Math.round(predictedRiskScore30Days - currentRiskScore);
      riskDeltaPercent = `${delta >= 0 ? "+" : ""}${delta}%`;
    }

    const riskTrajectory = Array.isArray(pred.risk_trajectory)
      ? pred.risk_trajectory
      : generateRiskTrajectory(currentRiskScore, predictedRiskScore30Days);

    const warningSignal =
      pred.warning_signal ||
      "Early warning: Fund utilization trajectory and velocity diverge from target schedule";

    const daysUntilPredictedThreshold =
      pred.days_until_threshold !== null && pred.days_until_threshold !== undefined
        ? Number(pred.days_until_threshold)
        : 14;

    data.push({
      workId: work.work_id,
      mpName: work.mp?.mp_name || "",
      state: work.state?.state_name || "",
      district: work.district?.district_name || "",
      category: work.category || "",
      currentStatus,
      currentRiskScore,
      predictedRiskScore30Days,
      riskDeltaPercent,
      riskTrajectory,
      warningSignal,
      daysUntilPredictedThreshold,
      sanctionedAmount: Number(Number(work.sanctioned_amount || 0).toFixed(2)),
    });
  }

  return { data };
}

export default {
  getPredictiveWatchlist,
};
