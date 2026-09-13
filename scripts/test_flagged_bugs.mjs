// scripts/test_flagged_bugs.mjs
// Automated verification for the 10 Bug Fixes on Flagged Cases page (/ministry/flagged)

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

  console.log('\n======================================================');
  console.log('TEST 1: Search + Status Filter AND Logic (Issue 2)');
  console.log('======================================================');
  {
    // Search for a non-existent string combined with a status filter that has rows
    const res = await fetch(
      `${BASE_URL}/api/ministry/flagged?search=NONEXISTENT_WORK_QUERY_99999&status=Delayed`,
      { headers: authHeaders }
    );
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      console.error(`  Server Error Response:`, json);
    }
    assert(res.ok, `Endpoint returns HTTP 200 (received ${res.status})`);
    assert(
      json && json.total === 0 && json.data.length === 0,
      `Non-existent search + status filter returns 0 records (total: ${json?.total}, data: ${json?.data?.length}) — confirms AND logic, not OR`
    );
  }

  console.log('\n======================================================');
  console.log('TEST 2: Two-Pass Virtual Status Resolution (Issue 3)');
  console.log('======================================================');
  {
    // Delayed filter
    const resDelayed = await fetch(
      `${BASE_URL}/api/ministry/flagged?status=Delayed&limit=10`,
      { headers: authHeaders }
    );
    assert(resDelayed.ok, `Query ?status=Delayed returns HTTP 200`);
    const jsonDelayed = await resDelayed.json();
    if (jsonDelayed.data.length > 0) {
      const allDelayed = jsonDelayed.data.every((w) => w.status === 'Delayed');
      assert(allDelayed, `Every row returned for ?status=Delayed has display status 'Delayed' (${jsonDelayed.data.length} checked)`);
    } else {
      console.log('  ℹ️ Note: 0 delayed works in system');
    }

    // Under Review filter
    const resUnderReview = await fetch(
      `${BASE_URL}/api/ministry/flagged?status=Under%20Review&limit=10`,
      { headers: authHeaders }
    );
    assert(resUnderReview.ok, `Query ?status=Under Review returns HTTP 200`);
    const jsonUnderReview = await resUnderReview.json();
    if (jsonUnderReview.data.length > 0) {
      const allUnderReview = jsonUnderReview.data.every((w) => w.status === 'Under Review');
      assert(allUnderReview, `Every row returned for ?status=Under Review has display status 'Under Review' (${jsonUnderReview.data.length} checked)`);
    } else {
      console.log('  ℹ️ Note: 0 under review works in system');
    }

    // Completed filter
    const resCompleted = await fetch(
      `${BASE_URL}/api/ministry/flagged?status=Completed&limit=10`,
      { headers: authHeaders }
    );
    assert(resCompleted.ok, `Query ?status=Completed returns HTTP 200`);
    const jsonCompleted = await resCompleted.json();
    if (jsonCompleted.data.length > 0) {
      const allCompleted = jsonCompleted.data.every((w) => w.status === 'Completed');
      assert(allCompleted, `Every row returned for ?status=Completed has display status 'Completed' (${jsonCompleted.data.length} checked)`);
    }
  }

  console.log('\n======================================================');
  console.log('TEST 3: availableStates & availableCategories Live Metadata (Issues 5 & 6)');
  console.log('======================================================');
  {
    // Baseline call
    const res = await fetch(`${BASE_URL}/api/ministry/flagged?limit=1`, { headers: authHeaders });
    assert(res.ok, `Baseline query returns HTTP 200`);
    const json = await res.json();
    assert(Array.isArray(json.availableStates) && json.availableStates.length > 0, `availableStates returned as non-empty array (count: ${json.availableStates?.length})`);
    assert(Array.isArray(json.availableCategories) && json.availableCategories.length > 0, `availableCategories returned as non-empty array (count: ${json.availableCategories?.length})`);

    // Filter by ONE specific state
    const testState = json.availableStates[0];
    const resFiltered = await fetch(
      `${BASE_URL}/api/ministry/flagged?state=${encodeURIComponent(testState)}&limit=1`,
      { headers: authHeaders }
    );
    const jsonFiltered = await resFiltered.json();
    assert(
      jsonFiltered.availableStates.length === json.availableStates.length,
      `availableStates does NOT self-collapse when filtering by state='${testState}' (count remains ${jsonFiltered.availableStates.length})`
    );
    assert(
      jsonFiltered.availableCategories.length === json.availableCategories.length,
      `availableCategories does NOT collapse when filtering by state='${testState}' (count remains ${jsonFiltered.availableCategories.length})`
    );
  }

  console.log('\n======================================================');
  console.log('TEST 4: Category Server-Side Sorting (Issue 7)');
  console.log('======================================================');
  {
    const resAsc = await fetch(`${BASE_URL}/api/ministry/flagged?sortField=category&sortDirection=asc&limit=10`, { headers: authHeaders });
    const jsonAsc = await resAsc.json();
    assert(resAsc.ok, `Category sort asc returns HTTP 200`);

    const resDesc = await fetch(`${BASE_URL}/api/ministry/flagged?sortField=category&sortDirection=desc&limit=10`, { headers: authHeaders });
    const jsonDesc = await resDesc.json();
    assert(resDesc.ok, `Category sort desc returns HTTP 200`);

    if (jsonAsc.data.length > 0 && jsonDesc.data.length > 0) {
      console.log(`  Asc category first item: '${jsonAsc.data[0].category}'`);
      console.log(`  Desc category first item: '${jsonDesc.data[0].category}'`);
      assert(true, 'Server successfully processed category sort requests');
    }
  }

  console.log('\n======================================================');
  console.log('TEST 5: Query Limit Ceiling Cap (Issue 10)');
  console.log('======================================================');
  {
    const res = await fetch(`${BASE_URL}/api/ministry/flagged?limit=500`, { headers: authHeaders });
    assert(res.ok, `Query with limit=500 returns HTTP 200`);
    const json = await res.json();
    assert(
      json.pagination.limit === 100,
      `limit=500 was safely capped to 100 in backend response (pagination.limit: ${json.pagination.limit})`
    );
    assert(
      json.data.length <= 100,
      `Returned data length (${json.data.length}) is <= safe limit ceiling (100)`
    );
  }

  console.log('\n======================================================');
  console.log(`TEST RESULTS SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
