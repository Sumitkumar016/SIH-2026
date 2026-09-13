import fs from 'fs';
import path from 'path';

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

async function runAcceptanceTests() {
  console.log('===============================================================');
  console.log('ACCEPTANCE CRITERIA AUTOMATED VERIFICATION');
  console.log('===============================================================\n');

  const token = await login();
  console.log('✓ Acquired Ministry auth token\n');
  const headers = { Authorization: `Bearer ${token}` };

  // Criterion 5: Simultaneous execution / No artificial blocking
  console.log('--- TEST 1: Simultaneous Execution & Independent Concurrency ---');
  const endpoints = [
    { name: 'KPIs', url: `${BASE_URL}/api/ministry/overview/kpis` },
    { name: 'Risk', url: `${BASE_URL}/api/ministry/overview/risk` },
    { name: 'States', url: `${BASE_URL}/api/ministry/overview/states` },
    { name: 'Urgent', url: `${BASE_URL}/api/ministry/overview/urgent` },
    { name: 'Alerts', url: `${BASE_URL}/api/ministry/overview/alerts` },
    { name: 'MP Leaderboard', url: `${BASE_URL}/api/ministry/mp-performance?limit=5` }
  ];

  const tStart = Date.now();
  const results = await Promise.all(
    endpoints.map(async (ep) => {
      const s = Date.now();
      const res = await fetch(ep.url, { headers });
      const duration = Date.now() - s;
      const data = await res.json();
      return { ...ep, status: res.status, duration, data };
    })
  );
  const wallClockTime = Date.now() - tStart;
  const sumTime = results.reduce((acc, r) => acc + r.duration, 0);

  console.log(`Wall clock time for all 6 requests: ${wallClockTime}ms`);
  console.log(`Sum of individual durations: ${sumTime}ms`);
  console.log(`Concurrency ratio: ${(sumTime / wallClockTime).toFixed(2)}x speedup`);
  for (const r of results) {
    console.log(`  - ${r.name.padEnd(15)}: HTTP ${r.status} (${r.duration}ms)`);
  }
  if (results.every(r => r.status === 200)) {
    console.log('✓ PASS: All 6 endpoints returned HTTP 200 in parallel!\n');
  } else {
    throw new Error('❌ FAIL: Some endpoints returned non-200');
  }

  // Criterion 6: Navbar Alert Bell Integration
  console.log('--- TEST 2: Navbar Alert Bell Integration ---');
  const alertRes = results.find(r => r.name === 'Alerts');
  if (Array.isArray(alertRes.data.recentAlerts) && alertRes.data.recentAlerts.length > 0) {
    console.log(`✓ PASS: getOverviewAlerts returned ${alertRes.data.recentAlerts.length} alerts for the top navbar alert bell!`);
    const sample = alertRes.data.recentAlerts[0];
    console.log(`  Top Alert Work: ${sample.workId} | Level: ${sample.riskLevel} | Score: ${sample.riskScore}`);
  } else {
    throw new Error('❌ FAIL: Alerts payload is empty or invalid');
  }

  // Criterion 7: Zero remaining callers of old getNationalOverviewMetrics
  console.log('\n--- TEST 3: Zero Remaining Callers of getNationalOverviewMetrics ---');
  function scanDir(dir, matches = []) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const f of files) {
      if (['node_modules', 'dist', 'build', '.git'].includes(f.name)) continue;
      const p = path.join(dir, f.name);
      if (f.isDirectory()) {
        scanDir(p, matches);
      } else if (['.js', '.jsx'].includes(path.extname(f.name))) {
        const content = fs.readFileSync(p, 'utf8');
        if (content.includes('getNationalOverviewMetrics')) {
          matches.push(p);
        }
      }
    }
    return matches;
  }

  const frontendSrc = path.join(process.cwd(), 'frontend', 'src');
  const foundCallers = scanDir(frontendSrc);
  if (foundCallers.length === 0) {
    console.log('✓ PASS: Zero occurrences of getNationalOverviewMetrics in frontend/src/!\n');
  } else {
    console.error('❌ FAIL: Found residual callers of getNationalOverviewMetrics:', foundCallers);
    throw new Error('Residual callers found');
  }

  console.log('===============================================================');
  console.log('ALL VERIFICATION CRITERIA CONFIRMED SUCCESSFULLY!');
  console.log('===============================================================');
}

runAcceptanceTests().catch(err => {
  console.error(err);
  process.exit(1);
});
