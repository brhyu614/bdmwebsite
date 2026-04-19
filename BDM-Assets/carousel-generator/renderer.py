"""Playwright video recording + FFmpeg MP4 conversion."""
import asyncio
import shutil
import subprocess
import tempfile
from pathlib import Path

from playwright.async_api import async_playwright


async def record_slide_video(html_path: Path, output_mp4: Path, duration: int = 8) -> Path:
    """Record a single slide HTML as video using Playwright, then convert to MP4."""
    html_path = Path(html_path).resolve()
    output_mp4 = Path(output_mp4)
    output_mp4.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp_dir:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            context = await browser.new_context(
                viewport={"width": 1080, "height": 1350},
                record_video_dir=tmp_dir,
                record_video_size={"width": 1080, "height": 1350},
            )
            page = await context.new_page()
            await page.goto(f"file://{html_path}")

            # Wait for video element to be ready and playing
            await page.wait_for_function("""
                () => {
                    const v = document.querySelector('video');
                    if (!v) return true;
                    return v.readyState >= 3 && !v.paused;
                }
            """, timeout=10000)

            # Small buffer for stable playback
            await page.wait_for_timeout(500)

            # Record for specified duration
            await page.wait_for_timeout(duration * 1000)

            video_path = await page.video.path()
            await context.close()
            await browser.close()

            # Convert WebM to MP4 using FFmpeg
            if _has_ffmpeg():
                _convert_to_mp4(Path(video_path), output_mp4)
            else:
                # Fallback: just copy WebM with .mp4 extension
                webm_output = output_mp4.with_suffix(".webm")
                shutil.copy2(video_path, webm_output)
                print(f"  ⚠ FFmpeg not found. Saved as WebM: {webm_output}")
                return webm_output

    return output_mp4


async def screenshot_slide(html_path: Path, output_jpg: Path) -> Path:
    """Take a screenshot of a slide HTML and save as JPG."""
    html_path = Path(html_path).resolve()
    output_jpg = Path(output_jpg)
    output_jpg.parent.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1080, "height": 1350})
        await page.goto(f"file://{html_path}")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(output_jpg), type="jpeg", quality=95)
        await browser.close()

    return output_jpg


def _find_ffmpeg():
    """Find ffmpeg binary - check PATH first, then home directory."""
    path = shutil.which("ffmpeg")
    if path:
        return path
    home_ffmpeg = Path.home() / "ffmpeg"
    if home_ffmpeg.exists():
        return str(home_ffmpeg)
    return None


def _has_ffmpeg() -> bool:
    return _find_ffmpeg() is not None


def _convert_to_mp4(input_webm: Path, output_mp4: Path):
    """Convert WebM to high-quality MP4 using FFmpeg."""
    ffmpeg = _find_ffmpeg()
    cmd = [
        ffmpeg, "-y",
        "-i", str(input_webm),
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-an",  # no audio
        str(output_mp4),
    ]
    subprocess.run(cmd, capture_output=True, check=True)
