import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getWorkById,
  issueAuditNotice,
} from "../controllers/work.controller.js";

const router = express.Router();

/**
 * GET /api/works/:workId
 * Project Details:
 * Returns flattened project details, financial figures, risk scores, progress, and audit history.
 * Accessible to any authenticated role.
 */
router.get("/:workId", protect, getWorkById);

/**
 * POST /api/works/:workId/audit-notice
 * Issue Audit Notice:
 * Places a work under review and generates an official audit notice.
 * Roles: "ministry", "district", "state", "auditor"
 */
router.post(
  "/:workId/audit-notice",
  protect,
  restrictTo("ministry", "district", "state", "auditor"),
  issueAuditNotice
);

export default router;
