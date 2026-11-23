// UI sweep: every tab, every subject, a short quiz in every area, label placement, Peek, Map toggles, phone + laptop.
const { chromium } = require('playwright');
const SHOTS = process.env.SHOTS ?? '/tmp/';
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' }, args: ['--ignore-certificate-errors'] });
  const problems = [];
  for (const [name, vp] of [['desk', { width: 1280, height: 800 }], ['phone', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp });
    page.on('pageerror', e => problems.push(`${name} PAGE ERROR: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error' && !/429|Failed to load resource/.test(m.text())) problems.push(`${name} console: ${m.text().slice(0, 160)}`); });
    await page.goto(process.env.URL ?? 'http://localhost:4173/');
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('geoquest:v1', JSON.stringify({ v: 1, cards: {}, active: [], xp: 0, days: {}, updates: [], quizBest: {}, settings: { sound: false, locks: false, mapMode: 'flip', mapContext: true } })); });
    await page.reload(); await page.click('text=Start'); await page.waitForTimeout(900);
    // Tabs
    for (const t of ['Today', 'Library', 'Quiz', 'Map', 'Atlas', 'Dashboard']) { await page.click(`.tabs >> text=${t}`); await page.waitForTimeout(700); }
    // Library: every subject opens, has content
    await page.click('.tabs >> text=Library'); await page.waitForTimeout(300);
    const subjects = await page.$$eval('.subject-card b', e => e.map(x => x.textContent));
    for (const s of subjects) {
      if (s === 'Dashboard') continue;
      await page.click('.tabs >> text=Library'); await page.waitForTimeout(200);
      await page.locator('.subject-card', { hasText: s }).first().click(); await page.waitForTimeout(300);
      // Geography's sections start closed until you're learning something in them: open the first one.
      if (!(await page.$('.skill'))) { await page.locator('.section-row').first().click().catch(() => {}); await page.waitForTimeout(300); }
      const skills = await page.$$eval('.skill', e => e.length);
      if (!skills) problems.push(`${name} Library "${s}": no skills shown`);
    }
    // Quiz: every subject × every area at the first level, 4 cards each
    await page.click('.tabs >> text=Quiz'); await page.waitForTimeout(300);
    const qsubs = await page.$$eval('.subjects .subject span', e => e.map(x => x.textContent));
    let quizzes = 0, cards = 0, labelChecks = 0;
    for (const qs of qsubs) {
      await page.click('.tabs >> text=Quiz'); await page.waitForTimeout(200);
      await page.locator('.subjects .subject', { hasText: new RegExp('^' + qs.replace(/[&()]/g, '.') + '$') }).first().click(); await page.waitForTimeout(250);
      const areas = (await page.$$eval('.quiz-step:nth-of-type(2) .pick', e => e.map(x => x.textContent))).slice(0, name === 'desk' ? 8 : 3);
      for (const a of areas.length ? areas : [null]) {
        await page.click('.tabs >> text=Quiz'); await page.waitForTimeout(150);
        await page.locator('.subjects .subject', { hasText: new RegExp('^' + qs.replace(/[&()]/g, '.') + '$') }).first().click(); await page.waitForTimeout(150);
        if (a) { const l = page.locator('.quiz-step:nth-of-type(2) .pick', { hasText: a }); if (await l.count()) await l.first().click(); await page.waitForTimeout(150); }
        const bar = await page.$('.quiz-bar button'); if (!bar) { problems.push(`${name} Quiz ${qs} › ${a}: no start button`); continue; }
        if (await bar.isDisabled()) continue;
        await bar.click(); await page.waitForTimeout(900); quizzes++;
        for (let i = 0; i < 4; i++) {
          if (!(await page.$('.card'))) break;
          const txt = (await page.textContent('.card')).replace(/\s+/g, ' ');
          if (/undefined|NaN|\[object|null\b/.test(txt)) problems.push(`${name} BAD TEXT ${qs} › ${a}: ${txt.slice(0, 140)}`);
          await page.keyboard.press('Space'); await page.waitForTimeout(500); cards++;
          const after = (await page.textContent('.card')).replace(/\s+/g, ' ');
          if (/undefined|NaN|\[object/.test(after)) problems.push(`${name} BAD ANSWER ${qs} › ${a}: ${after.slice(0, 160)}`);
          // every context label must sit inside its own shape
          const bad = await page.evaluate(() => {
            const out = []; let n = 0;
            for (const t of document.querySelectorAll('.study-map .ctxlabel')) {
              const x = +t.getAttribute('x'), y = +t.getAttribute('y');
              const paths = [...document.querySelectorAll('.study-map path')].filter(p => p.getAttribute('data-name') === t.textContent);
              n++;
              if (paths.length && !paths.some(p => p.isPointInFill(new DOMPoint(x, y)))) out.push(t.textContent);
            }
            return { n, out };
          });
          labelChecks += bad.n;
          if (bad.out.length) problems.push(`${name} LABEL OUTSIDE ITS SHAPE (${qs} › ${a}): ${bad.out.slice(0, 8).join(', ')}`);
          await page.keyboard.press('3'); await page.waitForTimeout(200);
        }
        // Peek on a map card
        const pk = await page.$('text=Peek');
        if (pk) { await pk.click(); await page.waitForTimeout(1200); await page.click('text=Back to the cards'); await page.waitForTimeout(200); }
        await page.click('[aria-label="End session"]', { timeout: 1500 }).catch(() => page.click('text=Done', { timeout: 1500 }).catch(() => {}));
      }
    }
    // Map tab: every layer on
    await page.click('.tabs >> text=Map'); await page.waitForTimeout(500);
    for (const l of await page.$$('.map-layers button, .layer-toggles button, .chips button')) { await l.click().catch(() => {}); await page.waitForTimeout(80); }
    await page.waitForTimeout(1500); await page.screenshot({ path: SHOTS + `sweep-${name}-map.png` });
    console.log(name, `${subjects.length} subjects, ${quizzes} quizzes, ${cards} cards, ${labelChecks} label checks`);
    await page.close();
  }
  console.log(problems.length ? problems.join('\n') : 'NO PROBLEMS');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
