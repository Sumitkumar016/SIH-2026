import { prisma } from "../config/db.js";
import { getWorkDetail } from "./workDetail.service.js";
import {
  getLatestAuditorReport,
  getLatestEscalation,
  getLatestWorkProgress,
} from "./shared/latestFor.service.js";

/**
 * Normalizes database status values to human-readable UI strings.
 * Example: "UNDER_REVIEW" -> "Under Review"
 */
function normalizeAuditorStatus(status) {
  if (!status) return "Under Review";

  const upper = String(status).trim().toUpperCase();
  if (upper === "UNDER_REVIEW" || upper === "UNDER REVIEW") {
    return "Under Review";
  }
  if (upper === "RESOLVED") {
    return "Resolved";
  }
  if (upper === "ESCALATED") {
    return "Escalated";
  }

  return status;
}

/**
 * Normalizes database conclusion values to human-readable UI strings.
 * Example: "CONFIRMED_ANOMALY" -> "Confirmed Anomaly"
 */
function normalizeAuditorConclusion(conclusion) {
  if (!conclusion) return null;

  const upper = String(conclusion).trim().toUpperCase();
  if (upper === "CONFIRMED_ANOMALY" || upper === "CONFIRMED ANOMALY") {
    return "Confirmed Anomaly";
  }
  if (upper === "FALSE_POSITIVE" || upper === "FALSE POSITIVE") {
    return "False Positive";
  }
  if (upper === "REQUIRES_FIELD_ACTION" || upper === "REQUIRES FIELD ACTION") {
    return "Requires Field Action";
  }

  return conclusion;
}

/**
 * Maps human-readable UI conclusion text to the database enum value.
 */
function mapConclusionToPrisma(conclusion) {
  if (!conclusion) return "REQUIRES_FIELD_ACTION";

  const c = String(conclusion).trim();
  if (c === "Confirmed Anomaly" || c === "CONFIRMED_ANOMALY") {
    return "CONFIRMED_ANOMALY";
  }
  if (c === "False Positive" || c === "FALSE_POSITIVE") {
    return "FALSE_POSITIVE";
  }
  return "REQUIRES_FIELD_ACTION";
}

/**
 * Maps human-readable UI status text to the database enum value.
 */
function mapStatusToPrisma(status) {
  if (!status) return "UNDER_REVIEW";

  const s = String(status).trim();
  if (s === "Under Review" || s === "UNDER_REVIEW") {
    return "UNDER_REVIEW";
  }
  if (s === "Escalated" || s === "ESCALATED") {
    return "ESCALATED";
  }
  if (s === "Resolved" || s === "RESOLVED") {
    return "RESOLVED";
  }
  return "UNDER_REVIEW";
}

/**
 * PART 3 — Case Investigation Detail Service
 * Builds on top of getWorkDetail and adds Auditor-specific fields.
 *
 * @param {string} workId
 * @returns {Promise<Object>}
 */
export async function getCaseById(workId) {
  if (!workId) {
    const error = new Error("Work ID is required");
    error.statusCode = 400;
    throw error;
  }

  // 1. Fetch base work detail
  const baseWorkDetail = await getWorkDetail(workId);
  if (!baseWorkDetail) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Fetch raw work fields (fund_released_date, description, risk_score)
  const rawWork = await prisma.work.findUnique({
    where: { work_id: workId },
    include: {
      risk_score: true,
    },
  });

  if (!rawWork) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  // 3. Fetch latest associated records in parallel
  const [latestAuditorReport, latestEscalation, latestWorkProgress] =
    await Promise.all([
      getLatestAuditorReport(workId),
      getLatestEscalation(workId),
      getLatestWorkProgress(workId),
    ]);

  const rs = rawWork.risk_score;

  // Resolve numeric risk score
  let riskScore = 0;
  if (baseWorkDetail.fraudRiskScore !== null && baseWorkDetail.fraudRiskScore !== undefined) {
    riskScore = baseWorkDetail.fraudRiskScore;
  } else if (rs?.risk_score !== null && rs?.risk_score !== undefined) {
    riskScore = Number(rs.risk_score);
  }

  const riskLevel = baseWorkDetail.fraudRiskTier || rs?.risk_level || "Medium";

  // Breakdown percentages for risk indicators
  const riskFactorBreakdown = {
    costOverrun: Math.round(Number(rs?.cost_overrun_pct || 0)),
    delaySlippage: Math.round(Number(rs?.delay_slippage_pct || 0)),
    duplicateSimilarity: Math.round(Number(rs?.duplicate_similarity_pct || 0)),
    vendorAnomaly: Math.round(Number(rs?.vendor_anomaly_pct || 0)),
  };

  const aiDiagnosticSummary =
    rs?.ai_diagnostic_summary ||
    baseWorkDetail.aiDiagnosticSummary ||
    "AI risk telemetry diagnostic indicates variance against regional benchmarks.";

  // Progress metrics from most recent progress report
  let expectedProgress = null;
  if (latestWorkProgress?.expected_progress_pct !== null && latestWorkProgress?.expected_progress_pct !== undefined) {
    expectedProgress = Number(latestWorkProgress.expected_progress_pct);
  }

  let physicalProgress = null;
  if (latestWorkProgress?.physical_progress_pct !== null && latestWorkProgress?.physical_progress_pct !== undefined) {
    physicalProgress = Number(latestWorkProgress.physical_progress_pct);
  } else if (baseWorkDetail.physicalProgress !== undefined) {
    physicalProgress = baseWorkDetail.physicalProgress;
  }

  const photoEvidenceStatus = latestWorkProgress?.evidence_status || "missing";

  // Escalation metadata
  const escalationSource =
    latestEscalation?.escalation_source ||
    latestEscalation?.escalationSource ||
    "ai";

  const escalationNote =
    latestEscalation?.escalation_note ||
    latestEscalation?.escalationNote ||
    null;

  const escalatedDate = latestEscalation?.escalated_date
    ? new Date(latestEscalation.escalated_date).toISOString()
    : null;

  // Auditor report formatting
  let auditorReport = null;
  if (latestAuditorReport) {
    auditorReport = {
      conclusion: normalizeAuditorConclusion(latestAuditorReport.conclusion),
      notes: latestAuditorReport.notes || null,
      status: normalizeAuditorStatus(latestAuditorReport.status),
      verifiedProgressPct:
        latestAuditorReport.verified_progress_pct !== null &&
        latestAuditorReport.verified_progress_pct !== undefined
          ? Number(latestAuditorReport.verified_progress_pct)
          : null,
      discrepancyFlag: Boolean(latestAuditorReport.discrepancy_flag),
    };
  }

  const fundReleasedDate = rawWork.fund_released_date
    ? new Date(rawWork.fund_released_date).toISOString()
    : null;

  return {
    ...baseWorkDetail,
    description: rawWork.description || baseWorkDetail.description || "",
    fundReleasedDate,
    riskScore,
    riskLevel,
    riskFactorBreakdown,
    aiDiagnosticSummary,
    expectedProgress,
    physicalProgress,
    photoEvidenceStatus,
    escalationSource,
    escalationNote,
    escalatedDate,
    auditorReport,
  };
}

/**
 * Upserts the AuditorReport for a given workId:
 * If a report already exists, updates it.
 * If none exists yet, creates a new one.
 *
 * @param {string} workId
 * @param {Object} reportData
 * @param {string} [reportData.conclusion]
 * @param {string} [reportData.notes]
 * @param {string} [reportData.status]
 * @param {number} [reportData.verifiedProgressPct]
 * @param {boolean} [reportData.discrepancyFlag]
 * @param {string} [auditorName]
 * @returns {Promise<{ conclusion: string|null, notes: string|null, status: string, submittedBy: string, submittedDate: string, verifiedProgressPct: number|null, discrepancyFlag: boolean }>}
 */
export async function upsertAuditorReport(
  workId,
  { conclusion, notes, status, verifiedProgressPct, discrepancyFlag } = {},
  auditorName = "Auditor"
) {
  if (!workId) {
    const error = new Error("Work ID is required");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true },
  });

  if (!work) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  const latestReport = await getLatestAuditorReport(workId);
  const today = new Date();
  const submittedBy = auditorName || "Auditor";

  let savedRecord;

  if (latestReport) {
    // Update existing report
    const updateData = {
      status: mapStatusToPrisma(status || latestReport.status),
      submitted_by: submittedBy,
      submitted_date: today,
    };

    if (conclusion !== undefined && conclusion !== null) {
      updateData.conclusion = mapConclusionToPrisma(conclusion);
    }
    if (notes !== undefined && notes !== null) {
      updateData.notes = notes;
    }
    if (verifiedProgressPct !== undefined && verifiedProgressPct !== null) {
      updateData.verified_progress_pct = verifiedProgressPct;
    }
    if (discrepancyFlag !== undefined && discrepancyFlag !== null) {
      updateData.discrepancy_flag = discrepancyFlag;
    }

    savedRecord = await prisma.auditorReport.update({
      where: { report_id: latestReport.report_id },
      data: updateData,
    });
  } else {
    // Create new report
    const createData = {
      work_id: workId,
      conclusion: mapConclusionToPrisma(conclusion || "REQUIRES_FIELD_ACTION"),
      notes: notes || null,
      status: mapStatusToPrisma(status || "UNDER_REVIEW"),
      submitted_by: submittedBy,
      submitted_date: today,
    };

    if (verifiedProgressPct !== undefined && verifiedProgressPct !== null) {
      createData.verified_progress_pct = verifiedProgressPct;
    }
    if (discrepancyFlag !== undefined && discrepancyFlag !== null) {
      createData.discrepancy_flag = discrepancyFlag;
    }

    savedRecord = await prisma.auditorReport.create({
      data: createData,
    });
  }

  // Format date as YYYY-MM-DD
  const formattedDate = savedRecord.submitted_date
    ? new Date(savedRecord.submitted_date).toISOString().split("T")[0]
    : today.toISOString().split("T")[0];

  return {
    conclusion: normalizeAuditorConclusion(savedRecord.conclusion),
    notes: savedRecord.notes || null,
    status: normalizeAuditorStatus(savedRecord.status),
    submittedBy: savedRecord.submitted_by || submittedBy,
    submittedDate: formattedDate,
    verifiedProgressPct:
      savedRecord.verified_progress_pct !== null &&
      savedRecord.verified_progress_pct !== undefined
        ? Number(savedRecord.verified_progress_pct)
        : null,
    discrepancyFlag: Boolean(savedRecord.discrepancy_flag),
  };
}

/**
 * Upserts an AssetCreation record for a given workId.
 * If an AssetCreation row exists, updates it.
 * If none exists, creates one.
 *
 * @param {string} workId
 * @param {Object} assetData
 * @param {string} [assetData.assetType]
 * @param {string} assetData.verificationStatus - 'verified' | 'unverified' | 'disputed'
 * @param {number} [assetData.geotagLat]
 * @param {number} [assetData.geotagLong]
 * @param {string} [auditorName]
 * @returns {Promise<{ assetType: string|null, verificationStatus: string, geotagLat: number|null, geotagLong: number|null }>}
 */
export async function upsertAssetVerification(
  workId,
  { assetType, verificationStatus, geotagLat, geotagLong } = {},
  auditorName = "Auditor"
) {
  if (!workId) {
    const error = new Error("Work ID is required");
    error.statusCode = 400;
    throw error;
  }

  const validStatuses = ["verified", "unverified", "disputed"];
  if (!verificationStatus || !validStatuses.includes(verificationStatus)) {
    const error = new Error(
      `Invalid verificationStatus. Allowed values: ${validStatuses.join(", ")}`
    );
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true },
  });

  if (!work) {
    const error = new Error("Case not found");
    error.statusCode = 404;
    throw error;
  }

  const existingAsset = await prisma.assetCreation.findFirst({
    where: { work_id: workId },
    orderBy: { asset_id: "desc" },
  });

  let savedRecord;

  if (existingAsset) {
    const updateData = {
      verification_status: verificationStatus,
    };
    if (assetType !== undefined && assetType !== null) {
      updateData.asset_type = assetType;
    }
    if (geotagLat !== undefined && geotagLat !== null) {
      updateData.geotag_lat = geotagLat;
    }
    if (geotagLong !== undefined && geotagLong !== null) {
      updateData.geotag_long = geotagLong;
    }

    savedRecord = await prisma.assetCreation.update({
      where: { asset_id: existingAsset.asset_id },
      data: updateData,
    });
  } else {
    savedRecord = await prisma.assetCreation.create({
      data: {
        work_id: workId,
        asset_type: assetType !== undefined && assetType !== null ? assetType : null,
        verification_status: verificationStatus,
        geotag_lat: geotagLat !== undefined && geotagLat !== null ? geotagLat : null,
        geotag_long: geotagLong !== undefined && geotagLong !== null ? geotagLong : null,
      },
    });
  }

  return {
    assetType: savedRecord.asset_type || null,
    verificationStatus: savedRecord.verification_status,
    geotagLat:
      savedRecord.geotag_lat !== null && savedRecord.geotag_lat !== undefined
        ? Number(savedRecord.geotag_lat)
        : null,
    geotagLong:
      savedRecord.geotag_long !== null && savedRecord.geotag_long !== undefined
        ? Number(savedRecord.geotag_long)
        : null,
  };
}

export default {
  getCaseById,
  upsertAuditorReport,
  upsertAssetVerification,
};
