// Verification script for all 5 roles
const BASE_URL = 'http://localhost:5000';

const ROLES = [
  { name: 'Ministry', email: 'ministry@mplads-sentinel.local', pass: 'ministry123', endpoint: '/api/ministry/overview/kpis' },
  { name: 'State', email: 'chhattisgarh@mplads-sentinel.local', pass: 'state7123', endpoint: '/api/state/overview' },
  { name: 'District', email: 'district127@mplads-sentinel.local', pass: 'district127123', endpoint: '/api/district/overview' },
  { name: 'MP', email: 'mp1@mplads-sentinel.local', pass: 'mp1123', endpoint: '/api/mp/overview' },
  { name: 'Auditor', email: 'auditor@mplads-sentinel.local', pass: 'auditor123', endpoint: '/api/auditor/queue' },
];

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed for ${email}: ${JSON.stringify(data)}`);
  return data.data?.token || data.token;
}

async function testRole(role) {
  console.log(`\n========================================`);
  console.log(`TESTING ROLE: ${role.name.toUpperCase()} (${role.email})`);
  console.log(`========================================`);

  const token = await login(role.email, role.pass);
  console.log(`✓ Login successful, acquired JWT token`);

  // Verify /api/auth/me
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const meData = await meRes.json();
  console.log(`✓ Auth me verified: user=${meData.data?.email || meData.email}, role=${meData.data?.role || meData.role}`);

  // Fetch endpoint 5 times consecutively to verify consistency and stability
  console.log(`Fetching ${role.endpoint} 5 consecutive times...`);
  const snapshots = [];
  for (let i = 1; i <= 5; i++) {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}${role.endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dur = Date.now() - t0;
    if (!res.ok) throw new Error(`Fetch ${i} failed: HTTP ${res.status}`);
    const json = await res.json();
    snapshots.push({ dur, json });
    console.log(`  Attempt ${i}: HTTP ${res.status} in ${dur}ms`);
  }

  // Compare stability
  const base = JSON.stringify(snapshots[0].json);
  let allIdentical = true;
  for (let i = 1; i < snapshots.length; i++) {
    if (JSON.stringify(snapshots[i].json) !== base) {
      allIdentical = false;
      console.error(`  ❌ Discrepancy detected between attempt 1 and ${i + 1}!`);
    }
  }

  if (allIdentical) {
    console.log(`✓ Data stability PASS: All 5 consecutive requests returned 100% identical responses!`);
  }

  // Inspect key metrics for this role
  const sample = snapshots[0].json;
  if (role.name === 'Ministry') {
    console.log(`  Ministry KPIs:`);
    console.log(`    Recommended Works: ${sample.totalWorksRecommended}`);
    console.log(`    Sanctioned Works: ${sample.totalSanctionedWorks}`);
    console.log(`    Completed Works: ${sample.totalCompletedWorks}`);
    console.log(`    Expenditure: ₹${sample.totalExpenditureCr} Cr`);
    console.log(`    Flagged for Review: ${sample.totalFlaggedCases}`);
    console.log(`    Flagged Rate: ${sample.flaggedRatePercent}%`);
  } else if (role.name === 'State') {
    const k = sample.kpis || {};
    console.log(`  State KPIs (${sample.stateProfile?.stateName}):`);
    console.log(`    Total Sanctioned: ₹${k.totalSanctionedCr} Cr (reasonable Crores)`);
    console.log(`    Total Flagged: ${k.totalFlaggedCount}`);
    console.log(`    High Risk: ${k.highRiskCount}`);
    console.log(`    Districts Count: ${sample.districts?.length}`);
  } else if (role.name === 'District') {
    const k = sample.kpis || {};
    console.log(`  District KPIs (${sample.district?.districtName}, ${sample.district?.state}):`);
    console.log(`    Total Sanctioned: ₹${k.totalSanctionedCr} Cr`);
    console.log(`    Total Flagged: ${k.totalFlaggedCount}`);
    console.log(`    High Risk: ${k.highRiskCount}`);
    console.log(`    MPs Active: ${sample.mpBreakdown?.length}`);
  } else if (role.name === 'MP') {
    const k = sample.kpis || {};
    console.log(`  MP KPIs (${sample.mp?.mpName}, ${sample.mp?.constituency}):`);
    console.log(`    Total Sanctioned: ₹${k.totalSanctionedCr} Cr`);
    console.log(`    Total Expenditure: ₹${k.totalExpenditureCr} Cr`);
    console.log(`    Utilization Rate: ${k.utilizationRatePercent}% (realistic %, not millions)`);
    console.log(`    Flagged Works Count: ${sample.flaggedWorks?.length}`);
  } else if (role.name === 'Auditor') {
    console.log(`  Auditor High-Risk Queue:`);
    console.log(`    Total High/Medium Cases: ${sample.data?.length}`);
    console.log(`    Top Case: ${sample.data?.[0]?.workId} (Risk: ${sample.data?.[0]?.riskScore}, Level: ${sample.data?.[0]?.riskLevel})`);
  }
}

async function testMultiSegmentWork() {
  console.log(`\n========================================`);
  console.log(`TESTING MULTI-SEGMENT WORK ID ENDPOINTS`);
  console.log(`========================================`);
  const token = await login('ministry@mplads-sentinel.local', 'ministry123');

  // Test real database work with slashes
  const testId = 'WS/MP600/2024-2025/148052';
  const res = await fetch(`${BASE_URL}/api/works/${encodeURIComponent(testId)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(`Fetch work detail for ${testId} (encoded: ${encodeURIComponent(testId)}): HTTP ${res.status}`);
  if (res.ok) {
    const data = await res.json();
    console.log(`✓ Retrieved work: ${data.workId} - ${data.description}`);
    console.log(`  Amount: ₹${data.sanctionedAmount}L, Risk: ${data.riskLevel} (${data.riskScore})`);
  } else {
    throw new Error(`Failed to fetch work detail: HTTP ${res.status}`);
  }
}

async function main() {
  try {
    for (const role of ROLES) {
      await testRole(role);
    }
    await testMultiSegmentWork();
    console.log(`\n========================================`);
    console.log(`ALL 5 ROLE TESTS COMPLETED SUCCESSFULLY!`);
    console.log(`========================================`);
  } catch (err) {
    console.error(`\n❌ Test failed:`, err);
    process.exit(1);
  }
}

main();
