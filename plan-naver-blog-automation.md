# 네이버 블로그 자동화 플랜

> BDM Lab 웹사이트 아티클 → 네이버 블로그 자동 포스팅 파이프라인

---

## 전체 파이프라인 개요

```
content/articles/*.mdx
       │
       ▼
 ┌─────────────────────┐
 │  1. MDX 파싱         │  frontmatter + 본문 추출
 └──────┬──────────────┘
        │
        ▼
 ┌─────────────────────┐
 │  2. 썸네일 자동 생성  │  Pillow (Python) — 시리즈별 템플릿
 └──────┬──────────────┘
        │
        ▼
 ┌─────────────────────┐
 │  3. 본문 변환        │  MDX → 네이버 블로그 HTML
 └──────┬──────────────┘    (이미지 삽입 포인트 자동 결정)
        │
        ▼
 ┌─────────────────────┐
 │  4. 본문 내 이미지   │  차트/인포그래픽 자동 생성 (matplotlib)
 └──────┬──────────────┘
        │
        ▼
 ┌─────────────────────┐
 │  5. 네이버 포스팅    │  Naver Blog API (Open API)
 └─────────────────────┘
```

---

## Phase 0: 사전 준비 (1회성, 수동)

### 0-1. Canva에서 디자인 시안 확정

Canva로 **2가지 썸네일 템플릿** 디자인 (이것만 수동):

**A. 알고리즘 디코드 템플릿**
- 사이즈: 1200 × 630px (네이버 블로그 + OG 이미지 겸용)
- 배경: 밝은 톤 (#F8F9FA) + 좌측에 에메랄드 그린 (#059669) 세로 악센트 바
- 좌측 60%: 제목 텍스트 (2-3줄, 볼드)
- 우측 40%: 키 비주얼 이미지 영역 (rounded corner)
- 하단 바: "BDM Lab · 알고리즘 디코드" + 로고
- 폰트: Pretendard 또는 Apple SD Gothic Neo Bold

**B. 랩 리서치 템플릿**
- 사이즈: 1200 × 630px
- 배경: 다크 네이비 (#0F172A)
- 좌측 55%: 제목 텍스트 (흰색, 볼드)
- 우측 45%: 핵심 숫자 or 차트 이미지 영역
- 하단 바: "BDM Lab · LAB RESEARCH" + "n=349" 같은 데이터 시그니처
- 포인트 컬러: 에메랄드 그린 (#059669)
- 폰트: 동일

**→ Canva에서 디자인 확정 후, 정확한 좌표/색상/폰트 크기를 기록**
**→ 이 스펙을 Python Pillow 코드로 복제**

### 0-2. 네이버 블로그 API 세팅

1. https://developers.naver.com 접속
2. 애플리케이션 등록 (Blog API 사용)
3. Client ID / Client Secret 발급
4. OAuth 2.0 인증 (1회 수동 로그인 → refresh token 저장)
5. `.env` 파일에 키 저장

```env
NAVER_CLIENT_ID=xxxx
NAVER_CLIENT_SECRET=xxxx
NAVER_ACCESS_TOKEN=xxxx
NAVER_REFRESH_TOKEN=xxxx
NAVER_BLOG_ID=xxxx
```

### 0-3. 폰트 파일 준비

```bash
# 프로젝트에 폰트 디렉토리 생성
mkdir -p scripts/naver-blog/fonts

# Apple SD Gothic Neo는 시스템 폰트 (/System/Library/Fonts/AppleSDGothicNeo.ttc)
# → .ttc에서 개별 .ttf 추출 또는 Pretendard OTF 다운로드
# Pretendard 추천 (웹/이미지 모두 사용 가능, 오픈소스)
```

---

## Phase 1: 썸네일 자동 생성 스크립트

### 파일 구조

```
scripts/naver-blog/
├── config.py              # 색상, 폰트, 좌표 등 디자인 스펙
├── thumbnail_generator.py # 썸네일 이미지 생성
├── mdx_parser.py          # MDX 파싱 (frontmatter + 본문)
├── content_transformer.py # MDX → 네이버 HTML 변환
├── chart_generator.py     # 본문 내 차트 자동 생성
├── naver_api.py           # 네이버 블로그 API 연동
├── pipeline.py            # 전체 파이프라인 통합
├── fonts/
│   ├── Pretendard-Bold.otf
│   ├── Pretendard-Regular.otf
│   └── Pretendard-SemiBold.otf
├── templates/
│   ├── blog_post.html     # 네이버 블로그 HTML 템플릿
│   └── overlay_bg/        # 썸네일 배경 에셋
└── output/
    ├── thumbnails/
    └── posts/
```

### config.py — 디자인 스펙 정의

```python
# 썸네일 디자인 스펙
THUMBNAIL = {
    "width": 1200,
    "height": 630,

    "algorithm_decode": {
        "bg_color": "#F8F9FA",
        "accent_bar_color": "#059669",
        "accent_bar_width": 8,
        "title_color": "#1C1917",
        "title_font_size": 48,
        "title_x": 60,
        "title_y": 120,
        "title_max_width": 650,
        "subtitle_color": "#57534E",
        "subtitle_font_size": 22,
        "label_text": "알고리즘 디코드",
        "label_bg": "#ECFDF5",
        "label_color": "#059669",
        "footer_text": "BDM Lab · Big Data Marketing Lab",
        "footer_color": "#A8A29E",
    },

    "lab_research": {
        "bg_color": "#0F172A",
        "accent_bar_color": "#059669",
        "accent_bar_width": 8,
        "title_color": "#FFFFFF",
        "title_font_size": 44,
        "title_x": 60,
        "title_y": 120,
        "title_max_width": 600,
        "subtitle_color": "#94A3B8",
        "subtitle_font_size": 22,
        "label_text": "LAB RESEARCH",
        "label_bg": "#1E293B",
        "label_color": "#059669",
        "data_signature_color": "#059669",  # "n=349" 같은 수치
        "footer_text": "BDM Lab · Big Data Marketing Lab",
        "footer_color": "#64748B",
    },
}
```

### thumbnail_generator.py — 핵심 로직

```python
from PIL import Image, ImageDraw, ImageFont
import textwrap
from config import THUMBNAIL

def generate_thumbnail(
    title: str,
    series: str,          # "algorithm-decode" | "lab-research"
    excerpt: str = "",
    data_signature: str = "",  # "n=349, 3년" 같은 데이터 시그니처
    output_path: str = "thumbnail.png"
):
    W, H = THUMBNAIL["width"], THUMBNAIL["height"]
    series_key = series.replace("-", "_")
    style = THUMBNAIL[series_key]

    # 캔버스 생성
    img = Image.new("RGB", (W, H), style["bg_color"])
    draw = ImageDraw.Draw(img)

    # 좌측 악센트 바
    draw.rectangle(
        [0, 0, style["accent_bar_width"], H],
        fill=style["accent_bar_color"]
    )

    # 시리즈 라벨
    label_font = ImageFont.truetype("fonts/Pretendard-SemiBold.otf", 16)
    lx, ly = style["title_x"], 60
    label_text = style["label_text"]
    lbbox = draw.textbbox((0, 0), label_text, font=label_font)
    lw, lh = lbbox[2] - lbbox[0], lbbox[3] - lbbox[1]
    draw.rounded_rectangle(
        [lx - 8, ly - 4, lx + lw + 8, ly + lh + 4],
        radius=4, fill=style["label_bg"]
    )
    draw.text((lx, ly), label_text, fill=style["label_color"], font=label_font)

    # 제목 — 자동 줄바꿈
    title_font = ImageFont.truetype("fonts/Pretendard-Bold.otf", style["title_font_size"])
    wrapped = wrap_text_korean(title, title_font, style["title_max_width"], draw)
    draw.multiline_text(
        (style["title_x"], style["title_y"]),
        wrapped,
        fill=style["title_color"],
        font=title_font,
        spacing=12
    )

    # excerpt (한 줄)
    if excerpt:
        excerpt_font = ImageFont.truetype("fonts/Pretendard-Regular.otf", style["subtitle_font_size"])
        short_excerpt = excerpt[:50] + "..." if len(excerpt) > 50 else excerpt
        draw.text(
            (style["title_x"], H - 140),
            short_excerpt,
            fill=style["subtitle_color"],
            font=excerpt_font
        )

    # 데이터 시그니처 (랩 리서치만)
    if data_signature and series == "lab-research":
        sig_font = ImageFont.truetype("fonts/Pretendard-Bold.otf", 28)
        draw.text(
            (W - 300, 80),
            data_signature,
            fill=style["data_signature_color"],
            font=sig_font
        )

    # 하단 바
    draw.rectangle([0, H - 50, W, H], fill="#000000" if series == "lab-research" else "#E7E5E4")
    footer_font = ImageFont.truetype("fonts/Pretendard-Regular.otf", 14)
    draw.text((60, H - 35), style["footer_text"], fill=style["footer_color"], font=footer_font)

    img.save(output_path, quality=95)
    return output_path


def wrap_text_korean(text, font, max_width, draw):
    """한글 텍스트를 max_width에 맞게 줄바꿈"""
    lines = []
    current = ""
    for char in text:
        test = current + char
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width:
            lines.append(current)
            current = char
        else:
            current = test
    if current:
        lines.append(current)
    return "\n".join(lines[:3])  # 최대 3줄
```

---

## Phase 2: MDX → 네이버 블로그 HTML 변환

### mdx_parser.py

```python
import re
import yaml
from pathlib import Path

def parse_mdx(filepath: str) -> dict:
    """MDX 파일에서 frontmatter와 본문을 분리"""
    content = Path(filepath).read_text(encoding="utf-8")

    # frontmatter 추출
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not fm_match:
        raise ValueError(f"No frontmatter in {filepath}")

    fm_raw = fm_match.group(1)
    body = content[fm_match.end():]

    # YAML 파싱
    frontmatter = yaml.safe_load(fm_raw)

    return {
        "frontmatter": frontmatter,
        "body": body,
        "filepath": filepath
    }
```

### content_transformer.py — MDX → 네이버 HTML

```python
import re
from typing import List, Tuple

def mdx_to_naver_html(body: str, frontmatter: dict) -> str:
    """MDX 본문을 네이버 블로그 HTML로 변환"""

    html = body

    # 1. 이미지 태그 변환 (MDX → HTML)
    html = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img src="\2" alt="\1" />', html)

    # 2. 헤딩 변환 (## → <h3>, ### → <h4>)
    #    네이버 블로그에서는 h2가 너무 크므로 한 단계 낮춤
    html = re.sub(r'^### (.+)$', r'<h4>\1</h4>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h3 style="color:#059669; border-bottom:2px solid #059669; padding-bottom:8px; margin-top:40px;">\1</h3>', html, flags=re.MULTILINE)

    # 3. 볼드/이탤릭
    html = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', html)
    html = re.sub(r'\*(.+?)\*', r'<i>\1</i>', html)

    # 4. 테이블 변환 (마크다운 테이블 → HTML 테이블)
    html = convert_tables(html)

    # 5. 단락 처리 — 빈 줄로 분리된 텍스트를 <p>로 감싸기
    paragraphs = html.split("\n\n")
    processed = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        if p.startswith("<h") or p.startswith("<table") or p.startswith("<img") or p.startswith("<div"):
            processed.append(p)
        else:
            # 네이버 블로그 최적화: 볼드 핵심 문장 하이라이트
            processed.append(f'<p style="font-size:16px; line-height:1.9; color:#333;">{p}</p>')

    # 6. 이미지 삽입 포인트 결정 (매 3-4 단락마다)
    #    → Phase 4에서 차트 이미지 경로를 여기에 삽입

    # 7. 서두 후킹 강화
    intro = create_naver_intro(frontmatter)

    # 8. 하단 CTA
    outro = create_naver_outro(frontmatter)

    return intro + "\n".join(processed) + outro


def create_naver_intro(fm: dict) -> str:
    """네이버용 서두 — 짧고 강하게"""
    return f"""
    <div style="background:#ECFDF5; padding:20px 24px; border-radius:12px; margin-bottom:30px;">
        <p style="font-size:14px; color:#059669; font-weight:bold; margin:0;">
            {fm.get('series', '').replace('algorithm-decode', '🔍 알고리즘 디코드').replace('lab-research', '📊 랩 리서치')}
        </p>
        <p style="font-size:18px; color:#1C1917; font-weight:bold; margin:8px 0 0 0;">
            {fm.get('excerpt', '')}
        </p>
    </div>
    """


def create_naver_outro(fm: dict) -> str:
    """네이버용 하단 CTA"""
    return f"""
    <div style="background:#0F172A; padding:30px; border-radius:12px; margin-top:40px; text-align:center;">
        <p style="color:#fff; font-size:18px; font-weight:bold; margin:0;">
            전체 분석 + 데이터 시각화 보기
        </p>
        <p style="color:#94A3B8; font-size:14px; margin:10px 0;">
            bigdatamarketinglab.com
        </p>
        <p style="color:#059669; font-size:14px; margin:5px 0;">
            BDM Lab · 빅데이터마케팅 랩
        </p>
    </div>
    """


def convert_tables(html: str) -> str:
    """마크다운 테이블 → HTML 테이블 (네이버 스타일)"""
    table_pattern = re.compile(
        r'(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)+)',
        re.MULTILINE
    )

    def table_replacer(match):
        header_line = match.group(1)
        body_lines = match.group(3).strip().split("\n")

        headers = [h.strip() for h in header_line.split("|") if h.strip()]
        rows = []
        for line in body_lines:
            cells = [c.strip() for c in line.split("|") if c.strip()]
            rows.append(cells)

        table_html = '<table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:14px;">\n'
        table_html += "<thead><tr>"
        for h in headers:
            table_html += f'<th style="background:#059669; color:#fff; padding:10px 14px; text-align:left;">{h}</th>'
        table_html += "</tr></thead>\n<tbody>"
        for row in rows:
            table_html += "<tr>"
            for cell in row:
                table_html += f'<td style="padding:10px 14px; border-bottom:1px solid #E7E5E4;">{cell}</td>'
            table_html += "</tr>\n"
        table_html += "</tbody></table>"
        return table_html

    return table_pattern.sub(table_replacer, html)
```

---

## Phase 3: 본문 내 차트 자동 생성 (선택적)

### chart_generator.py

```python
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

# 한글 폰트 설정
plt.rcParams['font.family'] = 'AppleGothic'  # macOS
plt.rcParams['axes.unicode_minus'] = False

# BDM Lab 차트 스타일
BDM_COLORS = {
    "accent": "#059669",
    "dark": "#0F172A",
    "gray": "#64748B",
    "light_bg": "#F8FAFC",
    "red": "#EF4444",
}

def create_bar_chart(
    labels: list,
    values: list,
    title: str = "",
    highlight_index: int = -1,
    output_path: str = "chart.png"
):
    """BDM Lab 스타일 바 차트"""
    fig, ax = plt.subplots(figsize=(10, 5))
    fig.patch.set_facecolor(BDM_COLORS["light_bg"])
    ax.set_facecolor(BDM_COLORS["light_bg"])

    colors = [BDM_COLORS["accent"] if i == highlight_index else "#CBD5E1"
              for i in range(len(values))]

    bars = ax.barh(labels, values, color=colors, height=0.6, edgecolor="none")

    # 값 라벨
    for bar, val in zip(bars, values):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                f'{val}', va='center', fontsize=12, fontweight='bold',
                color=BDM_COLORS["dark"])

    ax.set_title(title, fontsize=16, fontweight='bold', color=BDM_COLORS["dark"], pad=20)
    ax.spines[['top', 'right', 'bottom']].set_visible(False)
    ax.tick_params(left=False, bottom=False)
    ax.set_xlabel('')

    plt.tight_layout()
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor=BDM_COLORS["light_bg"])
    plt.close()
```

---

## Phase 4: 네이버 블로그 API 포스팅

### naver_api.py

```python
import requests
import json

class NaverBlogAPI:
    """네이버 블로그 Open API 연동"""

    BASE_URL = "https://openapi.naver.com/blog"
    TOKEN_URL = "https://nid.naver.com/oauth2.0/token"

    def __init__(self, client_id, client_secret, access_token):
        self.client_id = client_id
        self.client_secret = client_secret
        self.access_token = access_token

    def write_post(self, title: str, contents: str, category_no: int = 0) -> dict:
        """블로그 포스트 작성"""
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        data = {
            "title": title,
            "contents": contents,
            "categoryNo": category_no,
        }
        response = requests.post(
            f"{self.BASE_URL}/writePost.json",
            headers=headers,
            data=data
        )
        return response.json()

    def upload_image(self, image_path: str) -> str:
        """이미지 업로드 후 URL 반환"""
        headers = {
            "Authorization": f"Bearer {self.access_token}"
        }
        with open(image_path, "rb") as f:
            files = {"image": f}
            response = requests.post(
                "https://openapi.naver.com/blog/uploadImage.json",
                headers=headers,
                files=files
            )
        result = response.json()
        return result.get("url", "")

    def refresh_token(self, refresh_token: str) -> dict:
        """토큰 갱신"""
        params = {
            "grant_type": "refresh_token",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "refresh_token": refresh_token
        }
        response = requests.get(self.TOKEN_URL, params=params)
        return response.json()
```

---

## Phase 5: 통합 파이프라인

### pipeline.py — 원커맨드 실행

```python
#!/usr/bin/env python3
"""
사용법:
    # 특정 글 하나 변환 + 포스팅
    python pipeline.py --slug 2026-03-06-forecasting-restaurant-sales

    # 특정 글 변환만 (포스팅 안 함, 미리보기용)
    python pipeline.py --slug 2026-03-06-forecasting-restaurant-sales --preview

    # 아직 포스팅 안 된 모든 글 일괄 처리
    python pipeline.py --all --dry-run

    # 새 글 감지 → 자동 포스팅 (cron 연동)
    python pipeline.py --new-only
"""

import argparse
import json
from pathlib import Path
from mdx_parser import parse_mdx
from thumbnail_generator import generate_thumbnail
from content_transformer import mdx_to_naver_html
from naver_api import NaverBlogAPI

CONTENT_DIR = Path("../../content/articles")
OUTPUT_DIR = Path("output")
POSTED_LOG = OUTPUT_DIR / "posted.json"  # 이미 포스팅된 slug 기록

def get_posted_slugs():
    if POSTED_LOG.exists():
        return json.loads(POSTED_LOG.read_text())
    return []

def mark_as_posted(slug):
    posted = get_posted_slugs()
    posted.append(slug)
    POSTED_LOG.write_text(json.dumps(posted, indent=2))

def process_article(slug: str, preview: bool = False):
    """단일 아티클 처리"""
    mdx_path = CONTENT_DIR / f"{slug}.mdx"
    if not mdx_path.exists():
        print(f"❌ File not found: {mdx_path}")
        return

    # 1. 파싱
    article = parse_mdx(str(mdx_path))
    fm = article["frontmatter"]
    print(f"📄 파싱 완료: {fm['title']}")

    # 2. 썸네일 생성
    thumb_path = OUTPUT_DIR / "thumbnails" / f"{slug}.png"
    thumb_path.parent.mkdir(parents=True, exist_ok=True)

    data_sig = extract_data_signature(fm, article["body"])
    generate_thumbnail(
        title=fm["title"],
        series=fm["series"],
        excerpt=fm.get("excerpt", ""),
        data_signature=data_sig,
        output_path=str(thumb_path)
    )
    print(f"🖼️  썸네일 생성: {thumb_path}")

    # 3. 본문 변환
    naver_html = mdx_to_naver_html(article["body"], fm)
    html_path = OUTPUT_DIR / "posts" / f"{slug}.html"
    html_path.parent.mkdir(parents=True, exist_ok=True)
    html_path.write_text(naver_html, encoding="utf-8")
    print(f"📝 HTML 변환 완료: {html_path}")

    # 4. 미리보기 모드면 여기서 중단
    if preview:
        print(f"👀 미리보기: file://{html_path.resolve()}")
        return

    # 5. 네이버 포스팅
    # api = NaverBlogAPI(...)
    # api.write_post(title=fm["title"], contents=naver_html)
    # mark_as_posted(slug)
    print(f"✅ 포스팅 완료: {fm['title']}")


def extract_data_signature(fm: dict, body: str) -> str:
    """본문에서 핵심 데이터 시그니처 추출 (랩 리서치용)"""
    import re
    if fm.get("series") != "lab-research":
        return ""

    # "n=숫자" 패턴 또는 "XXX개" 패턴 찾기
    patterns = [
        r'(\d{2,},?\d*개\s*매장)',
        r'(\d{1,},?\d*명)',
        r'(n\s*=\s*\d+)',
        r'(\d+개\s*매장)',
    ]
    for p in patterns:
        match = re.search(p, body)
        if match:
            return match.group(1)
    return ""


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", type=str, help="특정 글 slug")
    parser.add_argument("--preview", action="store_true", help="미리보기만")
    parser.add_argument("--all", action="store_true", help="모든 글 처리")
    parser.add_argument("--new-only", action="store_true", help="새 글만 처리")
    parser.add_argument("--dry-run", action="store_true", help="실행 안 하고 목록만")
    args = parser.parse_args()

    if args.slug:
        process_article(args.slug, preview=args.preview)
    elif args.all or args.new_only:
        posted = get_posted_slugs()
        for mdx in sorted(CONTENT_DIR.glob("*.mdx")):
            slug = mdx.stem
            if args.new_only and slug in posted:
                continue
            if args.dry_run:
                print(f"  [DRY] {slug}")
            else:
                process_article(slug, preview=args.preview)
```

---

## 실행 플랜 — Claude Code로 Trial & Error

### Step 1: 썸네일 생성기 개발 (Day 1)

```
목표: thumbnail_generator.py가 19개 글의 썸네일을 자동 생성

Claude Code 작업 순서:
1. config.py + thumbnail_generator.py 초안 작성
2. 테스트 실행: 첫 번째 글(치킨집 349개)로 썸네일 생성
3. 결과 이미지 확인 → 피드백:
   - "제목이 너무 크다/작다" → font_size 조정
   - "줄바꿈이 이상하다" → wrap_text_korean 로직 수정
   - "색상이 안 맞다" → config.py 값 조정
   - "라벨 위치가 어색하다" → 좌표 조정
4. 알고리즘 디코드 글 1개로도 테스트
5. 두 시리즈 모두 만족할 때까지 반복 (3-5회 예상)
6. 19개 전체 일괄 생성 → 확인
```

**체크포인트:**
- [ ] 한글 줄바꿈이 자연스러운가?
- [ ] 제목이 3줄을 넘지 않는가?
- [ ] 시리즈별 색상/분위기가 확실히 다른가?
- [ ] 1200x630px 크기가 정확한가?
- [ ] 네이버 피드에서 잘려보이지 않는가? (중요 요소가 중앙에)

### Step 2: 본문 변환기 개발 (Day 2)

```
Claude Code 작업 순서:
1. mdx_parser.py 작성 + 테스트 (frontmatter 추출 확인)
2. content_transformer.py 초안 작성
3. 테스트: 치킨집 글 → HTML 변환
4. 브라우저에서 HTML 열어서 확인:
   - "테이블이 깨진다" → convert_tables 수정
   - "볼드가 누락된다" → 정규식 수정
   - "이미지 경로가 틀리다" → Unsplash URL 처리 추가
   - "네이버에서 스타일이 안 먹는다" → inline style 방식으로 전환
5. 네이버 블로그 에디터에 HTML 붙여넣기 테스트 (수동)
6. 스타일 미세 조정 반복 (3-5회 예상)
```

**체크포인트:**
- [ ] 네이버 블로그 에디터에서 HTML이 정상 렌더링되는가?
- [ ] 테이블이 모바일에서도 읽히는가?
- [ ] 인라인 스타일이 네이버에서 무시되지 않는가?
- [ ] 서두 후킹 박스가 눈에 띄는가?
- [ ] 하단 CTA가 제대로 보이는가?

### Step 3: 네이버 API 연동 (Day 3)

```
Claude Code 작업 순서:
1. 네이버 개발자 센터에서 앱 등록 (수동)
2. OAuth 인증 플로우 구현
3. naver_api.py 작성
4. 테스트 포스트 (비공개) 1개 작성
5. 이미지 업로드 테스트
6. 성공하면 → pipeline.py 통합
```

**주의사항:**
- 네이버 Blog API는 일일 호출 한도가 있음 (보통 10,000회)
- 이미지는 API로 업로드 후 반환되는 URL을 HTML에 삽입
- 첫 포스트는 반드시 --preview로 확인 후 수동 포스팅

### Step 4: 차트 생성 자동화 (Day 4, 선택)

```
Claude Code 작업 순서:
1. 각 리서치 글에서 핵심 차트 데이터 수동 정의 (JSON)
2. chart_generator.py로 차트 생성
3. 본문 변환 시 자동 삽입
```

이 단계는 완전 자동화가 어려움 (차트 데이터를 본문에서 자동 추출하기 어려움).
대안: 각 글에 frontmatter 또는 별도 JSON으로 차트 데이터를 미리 정의.

```yaml
# frontmatter에 추가
charts:
  - type: "bar"
    title: "채널별 매출 결정 변수"
    labels: ["배달", "포장", "매장 식사"]
    values: [0.42, 0.38, 0.31]
    highlight: 0
```

### Step 5: Cron 자동화 (Day 5)

```bash
# 매일 오전 9시, 새 MDX 파일 감지 → 자동 포스팅
# crontab -e
0 9 * * * cd ~/Dropbox/Website-BigDMKTG/scripts/naver-blog && python3 pipeline.py --new-only

# 또는 Claude Code의 /loop 기능 활용
```

---

## 전체 일정 요약

| Day | 작업 | 산출물 | 자동화 수준 |
|-----|------|--------|-----------|
| 0 | Canva 시안 2종 제작 (수동) | 디자인 스펙 확정 | 수동 |
| 0 | 네이버 API 앱 등록 (수동) | Client ID/Secret | 수동 |
| 1 | 썸네일 생성기 | 19개 썸네일 자동 생성 | ✅ 자동 |
| 2 | 본문 변환기 | MDX→HTML 자동 변환 | ✅ 자동 |
| 3 | API 연동 | 자동 포스팅 | ✅ 자동 |
| 4 | 차트 생성 (선택) | 글별 차트 자동 삽입 | ⚠️ 반자동 |
| 5 | Cron 설정 | 새 글 자동 감지+포스팅 | ✅ 자동 |

### 최종 워크플로우 (Day 5 이후)

```
교수님이 할 일:
1. content/articles/에 새 .mdx 파일 추가 (기존과 동일)
2. 끝. (Cron이 나머지 처리)

자동으로 일어나는 일:
1. 새 MDX 감지
2. 썸네일 자동 생성 (시리즈별 템플릿)
3. 본문 → 네이버 HTML 변환
4. 네이버 블로그에 자동 포스팅
5. posted.json에 기록 (중복 방지)
```

---

## 리스크 & 대안

| 리스크 | 대안 |
|-------|------|
| 네이버 Blog API 중단/변경 | Selenium 기반 브라우저 자동화로 전환 |
| 이미지 업로드 API 제한 | 이미지를 웹사이트에 호스팅하고 URL로 참조 |
| 한글 폰트 렌더링 이슈 | Pretendard OTF 파일 직접 번들 |
| 네이버 HTML 스타일 제한 | 인라인 스타일만 사용 (class 불가) |
| 차트 데이터 자동 추출 어려움 | frontmatter에 차트 스펙을 수동 정의 |
