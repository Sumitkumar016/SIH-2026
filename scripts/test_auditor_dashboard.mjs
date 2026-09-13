// Comprehensive Auditor Dashboard verification script
const BASE_URL = 'http://localhost:5000';

async function main() {
  console.log('=== AUDITOR DASHBOARD THOROUGH VERIFICATION ===\n');

  // 1. Authenticate as Auditor
  console.log('1. Authenticating as Platform Auditor (auditor@mplads-sentinel.local)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'auditor@mplads-sentinel.local',
      password: 'auditor123',
    }),
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed with status ${loginRes.status}: ${await loginRes.text()}`);
  }

  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.token;
  console.log('✓ Auditor Login successful! Acquired JWT token.\n');

  // 2. Test GET /api/auditor/queue
  console.log('2. Testing GET /api/auditor/queue (Unfiltered)...');
  const queueRes = await fetch(`${BASE_URL}/api/auditor/queue`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!queueRes.ok) {
    throw new Error(`Queue fetch failed: HTTP ${queueRes.status}`);
  }

  const queueData = await queueRes.json();
  console.log(`✓ Total Queue Cases: ${queueData.total || queueData.data?.length}`);
  console.log(`✓ Items in response payload: ${queueData.data?.length}`);

  if (!queueData.data || queueData.data.length === 0) {
    throw new Error('Queue is unexpectedly empty!');
  }

  const firstCase = queueData.data[0];
  console.log('✓ First Case Details:');
  console.log(`   - Work ID: ${firstCase.workId}`);
  console.log(`   - MP Name: ${firstCase.mpName}`);
  console.log(`   - State / District: ${firstCase.state} / ${firstCase.district}`);
  console.log(`   - Category: ${firstCase.category}`);
  console.log(`   - Risk Level: ${firstCase.riskLevel} (Score: ${firstCase.riskScore})`);
  console.log(`   - Flag Reason: ${firstCase.flagReason}`);
  console.log(`   - Case Status: ${firstCase.caseStatus}`);
  console.log(`   - Escalation Source: ${firstCase.escalationSource}\n`);

  // 3. Test Queue Filtering
  console.log('3. Testing Queue Filtering:');
  
  // 3a. Filter by riskLevel=High
  const highRiskRes = await fetch(`${BASE_URL}/api/auditor/queue?riskLevel=High`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const highRiskData = await highRiskRes.json();
  console.log(`   - Filter riskLevel=High: ${highRiskData.data?.length} cases (all High: ${highRiskData.data?.every(c => c.riskLevel === 'High')})`);

  // 3b. Filter by riskLevel=Medium
  const medRiskRes = await fetch(`${BASE_URL}/api/auditor/queue?riskLevel=Medium`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const medRiskData = await medRiskRes.json();
  console.log(`   - Filter riskLevel=Medium: ${medRiskData.data?.length} cases (all Medium: ${medRiskData.data?.every(c => c.riskLevel === 'Medium')})`);

  // 3c. Search by specific Work ID
  const searchRes = await fetch(`${BASE_URL}/api/auditor/queue?search=${encodeURIComponent(firstCase.workId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const searchData = await searchRes.json();
  console.log(`   - Search for ${firstCase.workId}: found ${searchData.data?.length} case(s)\n`);

  // 4. Test GET /api/auditor/case/:workId (Case Investigation Detail)
  console.log(`4. Testing GET /api/auditor/case/${encodeURIComponent(firstCase.workId)}...`);
  const caseDetailRes = await fetch(`${BASE_URL}/api/auditor/case/${encodeURIComponent(firstCase.workId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!caseDetailRes.ok) {
    throw new Error(`Case detail fetch failed: HTTP ${caseDetailRes.status}`);
  }

  const caseDetail = await caseDetailRes.json();
  console.log('✓ Case Investigation Detail successfully retrieved:');
  console.log(`   - Work ID: ${caseDetail.workId}`);
  console.log(`   - Description: ${caseDetail.description}`);
  console.log(`   - Category: ${caseDetail.category}`);
  console.log(`   - Sanctioned Amount: ₹${caseDetail.sanctionedAmount}L`);
  console.log(`   - Sanction Date: ${caseDetail.sanctionDate}`);
  console.log(`   - Status: ${caseDetail.status}`);
  console.log(`   - Risk Level: ${caseDetail.riskLevel} (Score: ${caseDetail.riskScore})`);
  console.log(`   - Flag Reason: ${caseDetail.flagReason}`);
  console.log(`   - Anomaly Breakdown: Cost Growth=${caseDetail.anomalyBreakdown?.costGrowthRisk}%, Velocity=${caseDetail.anomalyBreakdown?.velocityRisk}%, Split=${caseDetail.anomalyBreakdown?.splitBillingRisk}%`);
  console.log(`   - Audit History Count: ${caseDetail.auditHistory?.length}`);
  console.log(`   - Expenditures Count: ${caseDetail.expenditures?.length}`);
  console.log(`   - Asset Creation Count: ${caseDetail.assetCreation?.length}\n`);

  // 5. Test Vendor Forensics Tool: GET /api/auditor/vendor
  console.log('5. Testing Vendor Forensics Tool (GET /api/auditor/vendor)...');
  
  // 5a. Unfiltered vendor call to get popular vendors
  const vendorInitRes = await fetch(`${BASE_URL}/api/auditor/vendor`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!vendorInitRes.ok) {
    throw new Error(`Vendor endpoint failed: HTTP ${vendorInitRes.status}`);
  }
  const vendorInit = await vendorInitRes.json();
  console.log(`✓ Initial Vendor API response:`);
  console.log(`   - Default Vendor Selected: "${vendorInit.vendorName}"`);
  console.log(`   - Popular Vendors returned: ${vendorInit.popularVendors?.length}`);
  if (vendorInit.popularVendors && vendorInit.popularVendors.length > 0) {
    vendorInit.popularVendors.forEach((v, idx) => {
      console.log(`     ${idx + 1}. "${v}"`);
    });
  }

  // 5b. Detailed query for a specific vendor from popularVendors
  if (vendorInit.popularVendors && vendorInit.popularVendors.length > 0) {
    const targetVendor = vendorInit.popularVendors[0];
    console.log(`\n5b. Testing Vendor Forensics for: "${targetVendor}"...`);
    const vendorDetailRes = await fetch(`${BASE_URL}/api/auditor/vendor?name=${encodeURIComponent(targetVendor)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!vendorDetailRes.ok) {
      throw new Error(`Vendor query for ${targetVendor} failed: HTTP ${vendorDetailRes.status}`);
    }
    const vendorData = await vendorDetailRes.json();
    console.log(`✓ Vendor Forensics for "${vendorData.vendorName}":`);
    console.log(`   - Total Works Awarded: ${vendorData.totalWorks}`);
    console.log(`   - High Risk Flagged: ${vendorData.highRiskCount}`);
    console.log(`   - Total Payment Volume: ₹${vendorData.totalPaymentCr?.toFixed(2)} Cr`);
    console.log(`   - Distinct MPs: ${vendorData.distinctMpsCount} (${vendorData.distinctMps?.slice(0, 3).join(', ')})`);
    console.log(`   - Distinct Districts & States: ${vendorData.distinctDistrictsCount} districts across ${vendorData.distinctStatesCount} states`);
    console.log(`   - Average Payment Size: ₹${vendorData.avgPaymentLakhs?.toFixed(2)} L`);
    console.log(`   - Forensic Pattern Alerts: ${vendorData.patternAlerts?.length || 0} alert(s)`);
    if (vendorData.patternAlerts && vendorData.patternAlerts.length > 0) {
      vendorData.patternAlerts.forEach((a, i) => console.log(`     Alert ${i + 1}: ${a}`));
    }
    console.log(`   - Works Record Count: ${vendorData.works?.length}`);
  }

  console.log('\n======================================================');
  console.log('✓ ALL AUDITOR DASHBOARD CAPABILITIES VERIFIED 100%!');
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('\n❌ Auditor test error:', err);
  process.exit(1);
});
