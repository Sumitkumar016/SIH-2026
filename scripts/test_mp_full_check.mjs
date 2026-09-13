const BASE_URL = 'http://localhost:5000';

async function run() {
  console.log('=== COMPREHENSIVE MP PERFORMANCE TEST SUITE ===\n');

  // Step 1: Login
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ministry@mplads-sentinel.local', password: 'ministry123' })
  });
  const { token } = await loginRes.json();
  const headers = { Authorization: `Bearer ${token}` };

  const tests = [
    { name: '1. Default page 1 (limit 15)', url: '/api/ministry/mp-performance?page=1&limit=15' },
    { name: '2. Page 2 (limit 15)', url: '/api/ministry/mp-performance?page=2&limit=15' },
    { name: '3. Search MP Name ("Kumar")', url: '/api/ministry/mp-performance?search=Kumar' },
    { name: '4. State Filter ("Bihar")', url: '/api/ministry/mp-performance?state=Bihar' },
    { name: '5. State Filter ("Maharashtra")', url: '/api/ministry/mp-performance?state=Maharashtra' },
    { name: '6. Utilization Range 0-25%', url: '/api/ministry/mp-performance?utilizationRange=0-25' },
    { name: '7. Utilization Range 75-100%', url: '/api/ministry/mp-performance?utilizationRange=75-100' },
    { name: '8. Utilization Range >100%', url: '/api/ministry/mp-performance?utilizationRange=>100' },
    { name: '9. Completion Range 75-100%', url: '/api/ministry/mp-performance?completionRange=75-100' },
    { name: '10. Sort totalWorks DESC', url: '/api/ministry/mp-performance?sortField=totalWorks&sortDirection=desc' },
    { name: '11. Sort completionRate ASC', url: '/api/ministry/mp-performance?sortField=completionRate&sortDirection=asc' },
    { name: '12. Sort mpName ASC', url: '/api/ministry/mp-performance?sortField=mpName&sortDirection=asc' },
    { name: '13. Sort totalSanctionedAmount DESC', url: '/api/ministry/mp-performance?sortField=totalSanctionedAmount&sortDirection=desc' },
    { name: '14. Sort totalExpenditure DESC', url: '/api/ministry/mp-performance?sortField=totalExpenditure&sortDirection=desc' },
  ];

  let allPassed = true;
  for (const t of tests) {
    const res = await fetch(`${BASE_URL}${t.url}`, { headers });
    if (!res.ok) {
      console.error(`FAILED: ${t.name} -> HTTP ${res.status}`);
      allPassed = false;
      continue;
    }
    const json = await res.json();
    const count = json.data?.length;
    const total = json.pagination?.total;
    const totalPages = json.pagination?.totalPages;
    console.log(`PASS: ${t.name} -> returned ${count} items (total: ${total}, pages: ${totalPages})`);

    // Verify first item schema
    if (json.data && json.data.length > 0) {
      const first = json.data[0];
      if (!first.mpName || first.state === undefined || first.fundUtilization === undefined) {
        console.error(`Schema error on ${t.name}:`, first);
        allPassed = false;
      }
    }
  }

  // Check top 5 and bottom 5 metadata
  const metaRes = await fetch(`${BASE_URL}/api/ministry/mp-performance`, { headers });
  const metaJson = await metaRes.json();
  console.log(`\nMetadata check:`);
  console.log(`- Available States: ${metaJson.availableStates?.length}`);
  console.log(`- Available Districts: ${metaJson.availableDistricts?.length}`);
  console.log(`- Top 5 Leaders: ${metaJson.top5?.length} records`);
  console.log(`- Bottom 5 Leaders: ${metaJson.bottom5?.length} records`);

  if (!metaJson.top5 || metaJson.top5.length === 0 || !metaJson.bottom5 || metaJson.bottom5.length === 0) {
    console.error('Metadata missing top5 or bottom5!');
    allPassed = false;
  }

  console.log(`\nOverall Test Result: ${allPassed ? 'ALL PASSED' : 'SOME TESTS FAILED'}`);
}

run().catch(console.error);
