import { prisma } from "../src/config/db.js";

async function backfillCurrentRiskScore() {
  console.log("Starting backfill for current_risk_score_id...");

  // 1. Query all existing risk scores
  const allRiskScores = await prisma.riskScore.findMany({
    select: {
      risk_id: true,
      work_id: true,
      is_current: true,
    },
  });

  console.log(`Found ${allRiskScores.length} existing RiskScore records.`);

  // 2. Ensure is_current: true on all of them
  const updatedScores = await prisma.riskScore.updateMany({
    where: {
      is_current: false,
    },
    data: {
      is_current: true,
    },
  });
  console.log(`Updated ${updatedScores.count} RiskScore rows that had is_current: false to true.`);

  // 3. Set each corresponding Work.current_risk_score_id to point at that work's RiskScore row's risk_id
  let backfilledCount = 0;
  for (const rs of allRiskScores) {
    if (rs.work_id) {
      await prisma.work.update({
        where: { work_id: rs.work_id },
        data: { current_risk_score_id: rs.risk_id },
      });
      backfilledCount++;
    }
  }

  // 4. Count works with zero RiskScore rows (current_risk_score_id remains null)
  const worksWithoutRiskScore = await prisma.work.count({
    where: {
      current_risk_score_id: null,
    },
  });

  const totalWorks = await prisma.work.count();

  console.log(`Backfill complete:`);
  console.log(`- Works backfilled with current_risk_score_id: ${backfilledCount}`);
  console.log(`- Works with zero RiskScore rows (staying null): ${worksWithoutRiskScore}`);
  console.log(`- Total works in database: ${totalWorks}`);
}

backfillCurrentRiskScore()
  .catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
