import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

test('built page loads bundled assets using their content fingerprints', async () => {
  const root = new URL('../', import.meta.url);
  execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'pipe' });
  const html = await readFile(new URL('dist/newtab.html', root), 'utf8');
  const assets = [...html.matchAll(/(?:src|href)="(app\.(?:js|css)[^"]*)"/g)];
  assert.equal(assets.length, 2);
  for (const [, reference] of assets) {
    const url = new URL(reference, 'https://extension.invalid/');
    const content = await readFile(new URL('dist' + url.pathname, root));
    const fingerprint = createHash('sha256').update(content).digest('hex').slice(0, 12);
    assert.equal(url.searchParams.get('v'), fingerprint);
  }
  const manifest = JSON.parse(await readFile(new URL('dist/manifest.json', root), 'utf8'));
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  assert.equal(manifest.version, pkg.version);
  assert.deepEqual(manifest.permissions, ['storage', 'favicon']);
  // Installation and extension-management surfaces use manifest icons, not the page favicon.
  for (const size of [16, 32, 48, 128]) {
    const iconPath = manifest.icons?.[size];
    assert.ok(iconPath, `Missing ${size}px extension icon`);
    const icon = await readFile(new URL(`dist/${iconPath}`, root));
    assert.deepEqual(icon.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    assert.equal(icon.toString('ascii', 12, 16), 'IHDR');
    assert.equal(icon.readUInt32BE(16), size);
    assert.equal(icon.readUInt32BE(20), size);
  }
});
