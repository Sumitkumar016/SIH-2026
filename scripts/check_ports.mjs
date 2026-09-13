async function check() {
  for (const port of [3000, 3001, 5000]) {
    try {
      const res = await fetch(`http://localhost:${port}`);
      console.log(`Port ${port}: status ${res.status}`);
    } catch (err) {
      console.log(`Port ${port}: error ${err.message}`);
    }
  }
}
check();
