// Render code-native brand graphics for the beta store submission kit.
import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const assets = fileURLToPath(new URL('../../site/assets/', import.meta.url));
await mkdir(assets, { recursive: true });
const logo = await readFile(new URL('../public/icon.svg', import.meta.url), 'utf8');
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, width, height] of [
    ['promo-small.png', 440, 280],
    ['promo-marquee.png', 1400, 560],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Idam — brand graphic</title><style>
      *{box-sizing:border-box}body{margin:0;background:#09090b;color:#f5f5f7;font-family:'Helvetica Neue',Arial,sans-serif;display:flex;min-height:100vh;padding:${width < 500 ? 30 : 66}px;flex-direction:column;justify-content:space-between;border-left:${width < 500 ? 8 : 16}px solid #006ac2}.brand{display:flex;align-items:center;gap:14px;font-size:${width < 500 ? 24 : 38}px;letter-spacing:3px}.brand svg{width:${width < 500 ? 40 : 68}px;height:auto}h1{font-size:${width < 500 ? 37 : 92}px;font-weight:300;line-height:1.03;letter-spacing:-1.5px;margin:0}p{color:#b7b7c3;font-size:${width < 500 ? 13 : 22}px;margin:0;letter-spacing:.15px}span{color:#62b7ff}
    </style><div class="brand">${logo}<b>idam</b></div><h1>Your space.<br><span>In the browser.</span></h1><p>A new tab for your places, tasks & notes.</p></html>`);
    await page.screenshot({ path: assets + name });
    await page.close();
    console.log(`Rendered ${name}: ${width}×${height}`);
  }
} finally {
  await browser.close();
}
