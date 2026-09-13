import { prisma } from '../backend/src/config/db.js';

async function audit() {
  try {
    console.log('--- AUDITING DATABASE DIRECTLY VIA PRISMA ---');

    // 1. Total works in DB
    const totalWorks = await prisma.work.count();
    console.log('Total Works (all statuses):', totalWorks);

    // 2. Works by status
    const byStatus = await prisma.work.groupBy({
      by: ['status'],
      _count: { work_id: true }
    });
    console.log('Works grouped by status:', byStatus);

    // 3. Expenditures sum and count
    const expAgg = await prisma.expenditure.aggregate({
      _sum: { amount: true },
      _count: { expenditure_id: true }
    });
    const rawSum = expAgg._sum.amount ? Number(expAgg._sum.amount) : 0;
    console.log('Expenditure aggregate:', {
      count: expAgg._count.expenditure_id,
      rawSumRupees: rawSum,
      sumCrores: (rawSum / 10000000).toFixed(2),
    });

    // 4. Also check work.sanctioned_amount sum and recommended_amount sum
    const sanctionedAgg = await prisma.work.aggregate({
      _sum: { sanctioned_amount: true, recommended_amount: true },
      where: { status: { not: 'Recommended' } }
    });
    console.log('Sanctioned works amount sum (status != Recommended):', {
      rawSanctionedRupees: Number(sanctionedAgg._sum.sanctioned_amount || 0),
      sanctionedCr: (Number(sanctionedAgg._sum.sanctioned_amount || 0) / 10000000).toFixed(2),
      rawRecommendedRupees: Number(sanctionedAgg._sum.recommended_amount || 0),
      recommendedCr: (Number(sanctionedAgg._sum.recommended_amount || 0) / 10000000).toFixed(2),
    });

    // 5. Total RiskScore table count & breakdown
    const totalRiskScores = await prisma.riskScore.count();
    const riskByLevel = await prisma.riskScore.groupBy({
      by: ['risk_level'],
      _count: { risk_id: true }
    });
    console.log('Total RiskScore records:', totalRiskScores);
    console.log('RiskScores grouped by risk_level:', riskByLevel);

    // 6. Current Risk Score on Work (Work.current_risk_score_id)
    const worksWithCurrentScore = await prisma.work.count({
      where: { current_risk_score_id: { not: null } }
    });
    console.log('Works with current_risk_score_id not null:', worksWithCurrentScore);

    // 7. Flagged works: works with status != 'Recommended' and current risk score >= 40
    const flaggedSanctioned = await prisma.work.count({
      where: {
        status: { not: 'Recommended' },
        current_risk_score: {
          risk_score: { gte: 40 }
        }
      }
    });
    console.log('Sanctioned works with current_risk_score >= 40 (Flagged for Review):', flaggedSanctioned);

    // 8. Flagged works breakdown by risk_level
    const highRiskSanctioned = await prisma.work.count({
      where: {
        status: { not: 'Recommended' },
        current_risk_score: {
          risk_level: 'High'
        }
      }
    });
    const medRiskSanctioned = await prisma.work.count({
      where: {
        status: { not: 'Recommended' },
        current_risk_score: {
          risk_level: 'Medium'
        }
      }
    });
    console.log('Sanctioned High Risk count:', highRiskSanctioned);
    console.log('Sanctioned Medium Risk count:', medRiskSanctioned);

    // 9. What if we include 'Recommended' works?
    const allFlagged = await prisma.work.count({
      where: {
        current_risk_score: {
          risk_score: { gte: 40 }
        }
      }
    });
    console.log('ALL works with current_risk_score >= 40 (including Recommended):', allFlagged);

    const allHigh = await prisma.work.count({
      where: {
        current_risk_score: {
          risk_level: 'High'
        }
      }
    });
    const allMed = await prisma.work.count({
      where: {
        current_risk_score: {
          risk_level: 'Medium'
        }
      }
    });
    console.log('ALL High Risk count (including Recommended):', allHigh);
    console.log('ALL Medium Risk count (including Recommended):', allMed);

    // Check all tables and schemas
    const tables = await prisma.$queryRawUnsafe(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_name
    `);
    console.log('\n--- ALL DATABASE TABLES AND ROW COUNTS ---');
    for (const t of tables) {
      const count = await prisma.$queryRawUnsafe(`SELECT COUNT(*) FROM "${t.table_schema}"."${t.table_name}"`);
      console.log(`  ${t.table_schema}.${t.table_name}: ${count[0].count} rows`);
    }
  } catch (err) {
    console.error('Audit failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

audit();
