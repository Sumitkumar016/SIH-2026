import { prisma } from "../config/db.js";

/**
 * Records a new RiskScore entry for a given workId, maintaining current pointer and history.
 * In a single transaction:
 * 1. Sets is_current: false on every existing RiskScore row for workId that currently has is_current: true.
 * 2. Creates the new RiskScore row with is_current: true.
 * 3. Updates Work.current_risk_score_id to point at the newly created row's risk_id.
 *
 * @param {string} workId
 * @param {Object} riskData
 * @returns {Promise<Object>} The newly created RiskScore record
 */
export async function recordRiskScore(workId, riskData) {
  return await prisma.$transaction(async (tx) => {
    // 1. Mark existing current risk scores as non-current
    await tx.riskScore.updateMany({
      where: {
        work_id: workId,
        is_current: true,
      },
      data: {
        is_current: false,
      },
    });

    // 2. Create the new RiskScore record with is_current: true
    const newRiskScore = await tx.riskScore.create({
      data: {
        work_id: workId,
        is_current: true,
        risk_score: riskData.risk_score,
        risk_level: riskData.risk_level,
        cost_overrun_pct: riskData.cost_overrun_pct ?? 0,
        delay_slippage_pct: riskData.delay_slippage_pct ?? 0,
        duplicate_similarity_pct: riskData.duplicate_similarity_pct ?? 0,
        vendor_anomaly_pct: riskData.vendor_anomaly_pct ?? 0,
        progress_mismatch_pct: riskData.progress_mismatch_pct ?? 0,
        flag_reason: riskData.flag_reason,
        ai_diagnostic_summary: riskData.ai_diagnostic_summary,
      },
    });

    // 3. Update Work.current_risk_score_id to point to the new record
    await tx.work.update({
      where: {
        work_id: workId,
      },
      data: {
        current_risk_score_id: newRiskScore.risk_id,
      },
    });

    return newRiskScore;
  });
}
