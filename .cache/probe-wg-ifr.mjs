async (page) => {
  const fs = await import('node:fs/promises');
  const games = JSON.parse(
    await fs.readFile('/home/vananh/3t/.cache/wg-ifr-list.json', 'utf8')
  );
  const BAD =
    /taking a short break|no longer available|game unavailable|not available/i;
  const results = [];
  const CONCURRENCY = 6;
  let i = 0;

  async function worker() {
    while (i < games.length) {
      const idx = i++;
      const g = games[idx];
      const url = `https://play.wgplayground.com/ifr/${g.ifr}`;
      const p = await page.context().newPage();
      try {
        await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await p.waitForTimeout(900);
        const title = await p.title();
        let body = '';
        try {
          body = await p.innerText('body');
        } catch {}
        const snippet = body.replace(/\s+/g, ' ').slice(0, 200);
        const bad = BAD.test(title) || BAD.test(body);
        results.push({
          id: g.id,
          ifr: g.ifr,
          title,
          bad,
          final: p.url(),
          snippet,
        });
        console.log(`${bad ? 'BAD' : 'ok'}\t${g.id}\t${title.slice(0, 50)}`);
      } catch (e) {
        results.push({
          id: g.id,
          ifr: g.ifr,
          title: '',
          bad: true,
          error: String(e).slice(0, 180),
          final: url,
          snippet: '',
        });
        console.log(`ERR\t${g.id}\t${e}`);
      } finally {
        await p.close();
      }
      if (idx % 40 === 0) console.log(`progress ${idx}/${games.length}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await fs.writeFile(
    '/home/vananh/3t/.cache/wg-ifr-probe.json',
    JSON.stringify(results, null, 2)
  );
  const bad = results.filter((r) => r.bad);
  await fs.writeFile(
    '/home/vananh/3t/.cache/wg-ifr-broken.json',
    JSON.stringify(bad, null, 2)
  );
  return { total: results.length, bad: bad.length, brokenIds: bad.map((r) => r.id) };
}
