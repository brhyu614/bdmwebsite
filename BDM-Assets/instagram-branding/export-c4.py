#!/usr/bin/env python3
"""Export carousel slides to individual 1080x1080 PNG files."""
import asyncio
import os

async def main():
    from playwright.async_api import async_playwright

    html_path = os.path.join(os.path.dirname(__file__), "carousel-c4-agentic-war.html")
    out_dir = os.path.join(os.path.dirname(__file__), "slides", "c4-agentic-war")
    os.makedirs(out_dir, exist_ok=True)

    file_url = f"file://{os.path.abspath(html_path)}"

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 10000})
        await page.goto(file_url, wait_until="networkidle")

        # Wait for images to load
        await page.wait_for_timeout(3000)

        for i in range(1, 9):
            slide = page.locator(f"#slide-{i}")
            box = await slide.bounding_box()
            if box:
                out_path = os.path.join(out_dir, f"{i:02d}.png")
                await slide.screenshot(path=out_path)
                print(f"  Saved {out_path}  ({int(box['width'])}x{int(box['height'])})")

        await browser.close()
        print(f"\nDone – {out_dir}")

asyncio.run(main())
