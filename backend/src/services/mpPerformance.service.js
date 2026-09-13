import { prisma } from "../config/db.js";
import { getDisplayStatus } from "../utils/workStatus.js";

/**
 * Checks whether fund utilization falls within the chosen percentage range.
 */
function matchesUtilizationRange(utilization, range) {
  if (!range || range === "All") return true;
  if (utilization === null || isNaN(utilization)) return false;

  if (range === ">100") return utilization > 100;
  if (range === "75-100") return utilization >= 75 && utilization <= 100;
  if (range === "50-75") return utilization >= 50 && utilization < 75;
  if (range === "25-50") return utilization >= 25 && utilization < 50;
  if (range === "0-25") return utilization >= 0 && utilization < 25;

  return true;
}

/**
 * Checks whether project completion rate falls within the chosen percentage range.
 */
function matchesCompletionRange(completionRate, range) {
  if (!range || range === "All") return true;
  if (completionRate === null || isNaN(completionRate)) return false;

  if (range === "75-100") return completionRate >= 75 && completionRate <= 100;
  if (range === "50-75") return completionRate >= 50 && completionRate < 75;
  if (range === "25-50") return completionRate >= 25 && completionRate < 50;
  if (range === "0-25") return completionRate >= 0 && completionRate < 25;

  return true;
}

// Cache for lightweight metadata (states, districts, top5, bottom5) to keep subsequent page queries instant
let cachedMetadata = null;
let lastMetadataTime = 0;
const METADATA_TTL_MS = 60 * 1000;

export async function getMpLeaderboard(filters = {}) {
  const {
    search,
    state,
    district,
    utilizationRange,
    completionRange,
    sortField = "fundUtilization",
    sortDirection = "desc",
  } = filters;

  const page = Math.max(1, parseInt(filters.page || 1, 10));
  const limit = Math.max(1, parseInt(filters.limit || 15, 10));
  const offset = (page - 1) * limit;
  const paginationSql = `LIMIT ${limit} OFFSET ${offset}`;

  // Build dynamic SQL where conditions
  const whereClauses = [];
  const params = [];
  let paramIdx = 1;

  if (search && search.trim() !== "" && search !== "All") {
    whereClauses.push(`(
      mp_name ILIKE $${paramIdx} OR 
      constituency ILIKE $${paramIdx} OR 
      COALESCE(state_name, '') ILIKE $${paramIdx} OR 
      array_to_string(districts, ' ') ILIKE $${paramIdx}
    )`);
    params.push(`%${search.trim()}%`);
    paramIdx++;
  }

  if (state && state !== "All") {
    whereClauses.push(`LOWER(COALESCE(state_name, '')) = LOWER($${paramIdx})`);
    params.push(state.trim());
    paramIdx++;
  }

  if (district && district !== "All") {
    whereClauses.push(`(
      constituency ILIKE $${paramIdx} OR 
      array_to_string(districts, ' ') ILIKE $${paramIdx}
    )`);
    params.push(`%${district.trim()}%`);
    paramIdx++;
  }

  if (utilizationRange && utilizationRange !== "All") {
    if (utilizationRange === ">100") {
      whereClauses.push(`fund_utilization > 100`);
    } else if (utilizationRange === "75-100") {
      whereClauses.push(`fund_utilization >= 75 AND fund_utilization <= 100`);
    } else if (utilizationRange === "50-75") {
      whereClauses.push(`fund_utilization >= 50 AND fund_utilization < 75`);
    } else if (utilizationRange === "25-50") {
      whereClauses.push(`fund_utilization >= 25 AND fund_utilization < 50`);
    } else if (utilizationRange === "0-25") {
      whereClauses.push(`fund_utilization >= 0 AND fund_utilization < 25`);
    }
  }

  if (completionRange && completionRange !== "All") {
    if (completionRange === "75-100") {
      whereClauses.push(`completion_rate >= 75 AND completion_rate <= 100`);
    } else if (completionRange === "50-75") {
      whereClauses.push(`completion_rate >= 50 AND completion_rate < 75`);
    } else if (completionRange === "25-50") {
      whereClauses.push(`completion_rate >= 25 AND completion_rate < 50`);
    } else if (completionRange === "0-25") {
      whereClauses.push(`completion_rate >= 0 AND completion_rate < 25`);
    }
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Database-level sorting
  const dir = (sortDirection || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
  let orderBy = "fund_utilization DESC NULLS LAST, mp_id ASC";
  if (sortField === "completionRate") {
    orderBy = `completion_rate ${dir} NULLS LAST, mp_id ASC`;
  } else if (sortField === "fundUtilization") {
    orderBy = `fund_utilization ${dir} NULLS LAST, mp_id ASC`;
  } else if (sortField === "totalWorks") {
    orderBy = `total_works ${dir}, mp_id ASC`;
  } else if (sortField === "totalSanctionedAmount") {
    orderBy = `total_sanctioned_amount ${dir}, mp_id ASC`;
  } else if (sortField === "totalExpenditure") {
    orderBy = `total_expenditure ${dir}, mp_id ASC`;
  } else if (sortField === "mpName") {
    orderBy = `mp_name ${dir}, mp_id ASC`;
  } else if (sortField === "state") {
    orderBy = `state_name ${dir}, mp_id ASC`;
  } else if (sortField === "district" || sortField === "constituency") {
    orderBy = `constituency ${dir}, mp_id ASC`;
  }

  // Pure SQL CTE with database-side filtering, sorting, full_count, and LIMIT/OFFSET
  const query = `
    WITH under_review AS (
      SELECT DISTINCT work_id FROM escalations
      UNION
      SELECT DISTINCT work_id FROM auditor_reports
      WHERE status::text ILIKE '%under%review%' OR status::text ILIKE '%escalated%'
    ),
    delayed AS (
      SELECT w.work_id
      FROM works w
      LEFT JOIN risk_scores rs ON w.current_risk_score_id = rs.risk_id
      WHERE w.status = 'Ongoing'
        AND w.work_id NOT IN (SELECT work_id FROM under_review)
        AND (
          (w.completion_date IS NOT NULL AND w.completion_date < NOW())
          OR (rs.delay_slippage_pct IS NOT NULL AND rs.delay_slippage_pct >= 25)
          OR (rs.flag_reason IS NOT NULL AND (
              LOWER(rs.flag_reason) LIKE '%delay%' 
              OR LOWER(rs.flag_reason) LIKE '%stall%' 
              OR LOWER(rs.flag_reason) LIKE '%overdue%'
          ))
        )
    ),
    work_agg AS (
      SELECT
        w.mp_id,
        COUNT(w.work_id)::int AS total_works,
        COALESCE(SUM(w.sanctioned_amount), 0)::float AS total_sanctioned_amount,
        COALESCE(SUM(we.total_amount), 0)::float AS total_expenditure,
        COUNT(CASE WHEN w.status = 'Completed' THEN 1 END)::int AS completed_works,
        COUNT(CASE WHEN ur.work_id IS NOT NULL AND w.status != 'Completed' THEN 1 END)::int AS under_review_works,
        COUNT(CASE WHEN w.status = 'Ongoing' AND ur.work_id IS NULL AND dl.work_id IS NULL THEN 1 END)::int AS ongoing_works,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT d.district_name), NULL) AS districts
      FROM works w
      LEFT JOIN districts d ON w.district_id = d.district_id
      LEFT JOIN under_review ur ON w.work_id = ur.work_id
      LEFT JOIN delayed dl ON w.work_id = dl.work_id
      LEFT JOIN (
        SELECT work_id, SUM(amount) AS total_amount
        FROM expenditures
        GROUP BY work_id
      ) we ON w.work_id = we.work_id
      GROUP BY w.mp_id
    ),
    base_mps AS (
      SELECT
        m.mp_id,
        m.mp_name,
        m.constituency,
        COALESCE(
          s.state_name,
          (SELECT s2.state_name FROM works w2 JOIN states s2 ON w2.state_id = s2.state_id WHERE w2.mp_id = m.mp_id LIMIT 1),
          ''
        ) AS state_name,
        wa.total_works,
        wa.total_sanctioned_amount,
        wa.total_expenditure,
        wa.completed_works,
        wa.under_review_works,
        wa.ongoing_works,
        wa.districts,
        CASE 
          WHEN wa.total_sanctioned_amount > 0 THEN ROUND(((wa.total_expenditure / wa.total_sanctioned_amount) * 100)::numeric, 1)::float
          ELSE NULL
        END AS fund_utilization,
        CASE
          WHEN wa.total_works > 0 THEN ROUND(((wa.completed_works::float / wa.total_works::float) * 100)::numeric, 1)::float
          ELSE NULL
        END AS completion_rate
      FROM mps m
      LEFT JOIN states s ON m.state_id = s.state_id
      INNER JOIN work_agg wa ON m.mp_id = wa.mp_id
    )
    SELECT
      *,
      COUNT(*) OVER()::int AS full_count
    FROM base_mps
    ${whereSql}
    ORDER BY ${orderBy}
    ${paginationSql};
  `;

  // Execute database query with parameters
  const pageRows = await prisma.$queryRawUnsafe(query, ...params);

  const total = pageRows.length > 0 ? Number(pageRows[0].full_count) : 0;
  const totalPages = Math.ceil(total / limit) || 1;

  // Query categories ONLY for the MPs returned on this page
  const catMap = {};
  if (pageRows.length > 0) {
    const pageMpIds = pageRows.map((r) => r.mp_id).filter(Boolean);
    if (pageMpIds.length > 0) {
      const catStats = await prisma.$queryRawUnsafe(
        `SELECT mp_id, category, COUNT(*)::int AS count FROM works WHERE mp_id IN (${pageMpIds.join(",")}) AND category IS NOT NULL GROUP BY mp_id, category;`
      );
      for (const row of catStats) {
        if (!catMap[row.mp_id]) catMap[row.mp_id] = {};
        catMap[row.mp_id][row.category] = row.count;
      }
    }
  }

  // Map rows to frontend MP object shape
  const data = pageRows.map((mp) => {
    const totalSanctionedAmount = Number(Number(mp.total_sanctioned_amount || 0).toFixed(2));
    const totalExpenditure = Number(Number(mp.total_expenditure || 0).toFixed(2));
    const totalWorks = Number(mp.total_works || 0);
    const completedWorks = Number(mp.completed_works || 0);
    const ongoingWorks = Number(mp.ongoing_works || 0);
    const underReviewWorks = Number(mp.under_review_works || 0);
    const mpDistricts = Array.isArray(mp.districts) ? mp.districts : [];
    const primaryDistrict = mpDistricts[0] || mp.constituency || "";

    return {
      mpName: mp.mp_name || "",
      state: mp.state_name || "",
      district: primaryDistrict,
      constituency: mp.constituency || "",
      totalSanctionedAmount,
      totalExpenditure,
      totalWorks,
      completedWorks,
      ongoingWorks,
      underReviewWorks,
      fundUtilization: mp.fund_utilization !== null ? Number(mp.fund_utilization) : null,
      completionRate: mp.completion_rate !== null ? Number(mp.completion_rate) : null,
      categories: catMap[mp.mp_id] || {},
    };
  });

  // Maintain lightweight cached metadata for top5/bottom5 and dropdowns
  const now = Date.now();
  if (!cachedMetadata || now - lastMetadataTime > METADATA_TTL_MS) {
    const [statesRes, districtsRes, top5Res, bottom5Res] = await Promise.all([
      prisma.state.findMany({ select: { state_name: true }, orderBy: { state_name: "asc" } }),
      prisma.district.findMany({ select: { district_name: true }, orderBy: { district_name: "asc" } }),
      prisma.$queryRaw`
        SELECT m.mp_id, m.mp_name, m.constituency, COALESCE(s.state_name, '') AS state_name,
               wa.total_works, wa.total_sanctioned_amount, wa.total_expenditure, wa.completed_works, wa.ongoing_works, wa.under_review_works,
               ROUND(((wa.total_expenditure / wa.total_sanctioned_amount) * 100)::numeric, 1)::float AS fund_utilization,
               ROUND(((wa.completed_works::float / wa.total_works::float) * 100)::numeric, 1)::float AS completion_rate
        FROM mps m
        LEFT JOIN states s ON m.state_id = s.state_id
        INNER JOIN (
          SELECT w.mp_id, COUNT(*)::int AS total_works,
                 COALESCE(SUM(w.sanctioned_amount), 0)::float AS total_sanctioned_amount,
                 COALESCE(SUM(we.total_amount), 0)::float AS total_expenditure,
                 COUNT(CASE WHEN w.status = 'Completed' THEN 1 END)::int AS completed_works,
                 COUNT(CASE WHEN w.status = 'Ongoing' THEN 1 END)::int AS ongoing_works,
                 0::int AS under_review_works
          FROM works w
          LEFT JOIN (SELECT work_id, SUM(amount) AS total_amount FROM expenditures GROUP BY work_id) we ON w.work_id = we.work_id
          GROUP BY w.mp_id
          HAVING COALESCE(SUM(w.sanctioned_amount), 0) > 0
        ) wa ON m.mp_id = wa.mp_id
        ORDER BY fund_utilization DESC NULLS LAST
        LIMIT 5;
      `,
      prisma.$queryRaw`
        SELECT m.mp_id, m.mp_name, m.constituency, COALESCE(s.state_name, '') AS state_name,
               wa.total_works, wa.total_sanctioned_amount, wa.total_expenditure, wa.completed_works, wa.ongoing_works, wa.under_review_works,
               ROUND(((wa.total_expenditure / wa.total_sanctioned_amount) * 100)::numeric, 1)::float AS fund_utilization,
               ROUND(((wa.completed_works::float / wa.total_works::float) * 100)::numeric, 1)::float AS completion_rate
        FROM mps m
        LEFT JOIN states s ON m.state_id = s.state_id
        INNER JOIN (
          SELECT w.mp_id, COUNT(*)::int AS total_works,
                 COALESCE(SUM(w.sanctioned_amount), 0)::float AS total_sanctioned_amount,
                 COALESCE(SUM(we.total_amount), 0)::float AS total_expenditure,
                 COUNT(CASE WHEN w.status = 'Completed' THEN 1 END)::int AS completed_works,
                 COUNT(CASE WHEN w.status = 'Ongoing' THEN 1 END)::int AS ongoing_works,
                 0::int AS under_review_works
          FROM works w
          LEFT JOIN (SELECT work_id, SUM(amount) AS total_amount FROM expenditures GROUP BY work_id) we ON w.work_id = we.work_id
          GROUP BY w.mp_id
          HAVING COALESCE(SUM(w.sanctioned_amount), 0) > 0
        ) wa ON m.mp_id = wa.mp_id
        ORDER BY fund_utilization ASC NULLS LAST
        LIMIT 5;
      `,
    ]);

    const topBottomMpIds = [...top5Res, ...bottom5Res].map((m) => m.mp_id).filter(Boolean);
    const topBottomCatMap = {};
    if (topBottomMpIds.length > 0) {
      const catStats = await prisma.$queryRawUnsafe(
        `SELECT mp_id, category, COUNT(*)::int AS count FROM works WHERE mp_id IN (${topBottomMpIds.join(",")}) AND category IS NOT NULL GROUP BY mp_id, category;`
      );
      for (const row of catStats) {
        if (!topBottomCatMap[row.mp_id]) topBottomCatMap[row.mp_id] = {};
        topBottomCatMap[row.mp_id][row.category] = row.count;
      }
    }

    cachedMetadata = {
      availableStates: statesRes.map((s) => s.state_name),
      availableDistricts: districtsRes.map((d) => d.district_name),
      top5: top5Res.map((m, idx) => ({
        rank: idx + 1,
        mpName: m.mp_name,
        constituency: m.constituency,
        state: m.state_name,
        fundUtilization: m.fund_utilization !== null ? Number(m.fund_utilization) : null,
        completionRate: m.completion_rate !== null ? Number(m.completion_rate) : null,
        totalWorks: Number(m.total_works || 0),
        completedWorks: Number(m.completed_works || 0),
        ongoingWorks: Number(m.ongoing_works || 0),
        underReviewWorks: Number(m.under_review_works || 0),
        totalSanctionedAmount: Number(Number(m.total_sanctioned_amount).toFixed(2)),
        totalExpenditure: Number(Number(m.total_expenditure).toFixed(2)),
        categories: topBottomCatMap[m.mp_id] || {},
      })),
      bottom5: bottom5Res.map((m, idx) => ({
        rank: idx + 1,
        mpName: m.mp_name,
        constituency: m.constituency,
        state: m.state_name,
        fundUtilization: m.fund_utilization !== null ? Number(m.fund_utilization) : null,
        completionRate: m.completion_rate !== null ? Number(m.completion_rate) : null,
        totalWorks: Number(m.total_works || 0),
        completedWorks: Number(m.completed_works || 0),
        ongoingWorks: Number(m.ongoing_works || 0),
        underReviewWorks: Number(m.under_review_works || 0),
        totalSanctionedAmount: Number(Number(m.total_sanctioned_amount).toFixed(2)),
        totalExpenditure: Number(Number(m.total_expenditure).toFixed(2)),
        categories: topBottomCatMap[m.mp_id] || {},
      })),
    };
    lastMetadataTime = now;
  }

  const result = {
    data,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    availableStates: cachedMetadata.availableStates,
    availableDistricts: cachedMetadata.availableDistricts,
    top5: cachedMetadata.top5,
    bottom5: cachedMetadata.bottom5,
  };

  return result;
}

export default {
  getMpLeaderboard,
};
