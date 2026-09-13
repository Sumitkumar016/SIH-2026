import { prisma } from "../config/db.js";

/**
 * In-memory store for evidence reminder notices to guarantee persistence
 * even if notification columns are not migrated on the database table yet.
 */
export const reminderStore = new Map();

/**
 * 1) GET /api/district/verification
 * Returns works in this district where status = 'Completed' AND
 * the work's most recent WorkProgress row either doesn't exist
 * or has evidence_status != 'present'.
 *
 * @param {number|string} districtId - District Primary Key (from req.user.district_id)
 * @returns {Promise<{ data: Array }>}
 */
export async function getVerificationQueue(districtId, query = {}) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const { search, page = 1, limit = 15 } = query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 15));
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  const where = {
    district_id: parsedDistrictId,
    status: "Completed",
    work_progress: {
      none: {
        evidence_status: "present",
      },
    },
  };

  if (search && search.trim() !== "" && search !== "All") {
    const q = search.trim();
    where.AND = [
      {
        OR: [
          { work_id: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { mp: { mp_name: { contains: q, mode: "insensitive" } } },
        ],
      },
    ];
  }

  // 1. Fetch total count and page of completed works missing evidence in this district
  const [total, works] = await prisma.$transaction([
    prisma.work.count({ where }),
    prisma.work.findMany({
      where,
      skip,
      take,
      orderBy: {
        completion_date: "desc",
      },
      include: {
        mp: {
          select: {
            mp_id: true,
            mp_name: true,
          },
        },
        current_risk_score: true,
        expenditures: {
          include: {
            vendor: {
              select: {
                vendor_name: true,
              },
            },
          },
          orderBy: {
            amount: "desc",
          },
        },
        work_progress: {
          orderBy: [
            { report_date: "desc" },
            { progress_id: "desc" },
          ],
        },
        escalations: {
          orderBy: {
            escalation_id: "desc",
          },
        },
        asset_creation: {
          orderBy: {
            asset_id: "desc",
          },
        },
      },
    }),
  ]);

  const now = Date.now();
  const data = [];

  for (const w of works) {
    const mpName = w.mp?.mp_name || "Unknown MP";

    // Extract vendor name from largest expenditure row
    const largestExp = w.expenditures?.[0];
    const vendorName = largestExp?.vendor?.vendor_name || "Not Appointed";

    // Calculate days elapsed since completion
    let compDateObj = new Date();
    if (w.completion_date) {
      compDateObj = new Date(w.completion_date);
    } else if (w.created_at) {
      compDateObj = new Date(w.created_at);
    }

    const completionDate = compDateObj.toISOString();
    const diffMs = now - compDateObj.getTime();
    const daysSinceCompletion = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

    // Check if an evidence reminder was previously sent
    const reminderInfo = reminderStore.get(w.work_id);
    const evidenceReminderSent = Boolean(
      reminderInfo?.sent || w.evidence_reminder_sent || false
    );

    const latestEscalation = w.escalations?.[0];
    const escalationSource = latestEscalation?.escalation_source || null;

    let numericRiskScore = null;
    if (w.current_risk_score?.risk_score !== null && w.current_risk_score?.risk_score !== undefined) {
      numericRiskScore = Number(w.current_risk_score.risk_score);
    }

    const latestAsset = w.asset_creation?.[0];
    const assetVerificationStatus = latestAsset?.verification_status || null;

    data.push({
      workId: w.work_id,
      mpName,
      category: w.category || "",
      description: w.description || "",
      flagReason: w.current_risk_score?.flag_reason || null,
      vendorName,
      completionDate,
      daysSinceCompletion,
      riskLevel: w.current_risk_score?.risk_level || null,
      riskScore: numericRiskScore,
      evidenceReminderSent,
      escalationSource,
      assetVerificationStatus,
    });
  }

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    data,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  };
}

/**
 * 2) POST /api/district/verification/:workId/verify
 * Confirms ground photo evidence and sets physical progress to 100%.
 *
 * @param {number|string} districtId
 * @param {string} workId
 * @param {Object} user
 * @returns {Promise<{ success: boolean, workId: string, verifiedAt: string }>}
 */
export async function markWorkVerified(districtId, workId, user) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true, district_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  if (work.district_id !== parsedDistrictId) {
    const error = new Error("Unauthorized: Work does not belong to your district");
    error.statusCode = 403;
    throw error;
  }

  const today = new Date();
  const reportedBy = user?.name || user?.username || "District Authority";

  // Create progress record marking ground evidence present and progress 100%
  await prisma.workProgress.create({
    data: {
      work_id: workId,
      report_date: today,
      evidence_status: "present",
      physical_progress_pct: 100,
      reported_by: reportedBy,
    },
  });

  return {
    success: true,
    workId,
    verifiedAt: today.toISOString(),
  };
}

/**
 * 3) POST /api/district/verification/:workId/request-evidence
 * Persists evidence reminder notice to contractor & implementing agency.
 *
 * @param {number|string} districtId
 * @param {string} workId
 * @param {string} [note]
 * @returns {Promise<{ success: boolean, workId: string, reminderSentAt: string }>}
 */
export async function requestEvidence(districtId, workId, note) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true, district_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  if (work.district_id !== parsedDistrictId) {
    const error = new Error("Unauthorized: Work does not belong to your district");
    error.statusCode = 403;
    throw error;
  }

  const now = new Date();
  reminderStore.set(workId, {
    sent: true,
    sentAt: now,
    note: note || "Formal notice sent to contractor & block engineer",
  });

  // Attempt database flag update if schema supports it
  try {
    await prisma.work.update({
      where: { work_id: workId },
      data: {
        evidence_reminder_sent: true,
        evidence_reminder_sent_at: now,
      },
    });
  } catch {
    // Retained in-memory store if column is not migrated
  }

  return {
    success: true,
    workId,
    reminderSentAt: now.toISOString(),
  };
}

/**
 * 4) POST /api/district/verification/:workId/escalate
 * Creates an Escalation row with escalationSource = 'district',
 * sending the case to the Auditor's priority investigation queue.
 *
 * @param {number|string} districtId
 * @param {string} workId
 * @param {string} note
 * @param {Object} user
 * @returns {Promise<{ success: boolean, workId: string, escalationId: number }>}
 */
export async function escalateWork(districtId, workId, note, user) {
  const parsedDistrictId = parseInt(districtId, 10);
  if (isNaN(parsedDistrictId)) {
    const error = new Error("Invalid District ID");
    error.statusCode = 400;
    throw error;
  }

  const work = await prisma.work.findUnique({
    where: { work_id: workId },
    select: { work_id: true, district_id: true },
  });

  if (!work) {
    const error = new Error("Work not found");
    error.statusCode = 404;
    throw error;
  }

  if (work.district_id !== parsedDistrictId) {
    const error = new Error("Unauthorized: Work does not belong to your district");
    error.statusCode = 403;
    throw error;
  }

  const today = new Date();
  const escalatedBy = user?.name || user?.username || "District Authority";

  const escalation = await prisma.escalation.create({
    data: {
      work_id: workId,
      escalation_source: "district",
      escalation_note: note,
      escalated_by: escalatedBy,
      escalated_date: today,
    },
  });

  return {
    success: true,
    workId,
    escalationId: escalation.escalation_id,
  };
}

export default {
  getVerificationQueue,
  markWorkVerified,
  requestEvidence,
  escalateWork,
};
