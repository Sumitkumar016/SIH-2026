import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import { getDistrictOverview as getDistrictOverviewService } from "../services/districtOverview.service.js";
import {
  getVerificationQueue as getVerificationQueueService,
  markWorkVerified as markWorkVerifiedService,
  requestEvidence as requestEvidenceService,
  escalateWork as escalateWorkService,
} from "../services/verificationQueue.service.js";

const escalateSchema = z.object({
  note: z.string().trim().min(1, "Escalation note is required"),
});

/**
 * GET /api/district/overview
 * Scoped district-wide analytics and MP breakdown for the authenticated District official.
 * Protected with protect, restrictTo('district').
 * Resolves district from req.user.district_id.
 */
export const getDistrictOverview = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const result = await getDistrictOverviewService(districtId);
  return res.status(200).json(result);
});

/**
 * 1) GET /api/district/verification
 * Surfaces completed works missing mandatory photo evidence in the user's district.
 * Protected with protect, restrictTo('district').
 */
export const getVerificationQueue = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const result = await getVerificationQueueService(districtId);
  return res.status(200).json(result);
});

/**
 * 2) POST /api/district/verification/:workId/verify
 * Confirms photo evidence has been verified on ground and creates a WorkProgress record.
 * Protected with protect, restrictTo('district').
 */
export const markWorkVerified = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const { workId } = req.params;
  const result = await markWorkVerifiedService(districtId, workId, req.user);
  return res.status(200).json(result);
});

/**
 * 3) POST /api/district/verification/:workId/request-evidence
 * Persists reminder notice status for this work.
 * Protected with protect, restrictTo('district').
 */
export const requestEvidence = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const { workId } = req.params;
  const { note } = req.body || {};
  const result = await requestEvidenceService(districtId, workId, note);
  return res.status(200).json(result);
});

/**
 * 4) POST /api/district/verification/:workId/escalate
 * Creates a new Escalation row (source='district') sending work to Auditor investigation queue.
 * Protected with protect, restrictTo('district').
 */
export const escalateWork = asyncHandler(async (req, res) => {
  const districtId = req.user?.district_id;

  if (!districtId) {
    return res.status(403).json({
      error: "No District profile linked to this account",
    });
  }

  const parsed = escalateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message || "Escalation note cannot be empty",
    });
  }

  const { workId } = req.params;
  const result = await escalateWorkService(districtId, workId, parsed.data.note, req.user);
  return res.status(200).json(result);
});

export default {
  getDistrictOverview,
  getVerificationQueue,
  markWorkVerified,
  requestEvidence,
  escalateWork,
};
