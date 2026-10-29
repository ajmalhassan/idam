import { execFileSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('Expected a numeric extension version');
const archive = fileURLToPath(new URL(`idam-new-tab-${version}.zip`, root));
execFileSync(process.execPath, [fileURLToPath(new URL('build.mjs', import.meta.url))], {
  stdio: 'inherit',
});
await rm(archive, { force: true });
execFileSync('zip', ['-q', '-r', archive, '.'], { cwd: new URL('dist/', root) });
execFileSync('unzip', ['-tq', archive], { stdio: 'inherit' });
console.log(`Packaged ${archive}`);
