import { prisma } from "../../config/db.js";

/**
 * services/shared/latestFor.service.js
 * Shared query helpers for retrieving the most recent records related to a given workId.
 */

/**
 * Returns the AuditorReport row for this work with the highest submitted_date (null if none exist).
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getLatestAuditorReport(workId) {
  if (!workId) return null;

  return await prisma.auditorReport.findFirst({
    where: { work_id: workId },
    orderBy: [
      { submitted_date: "desc" },
      { report_id: "desc" },
    ],
  });
}

/**
 * Returns the Escalation row for this work with the highest escalated_date (null if none exist).
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getLatestEscalation(workId) {
  if (!workId) return null;

  return await prisma.escalation.findFirst({
    where: { work_id: workId },
    orderBy: [
      { escalated_date: "desc" },
      { escalation_id: "desc" },
    ],
  });
}

/**
 * Returns the WorkProgress row for this work with the highest report_date (null if none exist).
 *
 * @param {string} workId
 * @returns {Promise<Object|null>}
 */
export async function getLatestWorkProgress(workId) {
  if (!workId) return null;

  return await prisma.workProgress.findFirst({
    where: { work_id: workId },
    orderBy: [
      { report_date: "desc" },
      { progress_id: "desc" },
    ],
  });
}

export default {
  getLatestAuditorReport,
  getLatestEscalation,
  getLatestWorkProgress,
};
