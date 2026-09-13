import { prisma } from '../backend/src/config/db.js';

async function main() {
  const t0 = Date.now();

  const [mpStats, catStats] = await Promise.all([
    prisma.$queryRaw`
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
      )
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
        wa.districts
      FROM mps m
      LEFT JOIN states s ON m.state_id = s.state_id
      INNER JOIN work_agg wa ON m.mp_id = wa.mp_id;
    `,
    prisma.$queryRaw`
      SELECT 
        mp_id,
        category,
        COUNT(*)::int AS count
      FROM works
      WHERE category IS NOT NULL
      GROUP BY mp_id, category;
    `
  ]);

  // Build categories map: mp_id -> { category: count }
  const catMap = new Map();
  for (const row of catStats) {
    if (!catMap.has(row.mp_id)) {
      catMap.set(row.mp_id, {});
    }
    catMap.get(row.mp_id)[row.category] = row.count;
  }

  const allStatesSet = new Set();
  const allDistrictsSet = new Set();
  const aggregatedMps = [];

  for (const mp of mpStats) {
    const totalSanctionedAmount = Number(Number(mp.total_sanctioned_amount || 0).toFixed(2));
    const totalExpenditure = Number(Number(mp.total_expenditure || 0).toFixed(2));
    const totalWorks = Number(mp.total_works || 0);
    const completedWorks = Number(mp.completed_works || 0);
    const ongoingWorks = Number(mp.ongoing_works || 0);
    const underReviewWorks = Number(mp.under_review_works || 0);

    const mpDistricts = Array.isArray(mp.districts) ? mp.districts : [];
    for (const d of mpDistricts) {
      allDistrictsSet.add(d);
    }

    const stateName = mp.state_name || '';
    if (stateName) {
      allStatesSet.add(stateName);
    }

    const primaryDistrict = mpDistricts[0] || mp.constituency || '';
    if (primaryDistrict) {
      allDistrictsSet.add(primaryDistrict);
    }

    const fundUtilization =
      totalSanctionedAmount > 0
        ? Number(((totalExpenditure / totalSanctionedAmount) * 100).toFixed(1))
        : null;

    const completionRate =
      totalWorks > 0
        ? Number(((completedWorks / totalWorks) * 100).toFixed(1))
        : null;

    aggregatedMps.push({
      mpName: mp.mp_name || '',
      state: stateName,
      district: primaryDistrict,
      constituency: mp.constituency || '',
      fundUtilization,
      totalSanctionedAmount,
      totalExpenditure,
      totalWorks,
      completedWorks,
      ongoingWorks,
      underReviewWorks,
      completionRate,
      categories: catMap.get(mp.mp_id) || {},
      _allDistricts: mpDistricts,
    });
  }

  const availableStates = Array.from(allStatesSet).sort();
  const availableDistricts = Array.from(allDistrictsSet).sort();

  const rankableMps = aggregatedMps.filter(
    (mp) => mp.fundUtilization !== null && !isNaN(mp.fundUtilization)
  );

  const top5 = [...rankableMps]
    .sort((a, b) => b.fundUtilization - a.fundUtilization)
    .slice(0, 5)
    .map((mp, index) => {
      const { _allDistricts, ...rest } = mp;
      return { ...rest, rank: index + 1 };
    });

  const bottom5 = [...rankableMps]
    .sort((a, b) => a.fundUtilization - b.fundUtilization)
    .slice(0, 5)
    .map((mp, index) => {
      const { _allDistricts, ...rest } = mp;
      return { ...rest, rank: index + 1 };
    });

  const data = aggregatedMps.map(({ _allDistricts, ...cleanItem }) => cleanItem);

  console.log('Complete pipeline executed in', Date.now() - t0, 'ms');
  console.log('Total MPs:', data.length);
  console.log('States:', availableStates.length, 'Districts:', availableDistricts.length);
  console.log('Top 1:', top5[0]);
  console.log('Bottom 1:', bottom5[0]);
}

main().catch(console.error).finally(() => prisma.$disconnect());
