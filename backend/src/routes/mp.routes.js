import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import {
  getMyConstituencyOverview,
  getMyWorks,
} from "../controllers/mp.controller.js";

const router = express.Router();

/**
 * GET /api/mp/overview
 * MP Constituency Overview:
 * Returns annual entitlement, expenditure, utilization rate, and flagged works for the logged-in MP.
 * Scoped to req.user.mp_id.
 * Role: "mp"
 */
router.get("/overview", protect, restrictTo("mp"), getMyConstituencyOverview);

/**
 * GET /api/mp/works
 * MP Works Portfolio:
 * Returns all development works recommended by the authenticated MP with status and search filters.
 * Role: "mp"
 */
router.get("/works", protect, restrictTo("mp"), getMyWorks);

export default router;
