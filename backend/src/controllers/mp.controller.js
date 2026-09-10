import asyncHandler from "../utils/asyncHandler.js";
import { getConstituencyOverview } from "../services/mpOverview.service.js";
import { getMyWorks as getMyWorksService } from "../services/mpWorks.service.js";

/**
 * GET /api/mp/overview
 * Scoped constituency metrics and flagged cases for the authenticated Member of Parliament.
 * Protected with protect, restrictTo('mp').
 * Resolves MP from req.user.mp_id.
 */
export const getMyConstituencyOverview = asyncHandler(async (req, res) => {
  const mpId = req.user?.mp_id;

  if (!mpId) {
    return res.status(403).json({
      error: "No MP profile linked to this account",
    });
  }

  const result = await getConstituencyOverview(mpId);
  return res.status(200).json(result);
});

/**
 * GET /api/mp/works
 * Full portfolio of development works for the authenticated Member of Parliament.
 * Protected with protect, restrictTo('mp').
 * Scoped strictly to req.user.mp_id.
 */
export const getMyWorks = asyncHandler(async (req, res) => {
  const mpId = req.user?.mp_id;

  if (!mpId) {
    return res.status(403).json({
      error: "No MP profile linked to this account",
    });
  }

  const result = await getMyWorksService(mpId, req.query);
  return res.status(200).json(result);
});

export default {
  getMyConstituencyOverview,
  getMyWorks,
};

