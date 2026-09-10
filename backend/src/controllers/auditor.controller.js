import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import { getCaseQueue as getCaseQueueService } from "../services/auditorQueue.service.js";
import {
  getCaseById as getCaseByIdService,
  upsertAuditorReport as upsertAuditorReportService,
  upsertAssetVerification as upsertAssetVerificationService,
} from "../services/auditorCase.service.js";
import { getVendorProfile as getVendorProfileService } from "../services/vendorForensics.service.js";

const VALID_ACTIONS = [
  "Request Physical Inspection",
  "Request Supplementary Evidence",
  "Mark Under Review",
  "Resolve Case",
];

const reportSchema = z.object({
  conclusion: z.enum([
    "Confirmed Anomaly",
    "Requires Field Action",
    "False Positive",
  ]),
  notes: z.string().trim().min(1, "Investigation notes are required"),
  status: z.enum(["Under Review", "Escalated", "Resolved"]),
  verifiedProgressPct: z.number().min(0).max(100).optional(),
  discrepancyFlag: z.boolean().optional(),
});

const assetVerificationSchema = z.object({
  assetType: z.string().optional(),
  verificationStatus: z.enum(["verified", "unverified", "disputed"]),
  geotagLat: z.number().optional(),
  geotagLong: z.number().optional(),
});

/**
 * GET /api/auditor/queue
 * Nationwide High-Risk Case Queue for Auditor / Forensic Investigator.
 * Protected with protect, restrictTo('auditor').
 */
export const getCaseQueue = asyncHandler(async (req, res) => {
  const { search, riskLevel, caseStatus, source } = req.query;

  const result = await getCaseQueueService({
    search,
    riskLevel,
    caseStatus,
    source,
  });

  return res.status(200).json(result);
});

/**
 * GET /api/auditor/case/:workId
 * Comprehensive Case Investigation Detail for Auditor.
 * Protected with protect, restrictTo('auditor').
 */
export const getCaseById = asyncHandler(async (req, res) => {
  const { workId } = req.params;
  const result = await getCaseByIdService(workId);
  return res.status(200).json(result);
});

/**
 * 1) POST /api/auditor/case/:workId/action
 * Triggers investigation workflow actions (inspection, supplementary evidence, review, resolve).
 * Protected with protect, restrictTo('auditor').
 */
export const updateCaseAction = asyncHandler(async (req, res) => {
  const { workId } = req.params;
  const { actionType } = req.body || {};

  if (!actionType || !VALID_ACTIONS.includes(actionType)) {
    return res.status(400).json({
      error: `Invalid actionType. Allowed actions: ${VALID_ACTIONS.join(", ")}`,
    });
  }

  const auditorName = req.user?.name || "Auditor";

  if (actionType === "Mark Under Review") {
    await upsertAuditorReportService(
      workId,
      { status: "Under Review" },
      auditorName
    );
  } else if (actionType === "Resolve Case") {
    await upsertAuditorReportService(
      workId,
      { status: "Resolved" },
      auditorName
    );
  } else {
    // "Request Physical Inspection" / "Request Supplementary Evidence"
    // TODO: Wire an actual notification/inspection dispatch system later
  }

  return res.status(200).json({
    success: true,
    workId,
    actionType,
    actionedAt: new Date().toISOString(),
  });
});

/**
 * 2) POST /api/auditor/case/:workId/report
 * Submits official findings and audit report for the work.
 * Protected with protect, restrictTo('auditor').
 */
export const submitAuditorReport = asyncHandler(async (req, res) => {
  const { workId } = req.params;

  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid report data",
    });
  }

  const auditorName = req.user?.name || "Auditor";
  const updatedReport = await upsertAuditorReportService(
    workId,
    parsed.data,
    auditorName
  );

  return res.status(200).json(updatedReport);
});

/**
 * 3) POST /api/auditor/case/:workId/asset
 * Submits asset verification outcome (type, verification status, geotags).
 * Protected with protect, restrictTo('auditor').
 */
export const submitAssetVerification = asyncHandler(async (req, res) => {
  const { workId } = req.params;

  const parsed = assetVerificationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Invalid asset verification data",
    });
  }

  const auditorName = req.user?.name || "Auditor";
  const result = await upsertAssetVerificationService(
    workId,
    parsed.data,
    auditorName
  );

  return res.status(200).json(result);
});

/**
 * GET /api/auditor/vendor
 * Vendor Cross-Reference & Cartel Forensics Profile.
 * Protected with protect, restrictTo('auditor').
 */
export const getVendorProfile = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const result = await getVendorProfileService(name);
  return res.status(200).json(result);
});

export default {
  getCaseQueue,
  getCaseById,
  updateCaseAction,
  submitAuditorReport,
  submitAssetVerification,
  getVendorProfile,
};
