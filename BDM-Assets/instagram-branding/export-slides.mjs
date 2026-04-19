import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SLIDE_IDS = [];
const carousels = [
  { prefix: 'c1', name: 'c1-discovery', slides: 8 },
  { prefix: 'c2', name: 'c2-agentic', slides: 8 },
  { prefix: 'c3', name: 'c3-naver', slides: 8 },
];
const themes = ['l', 'd'];
const themeNames = { l: 'light', d: 'dark' };

for (const c of carousels) {
  for (const t of themes) {
    for (let i = 1; i <= c.slides; i++) {
      SLIDE_IDS.push({
        id: `${c.prefix}-${t}-${i}`,
        folder: `${c.name}-${themeNames[t]}`,
        file: `${String(i).padStart(2, '0')}.png`,
      });
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 3 });

  const htmlPath = path.join(__dirname, 'carousel-final-export.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 2000));

  let success = 0;
  let fail = 0;

  for (const slide of SLIDE_IDS) {
    try {
      const el = await page.$(`#${slide.id}`);
      if (!el) {
        console.log(`⚠ Not found: #${slide.id}`);
        fail++;
        continue;
      }
      const box = await el.boundingBox();
      const outPath = path.join(__dirname, 'slides', slide.folder, slide.file);
      await page.screenshot({
        path: outPath,
        clip: { x: box.x, y: box.y, width: 360, height: 450 },
        type: 'png',
      });
      console.log(`✓ ${slide.folder}/${slide.file}`);
      success++;
    } catch (e) {
      console.log(`✗ ${slide.id}: ${e.message}`);
      fail++;
    }
  }

  await browser.close();
  console.log(`\nDone: ${success} exported, ${fail} failed`);
}

main().catch(console.error);
