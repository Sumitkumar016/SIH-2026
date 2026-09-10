import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getNationalOverview,
  getFlaggedWorks,
  getMpPerformance,
  getTrendsAnalytics,
  getPredictions,
} from "../controllers/ministry.controller.js";

const router = express.Router();

/**
 * GET /api/ministry/overview
 * National Overview:
 * High-level national metrics, state-wise risk summaries, and 10 recent high-risk alerts.
 * Role: "ministry"
 */
router.get("/overview", protect, restrictTo("ministry"), getNationalOverview);

/**
 * GET /api/ministry/flagged
 * Flagged Works Portfolio:
 * Returns paginated, searchable, and filterable flagged projects nationwide.
 * Role: "ministry"
 */
router.get("/flagged", protect, restrictTo("ministry"), getFlaggedWorks);

/**
 * GET /api/ministry/mp-performance
 * MP Performance & Leaderboard:
 * Ranks MPs by fund utilization, completion rate, and track record.
 * Role: "ministry"
 */
router.get("/mp-performance", protect, restrictTo("ministry"), getMpPerformance);

/**
 * GET /api/ministry/trends
 * National Trends & Analytics:
 * 12-month time series, category vulnerabilities, vendor concentration, and state comparisons.
 * Role: "ministry"
 */
router.get("/trends", protect, restrictTo("ministry"), getTrendsAnalytics);

/**
 * GET /api/ministry/predictions
 * Predictive Risk Watchlist:
 * Forecasts projects at risk of cost overrun or delay over the next 30 days.
 * Role: "ministry"
 */
router.get("/predictions", protect, restrictTo("ministry"), getPredictions);

export default router;
