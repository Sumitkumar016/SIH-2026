const t0 = Date.now();
const res = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'ministry@mplads-sentinel.local', password: 'ministry123' })
});
const data = await res.json();
const token = data.token || data.data?.token;
const t1 = Date.now();
const mpRes = await fetch('http://localhost:5000/api/ministry/mp-performance', {
  headers: { Authorization: 'Bearer ' + token }
});
const t2 = Date.now();
console.log('HTTP Status:', mpRes.status);
console.log('Backend Response Time:', t2 - t1, 'ms');
const json = await mpRes.json();
console.log('Total MPs returned:', json.data?.length || json.length);
console.log('Top 1 MP:', json.top5?.[0]?.mpName || json.data?.[0]?.mpName);
