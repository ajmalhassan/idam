// Assemble already-built, locally reviewed release assets; never publish or send them.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const repo = resolve(root, '..');
const { version } = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('Expected numeric release version');
const name = `idam-new-tab-${version}.zip`;
const archive = join(root, name);
const manifest = JSON.parse(
  execFileSync('unzip', ['-p', archive, 'manifest.json'], { encoding: 'utf8' }),
);
if (manifest.version !== version)
  throw Error('Build/package this version before preparing the beta');
if (JSON.stringify(manifest.permissions) !== JSON.stringify(['storage', 'favicon']))
  throw Error('Review changed permissions before release');
const entries = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' }).trim().split('\n');
if (entries.some((name) => /^(review|src|tests|node_modules)\//.test(name)))
  throw Error('Development files in release archive');
execFileSync('unzip', ['-tq', archive], { stdio: 'inherit' });
const site = join(repo, 'site'),
  assets = join(site, 'assets');
for (const page of ['index.html', 'privacy.html']) {
  const html = await readFile(join(site, page), 'utf8');
  if (!html.includes(version)) throw Error(`${page} does not describe ${version}`);
  for (const [, url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (/^(https?:|mailto:)/.test(url) || url.startsWith('#') || url.endsWith('.zip')) continue;
    await readFile(
      join(site, url.split('#')[0].endsWith('/') ? url + 'index.html' : url.split('#')[0]),
    );
  }
}
const images = [
  ['home.png', 1280, 800],
  ['tiles.png', 1280, 800],
  ['notes.png', 1280, 800],
  ['setup.png', 1280, 800],
  ['promo-small.png', 440, 280],
  ['promo-marquee.png', 1400, 560],
];
for (const [file, w, h] of images) {
  const png = await readFile(join(assets, file));
  if (
    png.toString('hex', 0, 8) !== '89504e470d0a1a0a' ||
    png.readUInt32BE(16) !== w ||
    png.readUInt32BE(20) !== h
  )
    throw Error(`Wrong image dimensions: ${file}`);
}
const sha256 = createHash('sha256')
  .update(await readFile(archive))
  .digest('hex');
const bundleSha256 = createHash('sha256')
  .update(execFileSync('unzip', ['-p', archive, 'app.js']))
  .digest('hex');
const metadata = {
  version,
  filename: name,
  sha256,
  bundleSha256,
  preparedAt: new Date().toISOString(),
  sourceBase: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  sourceHasUncommittedChanges: Boolean(
    execFileSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' }).trim(),
  ),
  published: false,
};
await cp(archive, join(assets, 'idam-new-tab.zip'));
await writeFile(join(assets, 'release.json'), JSON.stringify(metadata, null, 2) + '\n');
const output = join(repo, 'releases', `idam-beta-${version}`);
await mkdir(output, { recursive: true });
await cp(archive, join(output, name));
await cp(join(repo, 'docs/beta'), join(output, 'guide'), { recursive: true });
await cp(site, join(output, 'site'), { recursive: true });
await mkdir(join(output, 'store-assets'), { recursive: true });
for (const [file] of images) await cp(join(assets, file), join(output, 'store-assets', file));
await cp(join(root, 'public/icons/icon-128.png'), join(output, 'store-assets/icon-128.png'));
await writeFile(join(output, 'release.json'), JSON.stringify(metadata, null, 2) + '\n');
await writeFile(join(output, 'SHA256SUMS'), `${sha256}  ${name}\n`);
const kit = output + '.zip';
await rm(kit, { force: true });
execFileSync('zip', ['-q', '-r', kit, '.'], { cwd: output });
execFileSync('unzip', ['-tq', kit], { stdio: 'inherit' });
console.log(JSON.stringify({ output, kit, ...metadata }, null, 2));
