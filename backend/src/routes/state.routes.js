import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getStateOverview,
  getDistrictSummary,
} from "../controllers/state.controller.js";

const router = express.Router();

/**
 * GET /api/state/overview
 * State Overview:
 * State-wide summary metrics, district coverage, and comparative risk statistics across all districts.
 * Scoped to req.user.state_id.
 * Role: "state"
 */
router.get("/overview", protect, restrictTo("state"), getStateOverview);

/**
 * GET /api/state/districts/:districtName/summary
 * District Drill-Down Summary:
 * Detailed metrics for a single district and its top 3 highest-risk projects.
 * Scoped to req.user.state_id.
 * Role: "state"
 */
router.get(
  "/districts/:districtName/summary",
  protect,
  restrictTo("state"),
  getDistrictSummary
);

export default router;
