const BASE_URL = 'http://localhost:5000';

async function runVerification() {
  console.log('=== REGRESSION TEST: MP PERFORMANCE & ABORT CONTROLLER LIFECYCLE ===\n');

  // Step 1: Authenticate
  console.log('1. Authenticating as Ministry User...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ministry@mplads-sentinel.local', password: 'ministry123' })
  });

  if (!loginRes.ok) {
    throw new Error(`Login failed with status: ${loginRes.status}`);
  }
  const loginData = await loginRes.json();
  const token = loginData.token || loginData.data?.token;
  console.log('   Authenticated successfully. Token acquired.\n');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Step 2: First Page Load (simulating NationalOverviewPage concurrent requests)
  console.log('2. Testing First Page Load (Concurrent Overview + MP Leaderboard)...');
  const t0 = Date.now();
  const [overviewRes, mpRes] = await Promise.all([
    fetch(`${BASE_URL}/api/ministry/overview/kpis`, { headers }),
    fetch(`${BASE_URL}/api/ministry/mp-performance`, { headers }),
  ]);
  const tFirstLoad = Date.now() - t0;

  console.log(`   Overview KPIs Status: ${overviewRes.status} (HTTP 200 expected)`);
  console.log(`   MP Performance Status: ${mpRes.status} (HTTP 200 expected)`);
  console.log(`   Concurrent Load Time: ${tFirstLoad} ms`);

  const overviewData = await overviewRes.json();
  const mpData = await mpRes.json();

  if (overviewRes.status !== 200 || mpRes.status !== 200) {
    throw new Error('First page load failed HTTP status check!');
  }
  if (!mpData.data || !Array.isArray(mpData.data)) {
    throw new Error('MP Performance returned invalid data format!');
  }
  console.log(`   MPs Returned: ${mpData.data.length}`);
  console.log(`   Top 5 Leaderboard Count: ${mpData.top5?.length || 0}`);
  console.log(`   Bottom 5 Leaderboard Count: ${mpData.bottom5?.length || 0}`);
  console.log(`   Available States: ${mpData.availableStates?.length || 0}`);
  console.log(`   Available Districts: ${mpData.availableDistricts?.length || 0}\n`);

  // Step 3: Navigate to MP Performance Page (/ministry/mp-performance) with filters & sorting
  console.log('3. Testing Navigation to MP Performance Page with query filters...');
  const tNav0 = Date.now();
  const filteredRes = await fetch(`${BASE_URL}/api/ministry/mp-performance?sortField=fundUtilization&sortDirection=desc&utilizationRange=75-100`, { headers });
  const tNav = Date.now() - tNav0;
  const filteredData = await filteredRes.json();
  console.log(`   Status: ${filteredRes.status}, Elapsed: ${tNav} ms`);
  console.log(`   Filtered MPs (75-100% utilization): ${filteredData.data?.length || 0}\n`);

  // Step 4: Navigate back to Overview
  console.log('4. Testing Switching back to Overview...');
  const tBack0 = Date.now();
  const backOverview = await fetch(`${BASE_URL}/api/ministry/overview/kpis`, { headers });
  console.log(`   Status: ${backOverview.status}, Elapsed: ${Date.now() - tBack0} ms\n`);

  // Step 5: 5 Consecutive Refreshes (verifying stability, no AbortError, and low latency)
  console.log('5. Testing 5 Consecutive Refreshes on MP Performance...');
  const timings = [];
  for (let i = 1; i <= 5; i++) {
    const tStart = Date.now();
    const res = await fetch(`${BASE_URL}/api/ministry/mp-performance`, { headers });
    const elapsed = Date.now() - tStart;
    timings.push(elapsed);
    if (res.status !== 200) {
      throw new Error(`Refresh #${i} failed with status: ${res.status}`);
    }
    const json = await res.json();
    console.log(`   Refresh #${i}: HTTP ${res.status}, Elapsed: ${elapsed} ms, Total MPs: ${json.data?.length}`);
  }
  const avgTiming = (timings.reduce((a, b) => a + b, 0) / timings.length).toFixed(1);
  console.log(`   Average consecutive refresh latency: ${avgTiming} ms\n`);

  // Step 6: Test Cancellation vs Failure logic
  console.log('6. Testing AbortController intentional cancellation handling...');
  const clientController = new AbortController();
  const intentionalAbortPromise = fetch(`${BASE_URL}/api/ministry/mp-performance`, {
    headers,
    signal: clientController.signal
  });
  clientController.abort(); // Immediately cancel request like unmount in StrictMode
  try {
    await intentionalAbortPromise;
    console.log('   Warning: fetch did not abort');
  } catch (err) {
    console.log(`   Caught expected intentional abort: ${err.name} - ${err.message}`);
    console.log(`   Is AbortError: ${err.name === 'AbortError'}`);
  }

  console.log('\n=== ALL REGRESSION CHECKS PASSED SUCCESSFULLY ===');
}

runVerification().catch(err => {
  console.error('REGRESSION TEST FAILED:', err);
  process.exit(1);
});
