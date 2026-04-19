import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1800, height: 6000, deviceScaleFactor: 3 });

  const htmlPath = path.join(__dirname, 'carousel-discovery-commerce.html');
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });

  // Wait for fonts and images to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 4000));

  // Get all slides by class .s
  const slides = await page.$$('.s');
  console.log(`Found ${slides.length} slides total`);

  // Slides 0-7 = Light (8 slides), 8-15 = Dark (8 slides)
  const themes = [
    { name: 'light', start: 0, count: 8 },
    { name: 'dark', start: 8, count: 8 },
  ];

  let success = 0;

  for (const theme of themes) {
    const outDir = path.join(__dirname, theme.name);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    for (let i = 0; i < theme.count; i++) {
      const slideIdx = theme.start + i;
      const slide = slides[slideIdx];
      if (!slide) {
        console.log(`⚠ Slide ${slideIdx} not found`);
        continue;
      }

      const box = await slide.boundingBox();
      if (!box) {
        console.log(`⚠ Slide ${slideIdx} has no bounding box`);
        continue;
      }

      const filename = `${String(i + 1).padStart(2, '0')}.png`;
      const outPath = path.join(outDir, filename);

      await page.screenshot({
        path: outPath,
        clip: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        },
        type: 'png',
      });

      console.log(`✓ ${theme.name}/${filename}`);
      success++;
    }
  }

  await browser.close();
  console.log(`\nDone: ${success} slides exported`);
}

main().catch(console.error);
