import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getCaseQueue,
  getCaseById,
  updateCaseAction,
  submitAuditorReport,
  submitAssetVerification,
  getVendorProfile,
} from "../controllers/auditor.controller.js";

const router = express.Router();

/**
 * GET /api/auditor/queue
 * High-Risk Case Queue:
 * Lists nationwide works with Medium or High fraud risk scores.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.get("/queue", protect, restrictTo("auditor"), getCaseQueue);

/**
 * GET /api/auditor/case/:workId
 * Case Investigation Detail:
 * Fetches comprehensive project details, audit history, and risk breakdowns for a single work.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.get("/case/:workId", protect, restrictTo("auditor"), getCaseById);

/**
 * POST /api/auditor/case/:workId/action
 * Case Actions:
 * Triggers investigation workflow actions (e.g. Mark Under Review, Resolve Case, Request Inspection).
 * Only accessible by authenticated users with the "auditor" role.
 */
router.post("/case/:workId/action", protect, restrictTo("auditor"), updateCaseAction);

/**
 * POST /api/auditor/case/:workId/report
 * Official Audit Report:
 * Submits official findings (conclusion, notes, status) for a case.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.post("/case/:workId/report", protect, restrictTo("auditor"), submitAuditorReport);

/**
 * POST /api/auditor/case/:workId/asset
 * Asset Verification:
 * Records physical asset verification findings (status, type, geotags).
 * Only accessible by authenticated users with the "auditor" role.
 */
router.post("/case/:workId/asset", protect, restrictTo("auditor"), submitAssetVerification);

/**
 * GET /api/auditor/vendor
 * Vendor Investigation Tool:
 * Cross-references vendor contracts to detect repeat round-figure amounts, single-state concentration, etc.
 * Only accessible by authenticated users with the "auditor" role.
 */
router.get("/vendor", protect, restrictTo("auditor"), getVendorProfile);

export default router;
