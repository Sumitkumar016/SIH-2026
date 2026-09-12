import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getWorkById,
  issueAuditNotice,
} from "../controllers/work.controller.js";

const router = express.Router();

/**
 * POST /api/works/:workId/audit-notice
 * Issue Audit Notice:
 * Places a work under review and generates an official audit notice.
 * Roles: "ministry", "district", "state", "auditor"
 */
router.post(
  "/audit-notice",
  protect,
  restrictTo("ministry", "district", "state", "auditor"),
  issueAuditNotice
);

router.post(
  "/{*workId}/audit-notice",
  protect,
  restrictTo("ministry", "district", "state", "auditor"),
  issueAuditNotice
);

/**
 * GET /api/works/{*workId}
 * Project Details:
 * Returns flattened project details, financial figures, risk scores, progress, and audit history.
 * Accessible to any authenticated role.
 */
router.get("/{*workId}", protect, getWorkById);
router.get("/", protect, getWorkById);

export default router;
