import asyncHandler from "../utils/asyncHandler.js";
import {
  getStateOverview as getStateOverviewService,
  getDistrictSummary as getDistrictSummaryService,
} from "../services/stateOverview.service.js";

/**
 * GET /api/state/overview
 * Scoped state-wide analytics and comparative district breakdown for State Nodal Authority.
 * Protected with protect, restrictTo('state').
 * Resolves state from req.user.state_id.
 */
export const getStateOverview = asyncHandler(async (req, res) => {
  const stateId = req.user?.state_id;

  if (!stateId) {
    return res.status(403).json({
      error: "No State profile linked to this account",
    });
  }

  const result = await getStateOverviewService(stateId);
  return res.status(200).json(result);
});

/**
 * GET /api/state/districts/:districtName/summary
 * Scoped district drill-down summary and top 3 highest-risk projects for State Nodal Authority.
 * Protected with protect, restrictTo('state').
 * Resolves state from req.user.state_id.
 */
export const getDistrictSummary = asyncHandler(async (req, res) => {
  const stateId = req.user?.state_id;

  if (!stateId) {
    return res.status(403).json({
      error: "No State profile linked to this account",
    });
  }

  const { districtName } = req.params;
  const result = await getDistrictSummaryService(stateId, districtName);
  return res.status(200).json(result);
});

export default {
  getStateOverview,
  getDistrictSummary,
};
