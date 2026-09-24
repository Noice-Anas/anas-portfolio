const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { parse } = require('node-html-parser');
const routes = require('../assets/js/routes');
const dicts = require('../assets/js/i18n-data');
const fs = require('node:fs');

test.beforeEach(async ({ page }) => { await page.route('https://cloud.umami.is/**', route => route.abort()); });
const active = page => page.locator('article.active');
async function settle(page) { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(100); }
async function openAtPosition(page, selector) {
  const link = page.locator(selector);
  await link.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 140, behavior: 'instant' }));
  await settle(page);
  const scroll = await page.evaluate(() => scrollY);
  await link.click();
  return scroll;
}

test('Back, Forward, reload and project return preserve category, position and focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects/'); await settle(page);
  await page.locator('[data-filter="web"]').click();
  const selector = '.portfolio [data-project-open="project-saleh"]';
  await openAtPosition(page, selector);
  await expect(active(page)).toHaveAttribute('data-page', 'project-saleh');
  await expect(page).toHaveURL(/projects\/saleh\/$/);
  await page.goBack();
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
  await expect(page.locator('[data-filter="web"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(selector)).toBeFocused();
  const returnedCard = await page.locator(selector).boundingBox();
  expect(returnedCard.y).toBeGreaterThanOrEqual(0);
  expect(returnedCard.y).toBeLessThan(844);
  await page.goForward(); await expect(active(page)).toHaveAttribute('data-page', 'project-saleh');
  await page.reload(); await settle(page);
  await page.locator('article.active [data-project-back]').click();
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
  await expect(page.locator(selector)).toBeInViewport();
  await page.reload(); await settle(page);
  await expect(page.locator('[data-filter="web"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(selector)).toBeInViewport();
});

test('Home project returns to home; language changes preserve the originating entry', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/'); await settle(page);
  const selector = '.about [data-project-open="project-turathiyat"]';
  const scroll = await openAtPosition(page, selector);
  await page.locator('[data-lang-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.locator('article.active [data-project-back]').click();
  await expect(active(page)).toHaveAttribute('data-page', 'about');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(scroll, 0);
  await expect(page.locator(selector)).toBeFocused();
});

test('Skills link to matching work and the filter survives a project visit', async ({ page }) => {
  await page.goto('/skills/');
  await page.locator('[data-skill-tech="Swift"]').click();
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
  await expect(page.locator('.project-item.active')).toHaveCount(2);
  await page.locator('.portfolio [data-project-open="project-mykarage"]').click();
  await page.keyboard.press('Escape');
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
  await expect(page.locator('.project-item.active')).toHaveCount(2);
  await page.locator('[data-tech-clear]').click();
  await expect(page.locator('.project-item.active')).toHaveCount(12);
  await expect(page).not.toHaveURL(/tech=/);
});

test('Direct links, legacy links, formal variant and storage-denied browsing work', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage denied'); } }); });
  await page.goto('/?page=project-jamaatna&lang=ar&formal');
  await expect(active(page)).toHaveAttribute('data-page', 'project-jamaatna');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('[data-page="resume"]')).toHaveCount(0);
  await page.locator('article.active [data-project-back]').click();
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
  await expect(page).toHaveURL(/formal/);
  await page.goto('/#skills'); await expect(active(page)).toHaveAttribute('data-page', 'skills');
});

test('Screenshot dialog owns Escape, traps focus and restores its trigger', async ({ page }) => {
  await page.goto('/projects/jamaatna/');
  const img = page.locator('article.active .pd-hero img');
  await img.click(); await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.lb-next')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(active(page)).toHaveAttribute('data-page', 'project-jamaatna');
  await expect(img).toBeFocused();
});

for (const lang of ['en', 'ar']) {
  test(`All ${lang} routes contain indexable, localized HTML without JavaScript`, async ({ browser, request }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const [key, route] of Object.entries(routes)) {
      const response = await request.get('/' + route[lang]); expect(response.ok()).toBeTruthy();
      const root = parse(await response.text());
      expect(root.querySelector('html').getAttribute('lang')).toBe(lang);
      expect(root.querySelector('article.active').getAttribute('data-page')).toBe(key);
      expect(root.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://noiceanas.com/' + route[lang]);
      expect(root.querySelector('meta[http-equiv="refresh"]')).toBeNull();
      expect(root.querySelector('meta[name="robots"]')?.getAttribute('content') || '').not.toContain('noindex');
      expect(root.querySelector('meta[name="description"]').getAttribute('content')).toBe(dicts[lang][route.description]);
      const schema = JSON.parse(root.querySelector('script[type="application/ld+json"]').textContent);
      expect(schema['@graph'].find(el => el['@id'].endsWith('#page')).inLanguage).toBe(lang);
      for (const node of root.querySelectorAll('[data-i18n]')) expect(node.textContent).toBe(dicts[lang][node.getAttribute('data-i18n')]);
      await page.goto('http://127.0.0.1:8765/' + route[lang]);
      await expect(page.locator('article.active h1')).toBeVisible();
      expect(await page.locator('article.active').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    }
    await context.close();
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`${lang} layouts fit ${width}px on every route`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      for (const [key, route] of Object.entries(routes)) {
        await page.goto('/' + route[lang]); await settle(page);
        await expect(active(page)).toHaveAttribute('data-page', key);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
        expect(await page.locator('.navbar').evaluate(el => el.getBoundingClientRect().width)).toBeLessThanOrEqual(width);
        const minTarget = await page.locator('.navbar-link').evaluateAll(els => Math.min(...els.map(el => el.getBoundingClientRect().height)));
        expect(minTarget).toBeGreaterThanOrEqual(44);
      }
      expect(errors).toEqual([]);
    });
  }
  test(`${lang} pages pass automated WCAG AA checks`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of Object.values(routes)) {
      await page.goto('/' + route[lang]); await settle(page);
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([]);
    }
  });
}

test('Deployment contains public pages and a complete bilingual sitemap', () => {
  for (const file of ['ignored', 'node_modules', '.git', 'tests', 'CLAUDE.md']) expect(fs.existsSync('_site/' + file)).toBe(false);
  const sitemap = fs.readFileSync('_site/sitemap.xml', 'utf8');
  for (const route of Object.values(routes)) for (const lang of ['en','ar']) expect(sitemap).toContain('<loc>https://noiceanas.com/' + route[lang] + '</loc>');
});

test('Same-tab links report analytics without Umami taking over the click', async ({ page }) => {
  // Umami's own [data-umami-event] handler cancels an anchor's click, waits for
  // its network request and only then restores the navigation — a ~700ms stall
  // per tap. Same-tab links must therefore carry data-track-event instead, which
  // script.js reports on pointerdown while leaving the click completely native.
  const blocked = [];
  for (const file of ['_site/index.html', '_site/portfolio-pricing/index.html', '_site/working-with-me/index.html']) {
    for (const anchor of parse(fs.readFileSync(file, 'utf8')).querySelectorAll('a[data-umami-event]')) {
      if (anchor.getAttribute('target') !== '_blank') blocked.push(file + ': ' + anchor.getAttribute('data-umami-event'));
    }
  }
  expect(blocked).toEqual([]);

  await page.addInitScript(() => {
    window.umami = { track: (name, props) => {
      const hits = JSON.parse(sessionStorage.getItem('hits') || '[]');
      sessionStorage.setItem('hits', JSON.stringify(hits.concat([[name, props]])));
    } };
  });
  const hits = () => page.evaluate(() => { const h = sessionStorage.getItem('hits'); sessionStorage.removeItem('hits'); return JSON.parse(h || '[]'); });
  await page.goto('/'); await settle(page);
  await page.locator('.navbar [data-nav-link][data-target="projects"]').click();
  await expect(page).toHaveURL(/\/projects\/$/);
  expect(await hits()).toEqual([['nav-projects', {}]]);
  await page.goto('/'); await settle(page);
  await page.locator('.about [data-project-open="project-turathiyat"]').click();
  await expect(page).toHaveURL(/\/projects\/turathiyat\/$/);
  expect(await hits()).toEqual([['project-open', { project: 'Turathiyat' }]]);
});

test('The formal variant survives navigation and never re-exposes Resume', async ({ page }) => {
  // Generated pages navigate with their own href, so ?formal only holds if every
  // in-site link carries it forward; /resume/?formal has no article left to show.
  await page.goto('/resume/?formal');
  await expect(page).toHaveURL(/^[^?]+\/\?formal/);
  await expect(active(page)).toHaveAttribute('data-page', 'about');
  for (const target of ['skills', 'projects', 'contact']) {
    await page.locator(`.navbar [data-nav-link][data-target="${target}"]`).click();
    await expect(active(page)).toHaveAttribute('data-page', target);
    await expect(page).toHaveURL(/formal/);
    await expect(page.locator('[data-nav-link][data-target="resume"]')).toHaveCount(0);
    await expect(page.locator('html')).toHaveClass(/is-formal/);
  }
  await page.locator('[data-lang-toggle]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page).toHaveURL(/formal/);
  await expect(page.locator('[data-nav-link][data-target="resume"]')).toHaveCount(0);
});

test('The ar/ stub and legacy hash links resolve to real pages', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page).toHaveURL(/index-ar\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await page.goto('/#projects');
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
  // A project reached through a redirect has no history behind it: "back" must
  // land on /projects/, not on the blank entry location.replace() left behind.
  await page.goto('/?page=project-jamaatna');
  await expect(page).toHaveURL(/\/projects\/jamaatna\/$/);
  await page.locator('article.active [data-project-back]').click();
  await expect(page).toHaveURL(/\/projects\/$/);
  await expect(active(page)).toHaveAttribute('data-page', 'projects');
});

test('A stale cached redirect stub cannot trap the page in a loop', async ({ page }) => {
  // /skills/ used to be a stub redirecting to /?page=skills and is now a real
  // page. A browser holding the old stub serves it from cache without a network
  // request, so it bounces forever: /?page=skills → cached stub → /?page=skills.
  // script.js counts redirect hops and gives up rather than ping-pong.
  await page.route('**/skills/', route => route.fulfill({
    status: 200, contentType: 'text/html',
    body: '<html><head><script>location.replace("../?page=skills")</script></head><body>stub</body></html>',
  }));
  let navigations = 0;
  page.on('request', request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) navigations++;
  });
  await page.goto('/');
  await page.locator('.navbar [data-nav-link][data-target="skills"]').click().catch(() => {});
  await page.waitForTimeout(5000);
  expect(navigations).toBeLessThan(12);
  expect(new URL(page.url()).search).toBe('');       // the legacy params are cleared
  await expect(active(page)).toHaveAttribute('data-page', 'about');

  // The guard resets, so a legitimate legacy link still resolves in one hop.
  await page.unroute('**/skills/');
  await page.goto('/?page=skills');
  await expect(page).toHaveURL(/\/skills\/$/);
  await expect(active(page)).toHaveAttribute('data-page', 'skills');
});
