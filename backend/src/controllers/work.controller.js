import asyncHandler from "../utils/asyncHandler.js";
import {
  getWorkDetail,
  issueAuditNotice as issueAuditNoticeService,
} from "../services/workDetail.service.js";

/**
 * 1) GET /api/works/:workId
 * Looks up Work by workId, flattened into comprehensive work object.
 * Accessible to any authenticated role.
 */
export const getWorkById = asyncHandler(async (req, res) => {
  let workId = req.params.workId || req.query.workId;
  if (Array.isArray(workId)) {
    workId = workId.join("/");
  }
  if (workId) {
    workId = decodeURIComponent(workId);
  }
  const work = await getWorkDetail(workId);

  if (!work) {
    return res.status(404).json({ error: "Work not found" });
  }

  return res.status(200).json(work);
});

/**
 * 2) POST /api/works/:workId/audit-notice
 * Creates an AuditorReport row with status = 'Under Review'.
 * Restricted to roles: 'ministry', 'district', 'state', 'auditor'.
 */
export const issueAuditNotice = asyncHandler(async (req, res) => {
  let workId = req.params.workId || req.body.workId;
  if (Array.isArray(workId)) {
    workId = workId.join("/");
  }
  if (workId) {
    workId = decodeURIComponent(workId);
  }
  const result = await issueAuditNoticeService(workId, req.user);
  return res.status(200).json(result);
});

export default {
  getWorkById,
  issueAuditNotice,
};
