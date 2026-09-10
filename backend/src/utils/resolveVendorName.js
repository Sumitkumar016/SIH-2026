import { prisma } from "../config/db.js";

/**
 * utils/resolveVendorName.js
 * 
 * Given a workId string or a Work object with populated expenditures,
 * resolves the vendor name associated with the largest single expenditure.
 * 
 * - If expenditures are already provided synchronously on the object, returns the string directly.
 * - If only a workId is provided, queries the database asynchronously.
 *
 * @param {string|Object} workOrWorkId - Work ID string or Work object with expenditures array
 * @param {string|null} [fallback="Not Appointed"] - Default fallback value if no vendor found
 * @returns {Promise<string|null>|string|null}
 */
export function resolveVendorName(workOrWorkId, fallback = "Not Appointed") {
  if (!workOrWorkId) return fallback;

  // Case 1: An expenditures array is passed directly
  let expenditures = null;
  if (Array.isArray(workOrWorkId)) {
    expenditures = workOrWorkId;
  } else if (Array.isArray(workOrWorkId.expenditures)) {
    expenditures = workOrWorkId.expenditures;
  }

  // If expenditures are available in memory, resolve without a database query
  if (expenditures) {
    if (expenditures.length === 0) return fallback;

    // Find the expenditure with the highest amount in a single pass
    let largestExp = expenditures[0];
    for (const exp of expenditures) {
      if (Number(exp.amount || 0) > Number(largestExp.amount || 0)) {
        largestExp = exp;
      }
    }

    const resolvedName =
      largestExp?.vendor?.vendor_name ||
      largestExp?.vendor_name ||
      largestExp?.vendorName;

    return resolvedName || fallback;
  }

  // Case 2: A workId string (or object without populated expenditures) is passed
  let workId = null;
  if (typeof workOrWorkId === "string") {
    workId = workOrWorkId;
  } else if (workOrWorkId.work_id) {
    workId = workOrWorkId.work_id;
  } else if (workOrWorkId.workId) {
    workId = workOrWorkId.workId;
  }

  if (!workId) return fallback;

  // Query database for the single largest expenditure row for this work
  return fetchLargestVendorFromDb(workId, fallback);
}

/**
 * Helper function to query the vendor with the highest payment for a given workId.
 */
async function fetchLargestVendorFromDb(workId, fallback) {
  const largestExp = await prisma.expenditure.findFirst({
    where: { work_id: workId },
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
  });

  return largestExp?.vendor?.vendor_name || fallback;
}

export default resolveVendorName;
