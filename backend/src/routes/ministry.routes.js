import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getOverviewKpis,
  getOverviewRisk,
  getOverviewStates,
  getOverviewUrgent,
  getOverviewAlerts,
  getFlaggedWorks,
  getMpPerformance,
  getTrendsMonthly,
  getTrendsCategories,
  getTrendsVendors,
  getTrendsStates,
  getTrendsLocations,
  getTrendsAnalytics,
  getPredictions,
} from "../controllers/ministry.controller.js";

const router = express.Router();

/**
 * Overview Endpoints:
 * Decomposed into 5 independent services for high resilience and low latency.
 * Role: "ministry"
 */
router.get("/overview/kpis", protect, restrictTo("ministry"), getOverviewKpis);
router.get("/overview/risk", protect, restrictTo("ministry"), getOverviewRisk);
router.get("/overview/states", protect, restrictTo("ministry"), getOverviewStates);
router.get("/overview/urgent", protect, restrictTo("ministry"), getOverviewUrgent);
router.get("/overview/alerts", protect, restrictTo("ministry"), getOverviewAlerts);

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
 * Trends & Analytics Endpoints:
 * Decomposed into 4 isolated computation domains + location metadata + backwards-compatible root.
 * Role: "ministry"
 */
router.get("/trends/monthly", protect, restrictTo("ministry"), getTrendsMonthly);
router.get("/trends/categories", protect, restrictTo("ministry"), getTrendsCategories);
router.get("/trends/vendors", protect, restrictTo("ministry"), getTrendsVendors);
router.get("/trends/states", protect, restrictTo("ministry"), getTrendsStates);
router.get("/trends/locations", protect, restrictTo("ministry"), getTrendsLocations);
router.get("/trends", protect, restrictTo("ministry"), getTrendsAnalytics);

/**
 * GET /api/ministry/predictions
 * Predictive Risk Watchlist:
 * Forecasts projects at risk of cost overrun or delay over the next 30 days.
 * Role: "ministry"
 */
router.get("/predictions", protect, restrictTo("ministry"), getPredictions);

export default router;
