// Isolated installed-extension checks. Never opens or reuses a personal profile.
// Usage: npm run check:browser -- [--capture] [--baseline /path/to/old/dist]
// Optional IDAM_BROWSER_EXECUTABLE selects a Chromium-compatible executable.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('../', import.meta.url));
const repo = resolve(root, '..');
const capture = process.argv.includes('--capture');
const baselineIndex = process.argv.indexOf('--baseline');
const baseline = baselineIndex < 0 ? null : resolve(process.argv[baselineIndex + 1]);
const work = await mkdtemp(join(tmpdir(), 'idam-beta-check-'));
const installed = join(work, 'extension');
const output = resolve(repo, '.local/beta');
await mkdir(output, { recursive: true });
await cp(baseline || join(root, 'dist'), installed, { recursive: true });
const context = await chromium.launchPersistentContext(join(work, 'profile'), {
  ...(process.env.IDAM_BROWSER_EXECUTABLE
    ? { executablePath: process.env.IDAM_BROWSER_EXECUTABLE }
    : { channel: 'chromium' }),
  headless: true,
  ignoreDefaultArgs: ['--disable-extensions'],
  args: ['--enable-unsafe-extension-debugging'],
  viewport: { width: 1280, height: 800 },
  timezoneId: 'Asia/Kolkata',
  colorScheme: 'light',
  reducedMotion: 'reduce',
});
const report = {
  date: new Date().toISOString(),
  browser: context.browser().version(),
  platform: process.platform,
  checks: [],
  timings: [],
  bundleSha256: createHash('sha256')
    .update(await readFile(join(root, 'dist/app.js')))
    .digest('hex'),
};
const pass = (check) => {
  report.checks.push(check);
  console.log('PASS', check);
};
try {
  const cdp = await context.browser().newBrowserCDPSession();
  const { id } = await cdp.send('Extensions.loadUnpacked', { path: installed });
  const url = `chrome-extension://${id}/newtab.html`;
  let page = await context.newPage();
  const errors = [];
  context.on('page', (p) => p.on('pageerror', (e) => errors.push(e.message)));
  page.on('pageerror', (e) => errors.push(e.message));
  const coldStart = performance.now();
  await page.goto(url);
  await page.getByRole('button', { name: 'Begin', exact: true }).waitFor();
  report.version = await page.evaluate(() => chrome.runtime.getManifest().version);
  report.initialSetupTiming = {
    version: report.version,
    readyMs: Math.round(performance.now() - coldStart),
    reducedMotion: true,
  };
  assert.deepEqual(await page.evaluate(() => chrome.runtime.getManifest().permissions), [
    'storage',
    'favicon',
  ]);
  if (baseline) {
    await page.evaluate(() =>
      chrome.storage.local.set({
        'metro.v1.onboarded': true,
        'metro.v1.settings': {
          name: 'Upgrade check',
          accent: 'teal',
          search: 'bing',
          showTasks: true,
          showNotes: true,
        },
        'metro.v1.notes': 'Preserve across extension update',
        'metro.v1.task.upgrade': {
          id: 'upgrade',
          text: 'Existing task',
          done: true,
          createdAt: 100,
        },
      }),
    );
    const before = await page.evaluate(() => chrome.storage.local.get(null));
    await cp(join(root, 'dist'), installed, { recursive: true });
    // Reload the unpacked installation at the same path, retaining its identity/storage.
    const updated = await cdp.send('Extensions.loadUnpacked', { path: installed });
    assert.equal(updated.id, id);
    page = await context.newPage();
    // Runtime reload briefly unregisters the extension URL before loading the new build.
    for (let attempt = 0; ; attempt++) {
      try {
        await page.goto(url);
        break;
      } catch (error) {
        if (attempt >= 30 || !error.message.includes('ERR_BLOCKED_BY_CLIENT')) throw error;
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    await page.getByRole('heading', { name: /Upgrade check/ }).waitFor();
    assert.deepEqual(await page.evaluate(() => chrome.storage.local.get(null)), before);
    report.upgradedFrom = report.version;
    report.version = await page.evaluate(() => chrome.runtime.getManifest().version);
    assert.notEqual(report.version, report.upgradedFrom);
    pass('Installed extension update preserves all saved records and bypasses onboarding');
    await page.evaluate(() => chrome.storage.local.clear());
    await page.reload();
  }
  await page.getByRole('button', { name: 'Begin', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Mira');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByRole('heading', { name: 'familiar places.' }).waitFor();
  await page.getByRole('button', { name: 'Open my start page' }).click();
  await page.getByRole('heading', { name: /Mira/ }).waitFor();
  assert.equal(
    await page.evaluate(() =>
      chrome.storage.local.get('metro.v1.onboarded').then((x) => x['metro.v1.onboarded']),
    ),
    true,
  );
  pass('Fresh install completes onboarding using chrome.storage.local');
  const newtab = await context.newPage();
  await newtab.goto('chrome://newtab');
  await newtab.getByRole('heading', { name: /Mira/ }).waitFor();
  await newtab.close();
  pass('Native new-tab override opens Idam');
  const input = page.getByRole('textbox', { name: 'New task', exact: true });
  await input.fill('First task');
  await input.press('Enter');
  await page.getByRole('checkbox', { name: 'First task', exact: true }).waitFor();
  await page.waitForFunction(
    () => document.activeElement?.getAttribute('aria-label') === 'New task',
  );
  await page.keyboard.type('next task');
  assert.equal(await input.inputValue(), 'next task');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await input.press('Enter');
  await page.getByRole('checkbox', { name: 'next task', exact: true }).waitFor();
  pass('Task creation retains typing focus; n does not accidentally open notes');
  await page.getByRole('button', { name: 'add a shortcut', exact: true }).click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('New place');
  await page.getByRole('textbox', { name: 'Website', exact: true }).fill('example.com');
  await page.evaluate(() => {
    window.originalSet = chrome.storage.local.set.bind(chrome.storage.local);
    chrome.storage.local.set = async (values) => {
      await new Promise((r) => setTimeout(r, 500));
      return window.originalSet(values);
    };
  });
  await page.getByRole('button', { name: 'Save shortcut', exact: true }).click();
  for (const name of ['Name', 'Website'])
    assert.equal(await page.getByRole('textbox', { name, exact: true }).isDisabled(), true);
  for (const name of ['Tile color', 'Tile size'])
    assert.equal(await page.getByRole('combobox', { name, exact: true }).isDisabled(), true);
  await page.locator('dialog[open]').waitFor({ state: 'hidden' });
  await page.evaluate(() => {
    chrome.storage.local.set = window.originalSet;
    delete window.originalSet;
  });
  pass('Shortcut controls reject edits while a slow save is pending');
  // Discard the instrumented JavaScript realm before testing unrelated persistence.
  await page.reload();
  await page.getByRole('heading', { name: /Mira/ }).waitFor();
  await page.getByRole('button', { name: 'Open notes', exact: true }).click();
  await page
    .getByRole('textbox', { name: 'Scratchpad', exact: true })
    .fill('Keep this note offline.');
  await page.getByRole('button', { name: 'Back to home', exact: true }).click();
  for (let attempt = 0; ; attempt++) {
    const notes = await page.evaluate(() => chrome.storage.local.get('metro.v1.notes'));
    if (notes['metro.v1.notes'] === 'Keep this note offline.') break;
    assert.ok(attempt < 50, `Note did not save: ${JSON.stringify(notes)}`);
    await new Promise((r) => setTimeout(r, 100));
  }
  await context.setOffline(true);
  await page.reload();
  await page.getByRole('checkbox', { name: 'next task', exact: true }).waitFor();
  await page
    .getByRole('button', { name: 'Open notes', exact: true })
    .filter({ hasText: 'Keep this note offline.' })
    .waitFor();
  await input.fill('Offline task');
  await input.press('Enter');
  await page.getByRole('checkbox', { name: 'Offline task', exact: true }).waitFor();
  await page.reload();
  await page.getByRole('checkbox', { name: 'Offline task', exact: true }).waitFor();
  pass('Installed page and saved tasks/notes work offline and persist after reload');
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Personalize', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export backup', exact: true }).click();
  const download = await downloadEvent;
  const backup = JSON.parse(await readFile(await download.path(), 'utf8'));
  assert.equal(backup.workspace.notes, 'Keep this note offline.');
  backup.workspace.notes = 'Restored beta note';
  const stale = await context.newPage();
  await stale.goto(url);
  await stale.getByRole('heading', { name: /Mira/ }).waitFor();
  await page.locator('input[type=file]').setInputFiles({
    name: 'beta-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(backup)),
  });
  await page.getByRole('heading', { name: 'Review your restore', exact: true }).waitFor();
  assert.equal(
    await page.getByRole('button', { name: 'Replace workspace', exact: true }).isDisabled(),
    true,
  );
  await page
    .getByRole('checkbox', { name: 'I understand this replaces my current workspace', exact: true })
    .check();
  await page.getByRole('button', { name: 'Replace workspace', exact: true }).click();
  await page
    .getByRole('button', { name: 'Open notes', exact: true })
    .filter({ hasText: 'Restored beta note' })
    .waitFor();
  await stale.getByRole('heading', { name: 'Your workspace was restored', exact: true }).waitFor();
  assert.equal(
    await page.evaluate(() =>
      chrome.storage.local
        .get('idam.recovery.v1')
        .then((x) => x['idam.recovery.v1'].workspace.notes),
    ),
    'Keep this note offline.',
  );
  await stale.close();
  pass('Native export/import requires confirmation, retains recovery, blocks stale tabs');
  // Demo data are fictional and stored only in this disposable profile.
  await page.evaluate(async () => {
    await chrome.storage.local.clear();
    const today = new Date(),
      date = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
      ].join('-');
    const data = {
      'metro.v1.schema': 2,
      'metro.v1.initialized': true,
      'metro.v1.onboarded': true,
      'metro.v1.settings': {
        name: 'Mira',
        accent: 'blue',
        search: 'duckduckgo',
        showTasks: true,
        showNotes: true,
      },
      'metro.v1.notes':
        'A little room to think.\n\nIdeas for the weekend:\n• Walk somewhere new\n• Make time for a good book\n• Leave the laptop at home',
      ['metro.v1.priority.' + date]: {
        date,
        text: 'Make room for the work that matters.',
        done: false,
      },
    };
    [
      ['mail', 'Gmail', 'https://mail.google.com/', 'wide'],
      ['github', 'GitHub', 'https://github.com/', 'small'],
      ['calendar', 'Calendar', 'https://calendar.google.com/', 'small'],
      ['drive', 'Drive', 'https://drive.google.com/', 'small'],
      ['figma', 'Figma', 'https://www.figma.com/', 'small'],
      ['music', 'Music', 'https://open.spotify.com/', 'wide'],
    ].forEach(
      ([id, title, url, size], order) =>
        (data['metro.v1.shortcut.' + id] = { id, title, url, size, tone: 'blue', order, icon: '' }),
    );
    ['Review the first draft', 'Send the project update', 'Take a proper lunch break'].forEach(
      (text, i) =>
        (data['metro.v1.task.demo' + i] = {
          id: 'demo' + i,
          text,
          done: i === 0,
          createdAt: i + 1,
        }),
    );
    await chrome.storage.local.set(data);
  });
  await page.reload();
  await page.getByRole('heading', { name: /Mira/ }).waitFor();
  await page.getByRole('button', { name: 'edit tiles', exact: true }).click();
  await page
    .getByRole('link', { name: 'Gmail', exact: true })
    .dragTo(page.getByRole('link', { name: 'Music', exact: true }));
  await page.getByRole('status').filter({ hasText: 'Tile order saved.' }).waitFor();
  assert.notEqual(await page.locator('.shortcut').first().getAttribute('aria-label'), 'Gmail');
  await page.reload();
  await page.getByRole('heading', { name: /Mira/ }).waitFor();
  assert.notEqual(await page.locator('.shortcut').first().getAttribute('aria-label'), 'Gmail');
  pass('Native drag persists across reload without navigation');
  for (const width of [320, 800, 1040, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `overflow at ${width}`,
    );
  }
  pass('No horizontal overflow at 320, 800, 1040 and 1280px under light OS preference');
  const colors = await page.locator('.priority').evaluate((el) => ({
    bg: getComputedStyle(el).backgroundColor,
    fg: getComputedStyle(el).color,
    root: getComputedStyle(document.documentElement).backgroundColor,
  }));
  assert.equal(colors.bg, 'rgb(0, 106, 194)');
  assert.equal(colors.root, 'rgb(9, 9, 11)');
  assert.equal(
    await page.evaluate(() => document.getAnimations().some((a) => a.playState === 'running')),
    false,
  );
  pass('Darker blue token applies, dark page persists, reduced motion has no running animations');
  for (let i = 0; i < 5; i++) {
    const start = performance.now();
    await page.reload();
    await page.locator('.shortcut-grid a').first().waitFor();
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );
    report.timings.push({
      readyMs: Math.round(performance.now() - start),
      ...(await page.evaluate(() => ({
        domContentLoadedMs: Math.round(
          performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
        ),
        fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
      }))),
    });
  }
  // Force external icon requests to fail, exercising the permission-backed local fallback.
  await context.route(/^https?:\/\//, (route) => route.abort());
  await page.reload();
  await page.waitForFunction(() => {
    const icons = [...document.querySelectorAll('.site-icon')];
    return icons.length === 6 && icons.every((image) => image.src.includes('/_favicon/'));
  });
  pass('Native favicon endpoint resolves after external icon sources are blocked');
  await context.unroute(/^https?:\/\//);
  if (capture) {
    const assets = resolve(repo, 'site/assets');
    await mkdir(assets, { recursive: true });
    // Reset demo tile order for consistent product imagery.
    await page.evaluate(async () => {
      const keys = ['mail', 'github', 'calendar', 'drive', 'figma', 'music'];
      const raw = await chrome.storage.local.get(null);
      await chrome.storage.local.set(
        Object.fromEntries(
          keys.map((id, order) => [
            'metro.v1.shortcut.' + id,
            { ...raw['metro.v1.shortcut.' + id], order },
          ]),
        ),
      );
    });
    await page.reload();
    await page.locator('.shortcut-grid a').first().waitFor();
    await page
      .waitForFunction(
        () => document.querySelectorAll('.site-icon').length >= 6,
        {},
        { timeout: 12000 },
      )
      .catch(() => {});
    await page.screenshot({ path: join(assets, 'home.png') });
    await page.getByRole('button', { name: 'edit tiles', exact: true }).click();
    await page.screenshot({ path: join(assets, 'tiles.png') });
    await page.getByRole('button', { name: 'done', exact: true }).click();
    await page.getByRole('button', { name: 'Open notes', exact: true }).click();
    await page.screenshot({ path: join(assets, 'notes.png') });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Personalize', exact: true }).click();
    const demo = await page.evaluate(() => chrome.storage.local.get(null));
    const { createBackup } = await import('../src/backup.js');
    await page.locator('input[type=file]').setInputFiles({
      name: 'idam-demo-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(createBackup(demo))),
    });
    await page.getByRole('heading', { name: 'Review your restore', exact: true }).waitFor();
    await page.locator('dialog[open]').evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.screenshot({ path: join(assets, 'backup.png') });
    await page.getByRole('button', { name: 'Cancel restore', exact: true }).click();
    await page.getByRole('button', { name: 'Revisit setup', exact: true }).click();
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.getByRole('heading', { name: 'familiar places.' }).waitFor();
    await page.screenshot({ path: join(assets, 'setup.png') });
    pass('Captured actual 1280×800 product screenshots with fictional data');
  }
  assert.deepEqual(errors, []);
  pass('No JavaScript page errors');
  report.result = 'PASS';
} catch (error) {
  report.result = 'FAIL';
  report.error = error.stack;
  throw error;
} finally {
  const name = process.env.IDAM_BROWSER_EXECUTABLE?.includes('Google Chrome')
    ? 'chrome'
    : 'chromium';
  await writeFile(
    join(output, `${name}-browser-report.json`),
    JSON.stringify(report, null, 2) + '\n',
  );
  await context.close();
}
