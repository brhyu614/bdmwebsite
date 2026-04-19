#!/usr/bin/env python3
"""
BDM Content Factory
웹사이트 글 + 이미지 → 캐러셀 / 네이버 블로그 / 릴스 / Threads 자동 변환

Usage:
    python factory.py
"""

import os
import re
import sys
import json
import base64
import glob
from pathlib import Path
from datetime import datetime

import yaml
from dotenv import load_dotenv
from openai import OpenAI

# ═══════════════════════════════════════════════════════════
# 설정
# ═══════════════════════════════════════════════════════════

BASE_DIR = Path(__file__).parent
PROJECT_DIR = BASE_DIR.parent.parent  # Website-BigDMKTG
ARTICLES_DIR = PROJECT_DIR / "content" / "articles"
ARTICLE_DRAFTS_DIR = PROJECT_DIR / "Article"
OUTPUT_DIR = BASE_DIR / "output"
HISTORY_DIR = BASE_DIR / "history"
LEARNINGS_FILE = HISTORY_DIR / "_accumulated_learnings.json"

PLATFORMS = {
    "1": "carousel",
    "2": "naver",
    "3": "reels",
    "4": "threads",
}

load_dotenv(BASE_DIR / ".env")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4o"


# ═══════════════════════════════════════════════════════════
# 유틸리티
# ═══════════════════════════════════════════════════════════

def clear():
    os.system("clear" if os.name != "nt" else "cls")


def print_header(text):
    print(f"\n{'─'*50}")
    print(f"  {text}")
    print(f"{'─'*50}\n")


def parse_mdx(filepath):
    """MDX 파일에서 frontmatter와 본문을 분리"""
    content = Path(filepath).read_text(encoding="utf-8")
    fm_match = re.match(r"^---\s*\n(.*?)\n---\s*\n", content, re.DOTALL)
    if not fm_match:
        return {"title": Path(filepath).stem, "body": content, "frontmatter": {}}

    fm_raw = fm_match.group(1)
    body = content[fm_match.end():]

    # 간단한 YAML 파싱
    frontmatter = {}
    for line in fm_raw.split("\n"):
        if ":" in line:
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if val.startswith("["):
                val = [v.strip().strip('"').strip("'") for v in val.strip("[]").split(",")]
            frontmatter[key] = val

    return {
        "title": frontmatter.get("title", Path(filepath).stem),
        "body": body,
        "frontmatter": frontmatter,
    }


def parse_markdown(filepath):
    """일반 마크다운 파일 파싱"""
    content = Path(filepath).read_text(encoding="utf-8")
    # 첫 번째 # 헤딩을 제목으로
    title_match = re.match(r"^#\s+(.+)$", content, re.MULTILINE)
    title = title_match.group(1) if title_match else Path(filepath).stem
    return {"title": title, "body": content, "frontmatter": {}}


def get_image_files(folder_path):
    """폴더에서 이미지 파일 목록"""
    if not folder_path or not Path(folder_path).exists():
        return []
    exts = ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.gif")
    files = []
    for ext in exts:
        files.extend(glob.glob(str(Path(folder_path) / ext)))
    return sorted(files)


def analyze_images(image_files, max_images=8):
    """GPT-4o Vision으로 이미지 분석 (커버 추천 + 설명)"""
    if not image_files:
        return []

    # 최대 8장만 분석 (비용 절약)
    to_analyze = image_files[:max_images]
    descriptions = []

    print(f"  이미지 {len(to_analyze)}장 분석 중...", end="", flush=True)

    for img_path in to_analyze:
        try:
            with open(img_path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode()

            ext = Path(img_path).suffix.lower()
            mime = "image/jpeg" if ext in (".jpg", ".jpeg") else f"image/{ext.strip('.')}"

            resp = client.chat.completions.create(
                model=MODEL,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "이 이미지를 한국어로 한 문장으로 설명해줘. 그리고 인스타 캐러셀 커버로 적합한지 yes/no로 답해. 형식: 설명: ... | 커버적합: yes/no"},
                        {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{b64}", "detail": "low"}}
                    ]
                }],
                max_tokens=150,
            )
            desc = resp.choices[0].message.content.strip()
            descriptions.append({
                "path": img_path,
                "filename": Path(img_path).name,
                "analysis": desc,
            })
            print(".", end="", flush=True)
        except Exception as e:
            descriptions.append({
                "path": img_path,
                "filename": Path(img_path).name,
                "analysis": f"분석 실패: {e}",
            })
            print("x", end="", flush=True)

    print(" 완료!")
    return descriptions


def load_learnings():
    """누적 학습 데이터 로드"""
    if LEARNINGS_FILE.exists():
        return json.loads(LEARNINGS_FILE.read_text(encoding="utf-8"))
    return {"rules": [], "examples": []}


def save_learnings(learnings):
    """누적 학습 데이터 저장"""
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)
    LEARNINGS_FILE.write_text(
        json.dumps(learnings, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# ═══════════════════════════════════════════════════════════
# GPT 호출
# ═══════════════════════════════════════════════════════════

def call_gpt(system_prompt, user_prompt, json_mode=True):
    """GPT-4o API 호출"""
    # GPT json_object 모드는 프롬프트에 "json"이라는 단어가 있어야 함
    if json_mode and "json" not in system_prompt.lower() and "json" not in user_prompt.lower():
        user_prompt += "\n\nRespond in JSON format."

    kwargs = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 4096,
    }
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}

    resp = client.chat.completions.create(**kwargs)
    content = resp.choices[0].message.content.strip()

    if json_mode:
        return json.loads(content)
    return content


# ═══════════════════════════════════════════════════════════
# 플랫폼별 프롬프트 & 생성
# ═══════════════════════════════════════════════════════════

def build_learnings_text(learnings, platform):
    """누적 학습 데이터를 프롬프트에 포함할 텍스트로 변환"""
    rules = [r for r in learnings.get("rules", []) if r.get("platform") in (platform, "all")]
    if not rules:
        return ""
    text = "\n## 이전 피드백에서 배운 규칙 (반드시 따를 것):\n"
    for r in rules:
        text += f"- {r['rule']}\n"
    return text


def build_image_text(image_descriptions):
    """이미지 설명을 프롬프트에 포함할 텍스트로"""
    if not image_descriptions:
        return "\n사용 가능한 이미지: 없음 (Pexels 키워드로 대체)\n"
    text = "\n## 사용 가능한 이미지:\n"
    for img in image_descriptions:
        text += f"- {img['filename']}: {img['analysis']}\n"
    text += "\n위 이미지 중 적절한 것을 골라서 배치하세요. 파일명으로 지정하세요.\n"
    return text


# ── 캐러셀 ──

CAROUSEL_SYSTEM = """당신은 BDM Lab(빅데이터 마케팅 랩)의 인스타그램 캐러셀 콘텐츠 전략가입니다.

## BDM Lab 톤
- 데이터 기반. 과장 금지. "혁명적", "놀라운" 같은 형용사 절대 사용 금지.
- 주장에는 반드시 수치/출처가 동반
- 분석의 한계를 솔직히 인정
- 학술적이되 실무자가 이해할 수 있는 언어

## 캐러셀 규칙
1. cover: 3초 안에 스크롤을 멈추게 할 훅. 가능하면 숫자/통계로 시작
2. slides: 6-8개. 각 슬라이드는 한 화면에 읽을 수 있는 분량 (3-5문장)
3. 구조: HOOK → DISCOVERY 또는 PROBLEM → INSIGHT 또는 DATA → SOLUTION → ACTION
4. outro: CTA + 웹사이트 링크
5. **bold**는 강조, {{중요문장}}은 초록 하이라이트
6. 각 슬라이드에 맞는 영문 Pexels video 검색 키워드 지정
7. variant 순서: dark, light, green, dark, light, dark (반복)

## 출력 형식
반드시 아래 JSON 형식으로 출력하세요:
{
  "meta": {
    "source": "시리즈명",
    "category": "카테고리 (영문 대문자)",
    "accent": "#39FF14",
    "duration": 8,
    "video_keyword_global": "전체 주제 영문 키워드",
    "brand_name": "BDM Lab",
    "brand_handle": "@bdm.lab",
    "brand_logo_text": "B"
  },
  "cover": {
    "title": "훅 제목 (2-3줄, 줄바꿈은 \\n)",
    "subtitle": "부제",
    "video_keyword": "영문 Pexels 검색어",
    "hook_number": "핵심 숫자 (예: 87%)",
    "hook_label": "숫자 설명"
  },
  "slides": [
    {
      "tag": "HOOK|DISCOVERY|PROBLEM|INSIGHT|DATA|SOLUTION|ACTION",
      "variant": "dark|light|green",
      "heading": "제목 2줄 (\\n으로 줄바꿈)",
      "body": "본문 3-5문장",
      "video_keyword": "영문 Pexels 검색어",
      "image": "사용할 이미지 파일명 (있으면)"
    }
  ],
  "outro": {
    "brand_sub": "빅데이터 마케팅 랩",
    "closing": "마무리 한 줄",
    "cta": "CTA 문구",
    "links": ["bigdatamarketinglab.com"]
  }
}"""


def generate_carousel(source, images_text, learnings_text):
    user_prompt = f"""아래 글을 인스타그램 캐러셀로 변환하세요.

## 원문 제목: {source['title']}

## 원문:
{source['body'][:6000]}

{images_text}
{learnings_text}"""

    print("  캐러셀 생성 중...", end="", flush=True)
    result = call_gpt(CAROUSEL_SYSTEM, user_prompt, json_mode=True)
    print(" ✓")
    return result


# ── 네이버 블로그 ──

NAVER_SYSTEM = """당신은 네이버 블로그 SEO 전문가이자 BDM Lab의 콘텐츠 에디터입니다.

## BDM Lab 톤
- 데이터 기반. 과장 금지.
- 대화체 서두 (질문이나 의외의 사실로 시작)
- 학술 용어를 실무자 언어로 번역

## 네이버 SEO 규칙
1. 제목: 15-30자, 핵심 키워드 포함
2. 본문: 2000자 이상, 3-5개 섹션
3. 각 섹션 heading + body
4. 해시태그: 8-12개 (브랜드 + 도메인 + 롱테일)
5. 서두: 질문이나 충격적 사실로 시작 (네이버 DIA 알고리즘 최적화)
6. **볼드** = 핵심 키워드, {{하이라이트}} = 결론/시사점
7. 이미지 삽입 위치를 [image: 파일명] 형태로 표시

## 출력 형식
{
  "title": "블로그 제목 (15-30자)",
  "subtitle": "부제 한 줄",
  "sections": [
    {
      "heading": "섹션 제목",
      "body": "본문 (500자 이상, 마크다운 형식)"
    }
  ],
  "hashtags": "#키워드1 #키워드2 ...",
  "bloggerName": "BDM Lab",
  "image_placements": [
    {"filename": "이미지파일명", "after_section": 0, "caption": "이미지 설명"}
  ]
}"""


def generate_naver(source, images_text, learnings_text):
    user_prompt = f"""아래 글을 네이버 블로그 포스트로 변환하세요.

## 원문 제목: {source['title']}

## 원문:
{source['body'][:6000]}

{images_text}
{learnings_text}"""

    print("  네이버 블로그 생성 중...", end="", flush=True)
    result = call_gpt(NAVER_SYSTEM, user_prompt, json_mode=True)
    print(" ✓")
    return result


# ── 릴스 ──

REELS_SYSTEM = """당신은 BDM Lab의 인스타그램 릴스 스크립트 작가입니다.

## BDM Lab 톤
- 데이터 기반. 과장 금지.
- 짧고 강하게. 한 문장이 한 호흡.

## 릴스 규칙
1. 총 5-7개 씬, 합계 45-60초
2. 씬 1 (0-3초): 훅 — 숫자나 의외성으로 시작 "~인 거 알고 계셨나요?"
3. 씬 2-3: 문제/발견 제시
4. 씬 4-5: 데이터/반전 포인트
5. 씬 6: 시사점 ("그래서 어쩌라고?")
6. 마지막 씬: CTA — "프로필 링크에서 전체 분석 보세요"
7. title = 화면에 보이는 큰 텍스트 (짧게, 1-2줄)
8. body = 나레이션/자막 텍스트 (더 상세)
9. keyword = 배경 영상 Pexels 검색어 (영문)

## 출력 형식
{
  "scenes": [
    {
      "start": 0,
      "end": 3,
      "tag": "HOOK|PROBLEM|DATA|INSIGHT|CTA",
      "title": "화면 텍스트 (1-2줄, \\n으로 줄바꿈)",
      "body": "나레이션 텍스트",
      "pos": "center-center",
      "style": "large",
      "keyword": "영문 Pexels 검색어",
      "image": "사용할 이미지 파일명 (있으면)"
    }
  ],
  "grad": "dark",
  "deco": "none",
  "total_duration": 50
}"""


def generate_reels(source, images_text, learnings_text):
    user_prompt = f"""아래 글을 인스타그램 릴스 스크립트로 변환하세요.

## 원문 제목: {source['title']}

## 원문:
{source['body'][:6000]}

{images_text}
{learnings_text}"""

    print("  릴스 스크립트 생성 중...", end="", flush=True)
    result = call_gpt(REELS_SYSTEM, user_prompt, json_mode=True)
    print(" ✓")
    return result


# ── Threads ──

THREADS_SYSTEM = """당신은 BDM Lab의 Threads(Meta) 콘텐츠 작가입니다.

## BDM Lab 톤
- 데이터 기반. 과장 금지.
- Threads는 짧고 날카로운 인사이트 한 방.

## Threads 규칙
1. 500자 이내 (짧을수록 좋음)
2. 핵심 인사이트 하나만 전달
3. 데이터/숫자가 들어가면 좋음
4. 마지막에 질문이나 생각할 거리
5. 해시태그 3-5개
6. 추천 이미지 1장 (있으면)

## 출력 형식
{
  "text": "Threads 포스트 본문",
  "hashtags": "#태그1 #태그2 #태그3",
  "recommended_image": "추천 이미지 파일명 (있으면, 없으면 null)"
}"""


def generate_threads(source, images_text, learnings_text):
    user_prompt = f"""아래 글을 Threads 포스트로 변환하세요.

## 원문 제목: {source['title']}

## 원문:
{source['body'][:4000]}

{images_text}
{learnings_text}"""

    print("  Threads 생성 중...", end="", flush=True)
    result = call_gpt(THREADS_SYSTEM, user_prompt, json_mode=True)
    print(" ✓")
    return result


GENERATORS = {
    "carousel": generate_carousel,
    "naver": generate_naver,
    "reels": generate_reels,
    "threads": generate_threads,
}

PLATFORM_NAMES = {
    "carousel": "캐러셀",
    "naver": "네이버 블로그",
    "reels": "릴스",
    "threads": "Threads",
}


# ═══════════════════════════════════════════════════════════
# 피드백 & 재생성
# ═══════════════════════════════════════════════════════════

FEEDBACK_SYSTEM = """당신은 콘텐츠 개선 전문가입니다.
이전 버전과 피드백을 바탕으로 콘텐츠를 수정하세요.
원래 형식(JSON 구조)을 그대로 유지하면서 피드백만 반영하세요."""


def regenerate_with_feedback(platform, prev_result, feedback):
    """피드백을 반영하여 재생성"""
    platform_name = PLATFORM_NAMES[platform]

    user_prompt = f"""## 이전 {platform_name} 결과:
{json.dumps(prev_result, ensure_ascii=False, indent=2)}

## 피드백:
{feedback}

피드백을 반영하여 수정된 버전을 동일한 JSON 형식으로 출력하세요."""

    print(f"  {platform_name} 재생성 중...", end="", flush=True)
    result = call_gpt(FEEDBACK_SYSTEM, user_prompt, json_mode=True)
    print(" ✓")
    return result


def extract_learnings_from_session(session):
    """세션에서 학습 포인트 자동 추출"""
    feedbacks = session.get("feedbacks", [])
    if not feedbacks:
        return []

    all_feedback = "\n".join([f"- [{f['platform']}] {f['feedback']}" for f in feedbacks])

    prompt = f"""아래는 콘텐츠 제작 후 받은 피드백입니다.
이 피드백에서 앞으로도 적용해야 할 일반적인 규칙을 추출하세요.
특정 글에만 해당하는 것은 제외하고, 반복 적용 가능한 패턴만 추출하세요.

피드백:
{all_feedback}

JSON 형식으로 출력:
{{"learnings": [{{"platform": "carousel|naver|reels|threads|all", "rule": "규칙 설명"}}]}}"""

    try:
        result = call_gpt("당신은 콘텐츠 패턴 분석가입니다.", prompt, json_mode=True)
        return result.get("learnings", [])
    except Exception:
        return []


# ═══════════════════════════════════════════════════════════
# 세션 저장
# ═══════════════════════════════════════════════════════════

def save_session(session, session_dir):
    """세션 전체를 저장"""
    session_dir.mkdir(parents=True, exist_ok=True)

    # 메인 세션 파일
    session_file = session_dir / "session.json"
    session_file.write_text(
        json.dumps(session, ensure_ascii=False, indent=2, default=str),
        encoding="utf-8",
    )

    # 플랫폼별 최종 결과물 개별 저장
    final = session.get("final_results", session.get("results", {}))
    for platform, result in final.items():
        if platform == "carousel":
            # 캐러셀은 YAML로도 저장 (make_carousel.py 호환)
            yaml_path = session_dir / "carousel.yaml"
            yaml_path.write_text(
                yaml.dump(result, allow_unicode=True, default_flow_style=False, sort_keys=False),
                encoding="utf-8",
            )
        ext = "json" if platform != "threads" else "txt"
        out_path = session_dir / f"{platform}.{ext}"
        if ext == "json":
            out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
        else:
            text = result.get("text", "") + "\n\n" + result.get("hashtags", "")
            out_path.write_text(text, encoding="utf-8")


def save_carousel_yaml(result, output_path):
    """캐러셀 결과를 make_carousel.py 호환 YAML로 저장"""
    yaml_data = {
        "meta": result.get("meta", {}),
        "cover": result.get("cover", {}),
        "slides": [],
        "outro": result.get("outro", {}),
    }
    for slide in result.get("slides", []):
        s = {k: v for k, v in slide.items() if k != "image"}
        # body를 YAML 멀티라인으로
        if "body" in s:
            s["body"] = s["body"]
        yaml_data["slides"].append(s)

    Path(output_path).write_text(
        yaml.dump(yaml_data, allow_unicode=True, default_flow_style=False, sort_keys=False),
        encoding="utf-8",
    )


# ═══════════════════════════════════════════════════════════
# 메인 프로그램
# ═══════════════════════════════════════════════════════════

def select_source():
    """콘텐츠 소스 선택"""
    print_header("1단계: 콘텐츠 소스 선택")
    print("  1. 웹사이트 글 선택 (content/articles/)")
    print("  2. Article 초안 선택 (Article/)")
    print("  3. 텍스트 직접 입력")
    print()

    choice = input("선택 [1/2/3]: ").strip()

    if choice == "1":
        mdx_files = sorted(ARTICLES_DIR.glob("*.mdx"))
        if not mdx_files:
            print("  ❌ content/articles/ 폴더에 MDX 파일이 없습니다.")
            sys.exit(1)
        print(f"\n  총 {len(mdx_files)}개 글:\n")
        for i, f in enumerate(mdx_files, 1):
            name = f.stem
            print(f"  {i:2d}. {name}")
        print()
        idx = int(input("글 번호: ").strip()) - 1
        return parse_mdx(mdx_files[idx])

    elif choice == "2":
        md_files = sorted(ARTICLE_DRAFTS_DIR.glob("*.md"))
        if not md_files:
            print("  ❌ Article/ 폴더에 MD 파일이 없습니다.")
            sys.exit(1)
        print(f"\n  총 {len(md_files)}개 초안:\n")
        for i, f in enumerate(md_files, 1):
            print(f"  {i:2d}. {f.stem}")
        print()
        idx = int(input("글 번호: ").strip()) - 1
        return parse_markdown(md_files[idx])

    elif choice == "3":
        print("\n  텍스트를 입력하세요 (빈 줄 2번으로 완료):\n")
        lines = []
        empty_count = 0
        while True:
            line = input()
            if line == "":
                empty_count += 1
                if empty_count >= 2:
                    break
                lines.append("")
            else:
                empty_count = 0
                lines.append(line)
        text = "\n".join(lines).strip()
        title = input("\n  제목: ").strip() or "직접입력"
        return {"title": title, "body": text, "frontmatter": {}}

    else:
        print("  잘못된 선택입니다.")
        sys.exit(1)


def select_images():
    """이미지 폴더 선택"""
    print_header("2단계: 이미지")
    print("  이미지 폴더 경로를 입력하세요.")
    print("  (없으면 Enter — AI가 Pexels 키워드로 대체합니다)")
    print()

    folder = input("이미지 폴더: ").strip()
    if not folder:
        return [], []

    files = get_image_files(folder)
    if not files:
        print(f"  ⚠ {folder}에 이미지가 없습니다. 이미지 없이 진행합니다.")
        return [], []

    # cover_ 접두어 파일 표시
    cover_files = [f for f in files if Path(f).name.startswith("cover")]
    other_files = [f for f in files if not Path(f).name.startswith("cover")]

    print(f"\n  발견된 이미지: {len(files)}개")
    if cover_files:
        print(f"  커버 후보: {len(cover_files)}개 ({', '.join(Path(f).name for f in cover_files)})")
    print(f"  본문용: {len(other_files)}개")

    # 이미지 분석
    descriptions = analyze_images(files)
    return files, descriptions


def select_platforms():
    """플랫폼 선택"""
    print_header("3단계: 플랫폼 선택")
    for key, name in PLATFORMS.items():
        print(f"  {key}. {PLATFORM_NAMES[name]}")
    print(f"  5. 전체")
    print()

    choice = input("선택 (쉼표로 구분, 예: 1,2): ").strip()
    if choice == "5":
        return list(PLATFORMS.values())

    selected = []
    for c in choice.split(","):
        c = c.strip()
        if c in PLATFORMS:
            selected.append(PLATFORMS[c])
    if not selected:
        print("  ⚠ 선택된 플랫폼이 없습니다. 전체로 진행합니다.")
        return list(PLATFORMS.values())

    return selected


def run_generation(source, image_descriptions, platforms, learnings):
    """선택된 플랫폼에 대해 콘텐츠 생성"""
    print_header("4단계: 생성 중")

    images_text = build_image_text(image_descriptions)
    results = {}

    for platform in platforms:
        learnings_text = build_learnings_text(learnings, platform)
        generator = GENERATORS[platform]
        try:
            results[platform] = generator(source, images_text, learnings_text)
        except Exception as e:
            print(f"  ❌ {PLATFORM_NAMES[platform]} 생성 실패: {e}")

    return results


def show_results(results):
    """결과 미리보기"""
    print_header("결과 미리보기")

    for platform, result in results.items():
        name = PLATFORM_NAMES[platform]
        print(f"\n  ── {name} ──\n")

        if platform == "carousel":
            cover = result.get("cover", {})
            slides = result.get("slides", [])
            print(f"  커버: {cover.get('title', '').replace(chr(10), ' ')}")
            print(f"  훅 숫자: {cover.get('hook_number', '-')}")
            print(f"  슬라이드: {len(slides)}개")
            for i, s in enumerate(slides, 1):
                print(f"    {i}. [{s.get('tag', '')}] {s.get('heading', '').replace(chr(10), ' ')[:40]}")

        elif platform == "naver":
            print(f"  제목: {result.get('title', '')}")
            sections = result.get("sections", [])
            print(f"  섹션: {len(sections)}개")
            total_len = sum(len(s.get("body", "")) for s in sections)
            print(f"  본문 길이: {total_len}자")
            print(f"  해시태그: {result.get('hashtags', '')[:60]}...")

        elif platform == "reels":
            scenes = result.get("scenes", [])
            total = result.get("total_duration", sum(s.get("end", 0) - s.get("start", 0) for s in scenes))
            print(f"  씬: {len(scenes)}개, 총 {total}초")
            for i, s in enumerate(scenes, 1):
                print(f"    {i}. [{s.get('tag', '')}] {s.get('start', 0)}-{s.get('end', 0)}초: {s.get('title', '').replace(chr(10), ' ')[:40]}")

        elif platform == "threads":
            text = result.get("text", "")
            print(f"  본문 ({len(text)}자):")
            print(f"  {text[:200]}{'...' if len(text) > 200 else ''}")
            print(f"  해시태그: {result.get('hashtags', '')}")

    print()


def feedback_loop(results, source, image_descriptions, learnings):
    """피드백 → 재생성 루프"""
    version = 1
    all_feedbacks = []
    version_history = {1: dict(results)}

    while True:
        print_header(f"5단계: 피드백 (v{version})")
        print("  각 플랫폼 결과물을 확인한 후 피드백을 입력하세요.")
        print("  OK면 Enter, 수정이 필요하면 피드백 입력.")
        print("  전체 승인하려면 '승인' 입력.")
        print()

        platforms_to_redo = []

        for platform in list(results.keys()):
            name = PLATFORM_NAMES[platform]
            fb = input(f"  [{name}] 피드백 (OK면 Enter): ").strip()
            if fb and fb != "승인":
                platforms_to_redo.append(platform)
                all_feedbacks.append({
                    "version": version,
                    "platform": platform,
                    "feedback": fb,
                })

        # 전체 피드백
        general_fb = input(f"\n  [전체] 추가 피드백 (없으면 Enter): ").strip()
        if general_fb == "승인":
            break
        if general_fb:
            for platform in results:
                all_feedbacks.append({
                    "version": version,
                    "platform": platform,
                    "feedback": general_fb,
                })
            platforms_to_redo = list(results.keys())

        if not platforms_to_redo:
            confirm = input("\n  모든 플랫폼 OK. 최종 승인하시겠습니까? [Y/n]: ").strip()
            if confirm.lower() != "n":
                break
            continue

        # 재생성
        version += 1
        print(f"\n  v{version} 재생성 중...")
        for platform in platforms_to_redo:
            fb_text = "\n".join(
                f['feedback'] for f in all_feedbacks
                if f['platform'] == platform and f['version'] == version - 1
            )
            if not fb_text:
                fb_text = general_fb or ""
            try:
                results[platform] = regenerate_with_feedback(
                    platform, results[platform], fb_text
                )
            except Exception as e:
                print(f"  ❌ {PLATFORM_NAMES[platform]} 재생성 실패: {e}")

        version_history[version] = dict(results)
        show_results(results)

    return results, all_feedbacks, version_history


def main():
    clear()
    print("═" * 50)
    print("  BDM Content Factory")
    print("  글 하나 → 캐러셀 + 네이버 + 릴스 + Threads")
    print("═" * 50)

    # API 키 확인
    if not os.getenv("OPENAI_API_KEY"):
        print("\n  ❌ OPENAI_API_KEY가 설정되지 않았습니다.")
        print(f"  {BASE_DIR / '.env'} 파일을 확인하세요.")
        sys.exit(1)

    # 학습 데이터 로드
    learnings = load_learnings()
    rules_count = len(learnings.get("rules", []))
    if rules_count > 0:
        print(f"\n  📚 누적 학습 규칙 {rules_count}개 로드됨")

    # 1. 소스 선택
    source = select_source()
    print(f"\n  ✓ 선택: {source['title']}")

    # 2. 이미지
    image_files, image_descriptions = select_images()

    # 3. 플랫폼
    platforms = select_platforms()
    print(f"\n  ✓ 플랫폼: {', '.join(PLATFORM_NAMES[p] for p in platforms)}")

    # 4. 생성
    results = run_generation(source, image_descriptions, platforms, learnings)
    if not results:
        print("\n  ❌ 생성된 결과물이 없습니다.")
        sys.exit(1)

    # 결과 미리보기
    show_results(results)

    # 세션 디렉토리 생성
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    slug = re.sub(r"[^가-힣a-zA-Z0-9]", "_", source["title"])[:30]
    session_dir = OUTPUT_DIR / f"{timestamp}_{slug}"

    # 5. 피드백 루프
    final_results, feedbacks, version_history = feedback_loop(
        results, source, image_descriptions, learnings
    )

    # 6. 저장
    print_header("6단계: 저장")

    session = {
        "created_at": datetime.now().isoformat(),
        "source_title": source["title"],
        "platforms": platforms,
        "images": [img["filename"] for img in image_descriptions],
        "results": version_history.get(1, {}),
        "final_results": final_results,
        "feedbacks": feedbacks,
        "versions": len(version_history),
    }

    save_session(session, session_dir)
    print(f"  ✓ 결과물 저장: {session_dir}")

    # 캐러셀 YAML 별도 저장 (make_carousel.py 호환)
    if "carousel" in final_results:
        yaml_path = session_dir / "carousel.yaml"
        save_carousel_yaml(final_results["carousel"], yaml_path)
        print(f"  ✓ 캐러셀 YAML: {yaml_path}")

    # 7. 학습 포인트 추출
    if feedbacks:
        print("\n  학습 포인트 추출 중...", end="", flush=True)
        new_learnings = extract_learnings_from_session(session)
        if new_learnings:
            for l in new_learnings:
                # 중복 체크
                existing_rules = [r["rule"] for r in learnings.get("rules", [])]
                if l["rule"] not in existing_rules:
                    learnings.setdefault("rules", []).append(l)
            save_learnings(learnings)
            print(f" ✓ ({len(new_learnings)}개)")
            for l in new_learnings:
                print(f"    📝 [{l['platform']}] {l['rule']}")
        else:
            print(" (추출된 규칙 없음)")

    # 완료
    print_header("완료!")
    print(f"  📂 출력 폴더: {session_dir}")
    print(f"  📊 플랫폼: {len(final_results)}개")
    print(f"  🔄 피드백 횟수: {len(feedbacks)}회")
    print(f"  📚 누적 학습 규칙: {len(learnings.get('rules', []))}개")
    print()

    # 다음 글 할지 물어보기
    again = input("  다른 글도 변환하시겠습니까? [y/N]: ").strip()
    if again.lower() == "y":
        main()


if __name__ == "__main__":
    main()
