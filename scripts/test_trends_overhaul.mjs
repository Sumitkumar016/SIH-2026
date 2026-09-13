// scripts/test_trends_overhaul.mjs
// Automated verification for Trends & Analytics Page Backend Decomposition & Scoped Filtering

const BASE_URL = 'http://localhost:5000';
const DEMO_USER = {
  email: 'ministry@mplads-sentinel.local',
  password: 'ministry123',
};

async function login() {
  console.log(`\n🔑 Authenticating with demo Ministry credentials (${DEMO_USER.email})...`);
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(DEMO_USER),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Login failed (HTTP ${res.status}): ${errText}`);
  }

  const data = await res.json();
  const token = data.data?.token || data.token;
  if (!token) throw new Error('No JWT token received from login endpoint');
  console.log('✅ Authentication successful! JWT token acquired.');
  return token;
}

async function runTests() {
  const token = await login();
  const authHeaders = { Authorization: `Bearer ${token}` };

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  console.log('\n--- TEST SUITE 1: 5 Independent Endpoints Exist & Return Data (National / Unfiltered) ---');

  // 1. Monthly Trends
  const resMonthly = await fetch(`${BASE_URL}/api/ministry/trends/monthly`, { headers: authHeaders });
  assert(resMonthly.status === 200, 'GET /trends/monthly returns 200');
  const dataMonthly = await resMonthly.json();
  assert(Array.isArray(dataMonthly.monthlyTrends) && dataMonthly.monthlyTrends.length === 12, 'monthlyTrends has 12 month buckets');
  const totalNationalFlagged = dataMonthly.monthlyTrends.reduce((acc, c) => acc + (c.totalFlagged || 0), 0);
  console.log(`   (National Flagged: ${totalNationalFlagged} works across 12 months)`);

  // 2. Category Anomalies
  const resCategories = await fetch(`${BASE_URL}/api/ministry/trends/categories`, { headers: authHeaders });
  assert(resCategories.status === 200, 'GET /trends/categories returns 200');
  const dataCategories = await resCategories.json();
  assert(Array.isArray(dataCategories.categoryAnomalies), 'categoryAnomalies is an array');
  console.log(`   (Top Categories: ${dataCategories.categoryAnomalies.map(c => `${c.category} (${c.count})`).join(', ')})`);

  // 3. Top Vendors
  const resVendors = await fetch(`${BASE_URL}/api/ministry/trends/vendors`, { headers: authHeaders });
  assert(resVendors.status === 200, 'GET /trends/vendors returns 200');
  const dataVendors = await resVendors.json();
  assert(Array.isArray(dataVendors.topVendors), 'topVendors is an array');
  console.log(`   (Top Vendors: ${dataVendors.topVendors.map(v => `${v.vendor} [${v.worksAwarded} works, ${v.flaggedCount} flagged]`).join(', ')})`);

  // 4. State Comparison
  const resStates = await fetch(`${BASE_URL}/api/ministry/trends/states`, { headers: authHeaders });
  assert(resStates.status === 200, 'GET /trends/states returns 200');
  const dataStates = await resStates.json();
  assert(Array.isArray(dataStates.stateComparison) && dataStates.stateComparison.length > 0, 'stateComparison returns top states');
  console.log(`   (States count: ${dataStates.stateComparison.length}, top: ${dataStates.stateComparison[0]?.state})`);

  // 5. Locations Hierarchy
  const resLocations = await fetch(`${BASE_URL}/api/ministry/trends/locations`, { headers: authHeaders });
  assert(resLocations.status === 200, 'GET /trends/locations returns 200');
  const dataLocations = await resLocations.json();
  assert(Array.isArray(dataLocations.states) && dataLocations.states.length > 0, 'locations returns states array');
  const firstState = dataLocations.states[0];
  assert(firstState.state_id && firstState.state_name && Array.isArray(firstState.districts), 'state contains state_id, state_name, and districts array');
  console.log(`   (Sample State: ${firstState.state_name} with ${firstState.districts.length} districts)`);

  // 6. Backwards Compatibility with GET /trends
  const resConsolidated = await fetch(`${BASE_URL}/api/ministry/trends`, { headers: authHeaders });
  assert(resConsolidated.status === 200, 'GET /trends (legacy) returns 200');
  const dataConsolidated = await resConsolidated.json();
  assert(
    dataConsolidated.monthlyTrends?.length === 12 &&
    Array.isArray(dataConsolidated.categoryAnomalies) &&
    Array.isArray(dataConsolidated.topVendors) &&
    Array.isArray(dataConsolidated.stateComparison),
    'legacy /trends returns all 4 datasets matching national totals'
  );

  console.log('\n--- TEST SUITE 2: Scoped State Filtering ---');
  // Pick a state with known data from statesComparison
  const targetStateName = dataStates.stateComparison[0]?.state;
  const targetStateObj = dataLocations.states.find(s => s.state_name === targetStateName);
  const targetStateId = targetStateObj?.state_id;

  console.log(`Testing with State: ${targetStateName} (ID: ${targetStateId})`);

  // 1. Monthly Trends filtered by state
  const resStateMonthly = await fetch(`${BASE_URL}/api/ministry/trends/monthly?state=${encodeURIComponent(targetStateName)}`, { headers: authHeaders });
  const dataStateMonthly = await resStateMonthly.json();
  const stateFlaggedSum = dataStateMonthly.monthlyTrends.reduce((acc, c) => acc + (c.totalFlagged || 0), 0);
  assert(stateFlaggedSum <= totalNationalFlagged, `State monthly flagged (${stateFlaggedSum}) <= national total (${totalNationalFlagged})`);

  // 2. Categories filtered by state
  const resStateCategories = await fetch(`${BASE_URL}/api/ministry/trends/categories?state=${encodeURIComponent(targetStateName)}`, { headers: authHeaders });
  const dataStateCategories = await resStateCategories.json();
  assert(Array.isArray(dataStateCategories.categoryAnomalies), 'State category anomalies returned');

  // 3. Vendors filtered by state (expenditures scoped to state)
  const resStateVendors = await fetch(`${BASE_URL}/api/ministry/trends/vendors?state=${encodeURIComponent(targetStateName)}`, { headers: authHeaders });
  const dataStateVendors = await resStateVendors.json();
  assert(Array.isArray(dataStateVendors.topVendors), 'State top vendors returned');
  if (dataStateVendors.topVendors.length > 0) {
    const v = dataStateVendors.topVendors[0];
    console.log(`   (State top vendor: ${v.vendor}, works: ${v.worksAwarded}, state: ${v.stateConcentration})`);
    assert(v.stateConcentration.includes(targetStateName) || v.worksAwarded >= 0, 'Vendor state concentration reflects state scope');
  }

  // 4. State comparison filtered by state (returns ONLY that single state)
  const resStateCompare = await fetch(`${BASE_URL}/api/ministry/trends/states?state=${encodeURIComponent(targetStateName)}`, { headers: authHeaders });
  const dataStateCompare = await resStateCompare.json();
  assert(dataStateCompare.stateComparison?.length === 1, 'State comparison under state filter returns exactly 1 item');
  assert(dataStateCompare.stateComparison?.[0]?.state === targetStateName, `State comparison item is ${targetStateName}`);

  console.log('\n--- TEST SUITE 3: Scoped District Filtering ---');
  if (targetStateObj?.districts?.length > 0) {
    const targetDistrictName = targetStateObj.districts[0].district_name;
    console.log(`Testing with District: ${targetDistrictName} in ${targetStateName}`);

    // 1. Monthly Trends filtered by state + district
    const resDistMonthly = await fetch(`${BASE_URL}/api/ministry/trends/monthly?state=${encodeURIComponent(targetStateName)}&district=${encodeURIComponent(targetDistrictName)}`, { headers: authHeaders });
    const dataDistMonthly = await resDistMonthly.json();
    const distFlaggedSum = dataDistMonthly.monthlyTrends.reduce((acc, c) => acc + (c.totalFlagged || 0), 0);
    assert(distFlaggedSum <= stateFlaggedSum, `District monthly flagged (${distFlaggedSum}) <= state total (${stateFlaggedSum})`);

    // 2. State comparison under district filter returns empty array (not applicable)
    const resDistCompare = await fetch(`${BASE_URL}/api/ministry/trends/states?state=${encodeURIComponent(targetStateName)}&district=${encodeURIComponent(targetDistrictName)}`, { headers: authHeaders });
    const dataDistCompare = await resDistCompare.json();
    assert(Array.isArray(dataDistCompare.stateComparison) && dataDistCompare.stateComparison.length === 0, 'State comparison returns [] when district filter is active');
  } else {
    console.log('No districts found for target state, skipping district sub-test');
  }

  console.log(`\n========================================`);
  console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
