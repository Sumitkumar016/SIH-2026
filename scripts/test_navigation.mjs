import { prisma } from '../backend/src/config/db.js';

async function main() {
  const sampleWorks = await prisma.work.findMany({
    where: {
      work_id: { contains: '/' },
      current_risk_score: { risk_level: { in: ['High', 'Medium'] } },
      status: { not: 'Recommended' }
    },
    take: 6,
    select: {
      work_id: true,
      category: true,
      sanctioned_amount: true,
      current_risk_score: { select: { risk_score: true, risk_level: true } }
    }
  });
  console.log('--- 5+ REAL WORK IDS WITH SLASHES ---');
  for (const w of sampleWorks) {
    console.log(`Work ID: ${w.work_id} | Category: ${w.category} | Risk: ${w.current_risk_score?.risk_level} (${w.current_risk_score?.risk_score})`);
  }

  // Now test HTTP GET on the actual backend for each of these encoded work IDs
  const BASE_URL = 'http://localhost:5000';
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'ministry@mplads-sentinel.local', password: 'ministry123' }),
  });
  const body = await loginRes.json();
  const token = body.token || body.data?.token;

  console.log('\n--- VERIFYING HTTP 200 ON DETAIL ENDPOINT FOR EACH ID ---');
  for (const w of sampleWorks) {
    const encoded = encodeURIComponent(w.work_id);
    const res = await fetch(`${BASE_URL}/api/works/${encoded}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`GET /api/works/${encoded} -> HTTP ${res.status} (ok=${res.ok})`);
    if (res.ok) {
      const detail = await res.json();
      console.log(`  ✓ Returned workId: ${detail.workId}, status: ${detail.status}, amount: ₹${detail.sanctionedAmount}L`);
    } else {
      console.error(`  ❌ Failed to fetch ${w.work_id}`);
    }
  }

  await prisma.$disconnect();
}

main();
