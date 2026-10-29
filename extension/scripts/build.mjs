import { build } from 'esbuild';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('../public/', import.meta.url), output, { recursive: true });
await cp(
  new URL('../vendor/pane-ui-react/LICENSE', import.meta.url),
  new URL('PANE-LICENSE.txt', output),
);

const result = await build({
  absWorkingDir: root,
  entryPoints: ['src/app.jsx'],
  outdir: 'dist',
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'chrome120',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  metafile: true,
  legalComments: 'linked',
  logOverride: { 'different-path-case': 'error', 'import-is-undefined': 'error' },
});
await writeFile(
  new URL('../build-meta.json', import.meta.url),
  JSON.stringify(result.metafile, null, 2),
);

let html = await readFile(new URL('newtab.html', output), 'utf8');
for (const file of ['app.js', 'app.css']) {
  const data = await readFile(new URL(file, output));
  const fingerprint = createHash('sha256').update(data).digest('hex').slice(0, 12);
  html = html.replace(`"${file}"`, `"${file}?v=${fingerprint}"`);
  console.log(`${file}: ${data.length} bytes (${gzipSync(data).length} gzip)`);
}
await writeFile(new URL('newtab.html', output), html);
const manifest = JSON.parse(await readFile(new URL('manifest.json', output), 'utf8'));
manifest.version = pkg.version;
await writeFile(new URL('manifest.json', output), JSON.stringify(manifest, null, 2) + '\n');
