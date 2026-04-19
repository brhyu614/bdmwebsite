#!/usr/bin/env python3
"""
BDM Carousel Generator CLI
텍스트만 입력하면 주제에 맞는 배경 동영상이 자동 삽입된 캐러셀을 생성합니다.

Usage:
    python3 make_carousel.py input.yaml
    python3 make_carousel.py input.yaml --duration 10
    python3 make_carousel.py input.yaml --no-video   # HTML만 생성 (동영상 녹화 안 함)
"""
import argparse
import asyncio
import os
import re
import sys
import tempfile
from pathlib import Path

import yaml
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader

from pexels_client import PexelsClient
from renderer import record_slide_video, screenshot_slide
from text_utils import extract_keyword, format_body, format_title

# ── Constants ──
BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"
OUTPUT_BASE = Path.home() / "Dropbox" / "BDM-Assets" / "carousel-output"
DEFAULT_ACCENT = "#39FF14"
DEFAULT_FOOTER = "BDM Lab · @bdm.lab"
DEFAULT_BRAND_NAME = "BDM Lab"
DEFAULT_BRAND_HANDLE = "@bdm.lab"
DEFAULT_BRAND_LOGO_TEXT = "B"
DEFAULT_DURATION = 8
VARIANT_CYCLE = ["dark", "light", "green", "dark", "light", "dark"]


def next_carousel_number() -> int:
    """Find next available carousel number in output directory."""
    OUTPUT_BASE.mkdir(parents=True, exist_ok=True)
    existing = []
    for d in OUTPUT_BASE.iterdir():
        if d.is_dir() and re.match(r"^c\d+$", d.name):
            existing.append(int(d.name[1:]))
    return max(existing, default=0) + 1


def load_config(yaml_path: str) -> dict:
    """Load and validate YAML input file."""
    with open(yaml_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    # Defaults
    meta = config.get("meta", {})
    meta.setdefault("accent", DEFAULT_ACCENT)
    meta.setdefault("footer", DEFAULT_FOOTER)
    meta.setdefault("duration", DEFAULT_DURATION)
    meta.setdefault("source", "")
    meta.setdefault("category", "")
    meta.setdefault("video_keyword_global", "abstract technology dark")
    config["meta"] = meta

    # Validate required sections
    if "cover" not in config:
        print("⚠ No 'cover' section in YAML. Using defaults.")
        config["cover"] = {"title": "Title", "subtitle": "Subtitle"}

    if "slides" not in config or not config["slides"]:
        print("⚠ No 'slides' section in YAML.")
        config["slides"] = []

    if "outro" not in config:
        config["outro"] = {}

    # Assign default variants
    for i, slide in enumerate(config["slides"]):
        if "variant" not in slide:
            slide["variant"] = VARIANT_CYCLE[i % len(VARIANT_CYCLE)]

    return config


def get_video_keyword(slide: dict, meta: dict, is_cover: bool = False, is_outro: bool = False) -> str:
    """Determine Pexels search keyword for a slide."""
    if is_outro:
        return "abstract dark minimal"

    # Explicit keyword
    kw = slide.get("video_keyword")
    if kw:
        return kw

    # Global fallback
    global_kw = meta.get("video_keyword_global")

    # Auto-extract from content
    tag = slide.get("tag", slide.get("category", ""))
    heading = slide.get("heading", slide.get("title", ""))
    extracted = extract_keyword(tag, heading)

    if extracted and extracted != "abstract technology":
        return extracted
    if global_kw:
        return global_kw
    return "abstract technology dark"


async def main():
    parser = argparse.ArgumentParser(description="BDM Carousel Generator")
    parser.add_argument("input", help="YAML input file path")
    parser.add_argument("--duration", type=int, help="Video duration per slide (seconds)")
    parser.add_argument("--accent", help="Override accent color")
    parser.add_argument("--no-video", action="store_true", help="Generate HTML only, skip video recording")
    parser.add_argument("--output-dir", help="Override output directory")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    # Load env
    load_dotenv(BASE_DIR / ".env")
    api_key = os.getenv("PEXELS_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("❌ PEXELS_API_KEY가 설정되지 않았습니다.")
        print("   1. https://www.pexels.com/api/ 에서 무료 API 키를 발급받으세요.")
        print(f"   2. {BASE_DIR / '.env'} 파일에 PEXELS_API_KEY=your_key 를 입력하세요.")
        sys.exit(1)

    # Load config
    config = load_config(args.input)
    meta = config["meta"]

    if args.duration:
        meta["duration"] = args.duration
    if args.accent:
        meta["accent"] = args.accent

    accent = meta["accent"]
    footer = meta["footer"]
    duration = meta["duration"]
    source = meta["source"]
    category = meta["category"]

    # Setup output directory
    if args.output_dir:
        out_dir = Path(args.output_dir)
    else:
        num = next_carousel_number()
        out_dir = OUTPUT_BASE / f"c{num}"
    out_dir.mkdir(parents=True, exist_ok=True)
    bg_dir = out_dir / "bg_videos"
    bg_dir.mkdir(exist_ok=True)

    print(f"\n🎨 BDM Carousel Generator")
    print(f"   Accent: {accent}")
    print(f"   Output: {out_dir}")
    print(f"   Duration: {duration}s per slide")
    print()

    # Init Pexels client
    pexels = PexelsClient(api_key)

    # Init Jinja2
    env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))
    cover_tpl = env.get_template("slide_cover.html")
    content_tpl = env.get_template("slide_content.html")
    outro_tpl = env.get_template("slide_outro.html")

    # Collect all slides to process
    all_slides = []

    # ── Slide 1: Cover ──
    cover = config["cover"]
    all_slides.append({
        "type": "cover",
        "data": cover,
        "template": cover_tpl,
        "context": {
            "accent": accent,
            "source": source,
            "category": category,
            "title": format_title(cover.get("title", "")),
            "subtitle": cover.get("subtitle", ""),
            "footer": footer,
            "brand_name": meta.get("brand_name", DEFAULT_BRAND_NAME),
            "brand_handle": meta.get("brand_handle", DEFAULT_BRAND_HANDLE),
            "brand_logo_text": meta.get("brand_logo_text", DEFAULT_BRAND_LOGO_TEXT),
            "hook_number": cover.get("hook_number", ""),
            "hook_label": cover.get("hook_label", ""),
        },
        "keyword": get_video_keyword(cover, meta, is_cover=True),
        "index": 1,
    })

    # ── Slides 2~N+1: Content ──
    for i, slide in enumerate(config["slides"]):
        body_text = slide.get("body", "")
        # Support multi-paragraph body (separated by double newline)
        body_parts = body_text.split("\n\n") if "\n\n" in body_text else [body_text]
        body_html = '<div style="height:8px;"></div>'.join(
            f'<div class="body">{format_body(part.strip())}</div>'
            for part in body_parts if part.strip()
        )

        all_slides.append({
            "type": "content",
            "data": slide,
            "template": content_tpl,
            "context": {
                "accent": accent,
                "variant": slide["variant"],
                "tag": slide.get("tag", ""),
                "heading": format_title(slide.get("heading", "")),
                "body": body_html,
                "footer": footer,
                "slide_number": i + 2,
                "total_slides": len(config["slides"]) + 2,
            },
            "keyword": get_video_keyword(slide, meta),
            "index": i + 2,
        })

    # ── Last Slide: Outro ──
    outro = config["outro"]
    links = outro.get("links", [])
    links_html = "<br>".join(links) if links else ""
    cta_text = outro.get("cta", "")

    all_slides.append({
        "type": "outro",
        "data": outro,
        "template": outro_tpl,
        "context": {
            "accent": accent,
            "source": source,
            "brand_sub": outro.get("brand_sub", "빅데이터 마케팅 랩"),
            "closing": format_body(outro.get("closing", "")),
            "cta": format_title(cta_text),
            "links_html": links_html,
            "footer": footer,
        },
        "keyword": get_video_keyword(outro, meta, is_outro=True),
        "index": len(config["slides"]) + 2,
    })

    total = len(all_slides)

    # ── Process each slide ──
    for slide_info in all_slides:
        idx = slide_info["index"]
        stype = slide_info["type"]
        keyword = slide_info["keyword"]

        print(f"[{idx}/{total}] {stype.upper()} slide — keyword: \"{keyword}\"")

        # 1. Search & download video (skip for outro)
        video_path = ""
        if stype != "outro":
            print(f"  🔍 Pexels 검색 중...")
            videos = pexels.search_videos(keyword)
            if videos:
                vid = videos[0]
                video_filename = f"video_{idx}.mp4"
                dest = bg_dir / video_filename
                print(f"  ⬇️  다운로드 중... (ID: {vid['id']})")
                pexels.download_video(vid["url"], dest)
                video_path = str(dest.resolve())
                print(f"  ✅ 배경 동영상 저장: {dest.name}")
            else:
                print(f"  ⚠ 검색 결과 없음. 배경 동영상 없이 진행합니다.")

        # 2. Render HTML
        slide_info["context"]["video_path"] = video_path
        slide_info["context"]["home"] = str(Path.home())
        html_content = slide_info["template"].render(**slide_info["context"])

        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".html", delete=False, encoding="utf-8"
        ) as tmp:
            tmp.write(html_content)
            tmp_html = Path(tmp.name)

        # 3. Record video or screenshot
        if args.no_video:
            # Just save the HTML
            html_out = out_dir / f"slide_{idx}.html"
            tmp_html.rename(html_out)
            print(f"  📄 HTML 저장: {html_out.name}")
        else:
            output_file = out_dir / f"slide_{idx}_video.mp4"
            print(f"  🎬 녹화 중 ({duration}초)...")
            try:
                await record_slide_video(tmp_html, output_file, duration=duration)
                print(f"  ✅ 영상 저장: {output_file.name}")
            except Exception as e:
                print(f"  ❌ 녹화 실패: {e}")

            # Outro: also save as JPG
            if stype == "outro":
                jpg_out = out_dir / f"slide_{idx}.jpg"
                await screenshot_slide(tmp_html, jpg_out)
                print(f"  📸 JPG 저장: {jpg_out.name}")

            # Clean up temp HTML
            try:
                tmp_html.unlink()
            except OSError:
                pass

    # ── Summary ──
    print(f"\n{'='*50}")
    print(f"🎉 캐러셀 생성 완료!")
    print(f"   📂 출력 폴더: {out_dir}")
    print(f"   📹 슬라이드: {total}개")
    print(f"   🎨 액센트 컬러: {accent}")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    asyncio.run(main())
