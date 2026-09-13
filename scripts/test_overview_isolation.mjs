const BASE_URL = 'http://localhost:5000';

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ministry@mplads-sentinel.local', password: 'ministry123' }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${JSON.stringify(body)}`);
  return body.token || body.data?.token;
}

async function main() {
  console.log('========================================================');
  console.log('TESTING DECOMPOSED MINISTRY OVERVIEW ENDPOINTS (ISOLATION)');
  console.log('========================================================\n');

  const token = await login();
  console.log('✓ Ministry login successful\n');

  const headers = { Authorization: `Bearer ${token}` };

  const endpoints = [
    { name: 'KPIs', path: '/api/ministry/overview/kpis' },
    { name: 'Risk Severity', path: '/api/ministry/overview/risk' },
    { name: 'States Matrix', path: '/api/ministry/overview/states' },
    { name: 'Urgent States', path: '/api/ministry/overview/urgent' },
    { name: 'Recent Alerts', path: '/api/ministry/overview/alerts' },
    { name: 'MP Leaderboard', path: '/api/ministry/mp-performance?limit=5' },
  ];

  console.log('Fired 6 independent requests concurrently...');
  const t0 = Date.now();
  const results = await Promise.all(
    endpoints.map(async (ep) => {
      const start = Date.now();
      const res = await fetch(`${BASE_URL}${ep.path}`, { headers });
      const elapsed = Date.now() - start;
      const json = await res.json();
      return { ...ep, status: res.status, elapsed, json };
    })
  );
  const totalElapsed = Date.now() - t0;
  console.log(`All 6 requests resolved in ${totalElapsed}ms total!\n`);

  let allPassed = true;

  for (const r of results) {
    console.log(`----------------------------------------`);
    console.log(`Endpoint: ${r.name} (${r.path})`);
    console.log(`HTTP Status: ${r.status} (${r.elapsed}ms)`);

    if (r.status !== 200) {
      console.error(`❌ Non-200 status: ${r.status}`);
      allPassed = false;
      continue;
    }

    if (r.name === 'KPIs') {
      const {
        totalWorksRecommended,
        totalSanctionedWorks,
        totalSanctionedCr,
        totalCompletedWorks,
        completionRate,
        totalExpenditureCr,
        expenditureRatio,
        totalFlaggedCases,
        flaggedRatePercent,
      } = r.json;

      if (
        typeof totalWorksRecommended === 'number' &&
        typeof totalSanctionedWorks === 'number' &&
        typeof totalSanctionedCr === 'number' &&
        typeof totalCompletedWorks === 'number' &&
        typeof totalExpenditureCr === 'number' &&
        typeof totalFlaggedCases === 'number'
      ) {
        console.log(`  ✓ Valid KPI shape:`);
        console.log(`    Recommended: ${totalWorksRecommended.toLocaleString()}`);
        console.log(`    Sanctioned: ${totalSanctionedWorks.toLocaleString()} (₹${totalSanctionedCr} Cr)`);
        console.log(`    Completed: ${totalCompletedWorks.toLocaleString()} (${completionRate}%)`);
        console.log(`    Expenditure: ₹${totalExpenditureCr} Cr (${expenditureRatio}%)`);
        console.log(`    Flagged: ${totalFlaggedCases.toLocaleString()} (${flaggedRatePercent}%)`);
      } else {
        console.error(`❌ Invalid KPI payload shape:`, r.json);
        allPassed = false;
      }
    } else if (r.name === 'Risk Severity') {
      const { riskDistribution } = r.json;
      if (
        riskDistribution &&
        riskDistribution.low === 0 &&
        typeof riskDistribution.medium === 'number' &&
        typeof riskDistribution.high === 'number'
      ) {
        console.log(`  ✓ Valid Risk Distribution: Low=${riskDistribution.low}, Med=${riskDistribution.medium}, High=${riskDistribution.high}`);
      } else {
        console.error(`❌ Invalid Risk payload shape:`, r.json);
        allPassed = false;
      }
    } else if (r.name === 'States Matrix') {
      const { statesData } = r.json;
      if (Array.isArray(statesData) && statesData.length > 0) {
        const sample = statesData[0];
        console.log(`  ✓ Valid States Data: ${statesData.length} states returned`);
        console.log(`    Sample: ${sample.state} (${sample.code}) - Works: ${sample.totalWorks}, Flagged: ${sample.flaggedCount}, Index: ${sample.riskIndex}`);
      } else {
        console.error(`❌ Invalid States payload shape:`, r.json);
        allPassed = false;
      }
    } else if (r.name === 'Urgent States') {
      const { topAttentionStates } = r.json;
      if (Array.isArray(topAttentionStates) && topAttentionStates.length <= 5) {
        console.log(`  ✓ Valid Urgent States: ${topAttentionStates.length} states returned`);
        console.log(`    Top Urgent: ${topAttentionStates.map(s => `${s.state} (Index ${s.riskIndex})`).join(', ')}`);
      } else {
        console.error(`❌ Invalid Urgent States payload shape:`, r.json);
        allPassed = false;
      }
    } else if (r.name === 'Recent Alerts') {
      const { recentAlerts } = r.json;
      if (Array.isArray(recentAlerts) && recentAlerts.length > 0) {
        console.log(`  ✓ Valid Recent Alerts: ${recentAlerts.length} alerts returned`);
        const a = recentAlerts[0];
        console.log(`    Sample: ${a.workId} (${a.riskLevel}, ${a.riskScore}) - ${a.state} - ₹${a.sanctionedAmount}L`);
      } else {
        console.error(`❌ Invalid Alerts payload shape:`, r.json);
        allPassed = false;
      }
    } else if (r.name === 'MP Leaderboard') {
      if (Array.isArray(r.json.data) && r.json.top5) {
        console.log(`  ✓ Valid MP Leaderboard: ${r.json.data.length} MPs on page, Top5 count: ${r.json.top5.length}`);
      } else {
        console.error(`❌ Invalid MP Leaderboard payload shape`);
        allPassed = false;
      }
    }
  }

  console.log(`\n========================================================`);
  if (allPassed) {
    console.log(`ALL 6 INDEPENDENT ENDPOINTS PASSED ISOLATION VALIDATION!`);
  } else {
    console.error(`SOME ENDPOINTS FAILED VALIDATION!`);
    process.exit(1);
  }
  console.log(`========================================================\n`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
