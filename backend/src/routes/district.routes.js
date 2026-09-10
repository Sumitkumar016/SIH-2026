import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getDistrictOverview,
  getVerificationQueue,
  markWorkVerified,
  requestEvidence,
  escalateWork,
} from "../controllers/district.controller.js";

const router = express.Router();

/**
 * GET /api/district/overview
 * District Command Center:
 * Returns district summary KPIs and per-MP work breakdowns.
 * Scoped to the logged-in official's district (via req.user.district_id).
 */
router.get("/overview", protect, restrictTo("district"), getDistrictOverview);

/**
 * GET /api/district/verification
 * Missing Evidence Verification Queue:
 * Returns completed projects that lack ground photo evidence verification.
 */
router.get("/verification", protect, restrictTo("district"), getVerificationQueue);

/**
 * POST /api/district/verification/:workId/verify
 * Mark Verified:
 * Confirms ground photo evidence and sets physical progress to 100%.
 */
router.post("/verification/:workId/verify", protect, restrictTo("district"), markWorkVerified);

/**
 * POST /api/district/verification/:workId/request-evidence
 * Request Evidence:
 * Sends an evidence reminder notice to the contractor and implementing agency.
 */
router.post("/verification/:workId/request-evidence", protect, restrictTo("district"), requestEvidence);

/**
 * POST /api/district/verification/:workId/escalate
 * Escalate Work:
 * Creates an escalation record to transfer a suspicious work to the Auditor investigation queue.
 */
router.post("/verification/:workId/escalate", protect, restrictTo("district"), escalateWork);

export default router;
