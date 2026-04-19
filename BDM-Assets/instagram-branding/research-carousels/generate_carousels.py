#!/usr/bin/env python3
"""
BDM Lab 리서치 캐러셀 생성기
인스타그램 캐러셀 슬라이드 이미지 (1080x1350px, 4:5)
"""
import sys
sys.path.insert(0, '/Users/boramlim/Library/Python/3.9/lib/python/site-packages')

from PIL import Image, ImageDraw, ImageFont
import os

# ─── 설정 ─────────────────────────────────────────────
W, H = 1080, 1350
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# 색상
BG_DARK = "#0B1120"        # 진한 네이비
BG_CARD = "#111B2E"        # 카드 배경
ACCENT = "#059669"         # BDM 그린
ACCENT_LIGHT = "#10B981"
WHITE = "#FFFFFF"
GRAY = "#94A3B8"
LIGHT_GRAY = "#CBD5E1"
RED = "#EF4444"
YELLOW = "#FBBF24"
AMBER = "#F59E0B"
BORDER = "#1E293B"

# 폰트
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"

def font(size, index=0):
    """index: 0=Regular, 3=SemiBold, 6=Bold, 8=Heavy"""
    return ImageFont.truetype(FONT_PATH, size, index=index)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def draw_rounded_rect(draw, xy, radius, fill=None, outline=None, width=1):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_text_wrapped(draw, text, x, y, max_width, fnt, fill, line_spacing=1.4):
    """한글 텍스트 줄바꿈"""
    lines = []
    current = ""
    for char in text:
        if char == '\n':
            lines.append(current)
            current = ""
            continue
        test = current + char
        bbox = draw.textbbox((0, 0), test, font=fnt)
        if bbox[2] - bbox[0] > max_width:
            lines.append(current)
            current = char
        else:
            current = test
    if current:
        lines.append(current)

    total_y = y
    line_h = draw.textbbox((0, 0), "가Ag", font=fnt)[3] - draw.textbbox((0, 0), "가Ag", font=fnt)[1]
    for line in lines:
        draw.text((x, total_y), line, fill=fill, font=fnt)
        total_y += int(line_h * line_spacing)
    return total_y

def create_slide(bg_color=BG_DARK):
    img = Image.new("RGB", (W, H), hex_to_rgb(bg_color))
    draw = ImageDraw.Draw(img)
    return img, draw

def add_footer(draw, series_label="LAB RESEARCH", page=None, total=None):
    """하단 BDM Lab 브랜딩"""
    y = H - 80
    draw.line([(60, y), (W - 60, y)], fill=hex_to_rgb(BORDER), width=1)
    draw.text((60, y + 20), "BDM Lab", fill=hex_to_rgb(ACCENT), font=font(20, 6))
    draw.text((180, y + 20), f"· {series_label}", fill=hex_to_rgb(GRAY), font=font(20, 0))
    if page and total:
        page_text = f"{page}/{total}"
        bbox = draw.textbbox((0, 0), page_text, font=font(18, 0))
        draw.text((W - 60 - (bbox[2] - bbox[0]), y + 22), page_text, fill=hex_to_rgb(GRAY), font=font(18, 0))

def add_label(draw, text, x, y, bg_color=ACCENT, text_color="#000000"):
    """시리즈 라벨"""
    fnt = font(18, 6)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw_rounded_rect(draw, [x, y, x + tw + 24, y + th + 12], radius=6, fill=hex_to_rgb(bg_color))
    draw.text((x + 12, y + 6), text, fill=hex_to_rgb(text_color), font=fnt)

# ═══════════════════════════════════════════════════════
# 캐러셀 1: 치킨집 349개 데이터
# ═══════════════════════════════════════════════════════
def carousel_chicken():
    slides = []
    prefix = "chicken"
    N = 9

    # ─── Slide 1: 훅 ─────────
    img, d = create_slide()
    add_label(d, "LAB RESEARCH", 60, 80)
    draw_text_wrapped(d, "치킨집 349개의\n3년치 데이터를\n분석했습니다.", 60, 200, 900, font(62, 8), hex_to_rgb(WHITE), 1.3)
    d.text((60, 580), "n = 349 매장  |  3년  |  주간 거래 데이터", fill=hex_to_rgb(ACCENT), font=font(24, 3))
    draw_text_wrapped(d, "배달 매출을 결정하는 변수는\n리뷰도 경쟁도 아니었습니다.", 60, 680, 900, font(34, 3), hex_to_rgb(LIGHT_GRAY))
    # 데코: 큰 숫자
    d.text((60, 900), "349", fill=hex_to_rgb("#1E293B"), font=font(280, 8))
    add_footer(d, "LAB RESEARCH", 1, N)
    slides.append(img)

    # ─── Slide 2: 통념 ─────────
    img, d = create_slide()
    add_label(d, "통념", 60, 80, bg_color="#1E293B", text_color=GRAY)
    draw_text_wrapped(d, "프랜차이즈 본사가\n가장 먼저 보는 것:", 60, 180, 900, font(44, 6), hex_to_rgb(WHITE))
    # 리스트
    items = [
        ("1", "리뷰 별점 관리"),
        ("2", "유동 인구 분석"),
        ("3", "경쟁 매장 수"),
    ]
    y = 380
    for num, text in items:
        draw_rounded_rect(d, [60, y, W - 60, y + 100], radius=12, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(BORDER))
        d.text((100, y + 28), num, fill=hex_to_rgb(ACCENT), font=font(36, 8))
        d.text((160, y + 30), text, fill=hex_to_rgb(WHITE), font=font(32, 3))
        y += 130
    draw_text_wrapped(d, "이 직관을 데이터로 검증했습니다.", 60, y + 40, 900, font(28, 0), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH", 2, N)
    slides.append(img)

    # ─── Slide 3: 반전 ─────────
    img, d = create_slide()
    draw_text_wrapped(d, "데이터는\n다릅니다.", 60, 150, 900, font(64, 8), hex_to_rgb(WHITE), 1.2)
    # 변수 비교
    d.text((60, 420), "배달 매출 예측력 1위:", fill=hex_to_rgb(GRAY), font=font(26, 0))
    # 틀린 것들
    items_wrong = ["리뷰 별점", "경쟁 매장 수", "유동 인구"]
    y = 490
    for item in items_wrong:
        d.text((80, y), "✕", fill=hex_to_rgb(RED), font=font(28, 6))
        d.text((130, y), item, fill=hex_to_rgb("#64748B"), font=font(28, 0))
        d.line([(130, y + 18), (130 + len(item) * 20, y + 18)], fill=hex_to_rgb("#64748B"), width=2)
        y += 55
    # 맞는 것
    y += 20
    draw_rounded_rect(d, [60, y, W - 60, y + 120], radius=16, fill=hex_to_rgb(ACCENT), outline=None)
    d.text((100, y + 15), "1인 가구 비율", fill=hex_to_rgb("#000000"), font=font(42, 8))
    d.text((100, y + 72), "인구통계 변수가 압도적 1위", fill=hex_to_rgb("#064E3B"), font=font(22, 3))
    add_footer(d, "LAB RESEARCH", 3, N)
    slides.append(img)

    # ─── Slide 4: 왜 1인 가구? ─────────
    img, d = create_slide()
    add_label(d, "WHY", 60, 80)
    draw_text_wrapped(d, "왜 1인 가구인가?", 60, 180, 900, font(48, 8), hex_to_rgb(WHITE))
    draw_text_wrapped(d, "1인 가구의 배달 의존은\n'선택'이 아니라 '구조'입니다.", 60, 310, 900, font(32, 3), hex_to_rgb(LIGHT_GRAY))
    # 시각화: 바
    y = 500
    d.text((60, y), "한국 1인 가구 비율 추이", fill=hex_to_rgb(GRAY), font=font(22, 0))
    y += 50
    bars = [("2015", 27, GRAY), ("2019", 31, GRAY), ("2023", 35, ACCENT)]
    for label, val, color in bars:
        bar_width = int(val / 40 * 700)
        draw_rounded_rect(d, [60, y, 60 + bar_width, y + 55], radius=8, fill=hex_to_rgb(color))
        d.text((80, y + 12), f"{label}   {val}%", fill=hex_to_rgb(WHITE if color == ACCENT else "#0B1120"), font=font(26, 6))
        y += 80
    draw_text_wrapped(d, "신규 출점의 첫 번째 기준은\n유동 인구가 아니라,\n1인 가구 밀도여야 합니다.", 60, y + 30, 900, font(28, 3), hex_to_rgb(ACCENT_LIGHT))
    add_footer(d, "LAB RESEARCH", 4, N)
    slides.append(img)

    # ─── Slide 5: 채널별 차이 ─────────
    img, d = create_slide()
    add_label(d, "KEY FINDING", 60, 80)
    draw_text_wrapped(d, "같은 브랜드인데\n채널마다 다른 변수", 60, 180, 900, font(44, 8), hex_to_rgb(WHITE))
    # 테이블
    y = 380
    headers = ["채널", "핵심 변수"]
    rows = [
        ("배달", "1인 가구 비율", ACCENT),
        ("포장", "1인 가구 비율", ACCENT),
        ("매장 식사", "고령화 지수", AMBER),
    ]
    # 헤더
    draw_rounded_rect(d, [60, y, W - 60, y + 60], radius=0, fill=hex_to_rgb("#1E293B"))
    d.text((100, y + 15), headers[0], fill=hex_to_rgb(GRAY), font=font(24, 6))
    d.text((400, y + 15), headers[1], fill=hex_to_rgb(GRAY), font=font(24, 6))
    y += 70
    for channel, var, color in rows:
        draw_rounded_rect(d, [60, y, W - 60, y + 80], radius=0, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(BORDER))
        d.text((100, y + 22), channel, fill=hex_to_rgb(WHITE), font=font(28, 3))
        d.text((400, y + 22), var, fill=hex_to_rgb(color), font=font(28, 6))
        y += 90
    draw_text_wrapped(d, "같은 브랜드라도 채널 전략에 따라\n출점 기준이 완전히 달라야 합니다.", 60, y + 30, 900, font(26, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH", 5, N)
    slides.append(img)

    # ─── Slide 6: 리뷰의 진실 ─────────
    img, d = create_slide()
    draw_text_wrapped(d, "리뷰는\n생각보다\n덜 중요합니다.", 60, 150, 900, font(56, 8), hex_to_rgb(WHITE), 1.2)
    draw_text_wrapped(d, "GPT-4로 수만 건의 리뷰를\n음식 품질 / 서비스 / 가격 / 재구매\n4가지 주제로 분류했습니다.", 60, 500, 900, font(28, 3), hex_to_rgb(LIGHT_GRAY))
    draw_rounded_rect(d, [60, 700, W - 60, 900], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(BORDER))
    draw_text_wrapped(d, "리뷰 별점이 아니라\n리뷰 '내용' 중 음식 품질 감성만이\n매출과 유의미하게 연결됩니다.", 100, 730, 850, font(26, 3), hex_to_rgb(ACCENT_LIGHT))
    add_footer(d, "LAB RESEARCH", 6, N)
    slides.append(img)

    # ─── Slide 7: 실무 시사점 ─────────
    img, d = create_slide()
    add_label(d, "SO WHAT", 60, 80)
    draw_text_wrapped(d, "실무에서\n이걸 어떻게 쓸까?", 60, 180, 900, font(44, 8), hex_to_rgb(WHITE))
    items = [
        ("01", "신규 출점 시\n1인 가구 밀도를 1순위로"),
        ("02", "배달 vs. 매장 식사\n채널별로 출점 기준을 분리"),
        ("03", "리뷰 별점이 아니라\n음식 품질 감성만 관리"),
    ]
    y = 400
    for num, text in items:
        draw_rounded_rect(d, [60, y, W - 60, y + 140], radius=12, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(BORDER))
        d.text((100, y + 20), num, fill=hex_to_rgb(ACCENT), font=font(32, 8))
        draw_text_wrapped(d, text, 180, y + 20, 780, font(24, 3), hex_to_rgb(WHITE))
        y += 170
    add_footer(d, "LAB RESEARCH", 7, N)
    slides.append(img)

    # ─── Slide 8: 한계 ─────────
    img, d = create_slide()
    add_label(d, "LIMITATION", 60, 80, bg_color="#1E293B", text_color=GRAY)
    draw_text_wrapped(d, "이 연구의 한계", 60, 180, 900, font(40, 6), hex_to_rgb(WHITE))
    limits = [
        "단일 브랜드(치킨) 데이터 → 다른 업종에서도 같을까?",
        "2021~2023 팬데믹 기간 포함 → 정상 시기와 다를 수 있음",
        "변수 간 인과관계가 아닌 예측력(상관) 기반",
    ]
    y = 340
    for lim in limits:
        d.text((80, y), "·", fill=hex_to_rgb(AMBER), font=font(28, 6))
        draw_text_wrapped(d, lim, 120, y, 880, font(24, 0), hex_to_rgb(LIGHT_GRAY))
        y += 100
    draw_text_wrapped(d, "한계를 밝히는 것이\n연구의 신뢰를 만듭니다.", 60, y + 40, 900, font(28, 3), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH", 8, N)
    slides.append(img)

    # ─── Slide 9: CTA ─────────
    img, d = create_slide()
    draw_text_wrapped(d, "전체 분석 +\n데이터 시각화는\n프로필 링크에서", 60, 250, 900, font(52, 8), hex_to_rgb(WHITE), 1.3)
    d.text((60, 650), "bigdatamarketinglab.com", fill=hex_to_rgb(ACCENT), font=font(30, 6))
    draw_rounded_rect(d, [60, 750, W - 60, 870], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(ACCENT), width=2)
    draw_text_wrapped(d, "저장하고 나중에 다시 보세요\n동료에게 공유해주세요", 100, 780, 850, font(26, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH")
    slides.append(img)

    return prefix, slides


# ═══════════════════════════════════════════════════════
# 캐러셀 2: 자사 브랜드 카니발리제이션
# ═══════════════════════════════════════════════════════
def carousel_cannibalization():
    slides = []
    prefix = "cannibalization"
    N = 8

    # Slide 1: 훅
    img, d = create_slide()
    add_label(d, "LAB RESEARCH", 60, 80)
    draw_text_wrapped(d, "배달의민족에서\n우리 매장의\n진짜 경쟁자는", 60, 200, 900, font(56, 8), hex_to_rgb(WHITE), 1.3)
    draw_text_wrapped(d, "옆집 교촌이\n아닙니다.", 60, 580, 900, font(56, 8), hex_to_rgb(RED), 1.3)
    d.text((60, 800), "n = 349 매장  |  3년  |  배달 vs. 매장 식사", fill=hex_to_rgb(ACCENT), font=font(22, 3))
    add_footer(d, "LAB RESEARCH", 1, N)
    slides.append(img)

    # Slide 2: 오프라인 vs 배달앱
    img, d = create_slide()
    add_label(d, "구조 변화", 60, 80, bg_color="#1E293B", text_color=GRAY)
    draw_text_wrapped(d, "오프라인에서는\n거리가 보호막입니다.", 60, 180, 900, font(40, 6), hex_to_rgb(WHITE))
    # 오프라인 박스
    y = 380
    draw_rounded_rect(d, [60, y, W - 60, y + 160], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(BORDER))
    d.text((100, y + 20), "오프라인", fill=hex_to_rgb(GRAY), font=font(20, 3))
    draw_text_wrapped(d, "A매장 ←── 도보 15분 ──→ B매장\n고객이 물리적으로 분리됨", 100, y + 60, 850, font(24, 3), hex_to_rgb(LIGHT_GRAY))
    y += 200
    # 배달앱 박스
    draw_rounded_rect(d, [60, y, W - 60, y + 160], radius=16, fill=hex_to_rgb("#1C1917"), outline=hex_to_rgb(RED), width=2)
    d.text((100, y + 20), "배달앱", fill=hex_to_rgb(RED), font=font(20, 6))
    draw_text_wrapped(d, "A매장   B매장  ← 같은 화면에 동시 노출\n메뉴 같음. 가격 같음. 완벽한 대체재.", 100, y + 60, 850, font(24, 3), hex_to_rgb(WHITE))
    add_footer(d, "LAB RESEARCH", 2, N)
    slides.append(img)

    # Slide 3: 핵심 발견
    img, d = create_slide()
    draw_text_wrapped(d, "자사 브랜드가\n타 브랜드보다\n무섭습니다.", 60, 150, 900, font(52, 8), hex_to_rgb(WHITE), 1.3)
    y = 520
    draw_rounded_rect(d, [60, y, W - 60, y + 240], radius=16, fill=hex_to_rgb(BG_CARD))
    d.text((100, y + 20), "배달 매출 예측 기여도", fill=hex_to_rgb(GRAY), font=font(20, 0))
    # 바 차트
    d.text((100, y + 70), "모든 매장 (자사 포함)", fill=hex_to_rgb(WHITE), font=font(22, 3))
    draw_rounded_rect(d, [100, y + 105, 880, y + 130], radius=6, fill=hex_to_rgb(ACCENT))
    d.text((100, y + 145), "타 브랜드만", fill=hex_to_rgb(WHITE), font=font(22, 3))
    draw_rounded_rect(d, [100, y + 180, 600, y + 205], radius=6, fill=hex_to_rgb(GRAY))
    draw_text_wrapped(d, "차이 = 자사 브랜드 자기잠식 효과", 60, y + 260, 900, font(24, 6), hex_to_rgb(ACCENT_LIGHT))
    add_footer(d, "LAB RESEARCH", 3, N)
    slides.append(img)

    # Slide 4: 거리별 효과
    img, d = create_slide()
    add_label(d, "DATA", 60, 80)
    draw_text_wrapped(d, "100미터 이내가\n가장 치명적", 60, 180, 900, font(44, 8), hex_to_rgb(WHITE))
    y = 380
    distances = [("100m", 95, ACCENT), ("300m", 75, ACCENT), ("500m", 55, "#0D9488"), ("1km", 35, GRAY)]
    for label, pct, color in distances:
        d.text((60, y + 8), label, fill=hex_to_rgb(WHITE), font=font(24, 6))
        bar_w = int(pct / 100 * 650)
        draw_rounded_rect(d, [180, y, 180 + bar_w, y + 45], radius=6, fill=hex_to_rgb(color))
        y += 75
    draw_text_wrapped(d, "배달앱에서 100m 이내 매장은\n거의 동시에 노출됩니다.\n소비자가 같은 브랜드를 나란히 비교.", 60, y + 30, 900, font(24, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH", 4, N)
    slides.append(img)

    # Slide 5: 배달에서만
    img, d = create_slide()
    draw_text_wrapped(d, "배달에서만\n나타납니다.", 60, 200, 900, font(52, 8), hex_to_rgb(WHITE), 1.3)
    y = 460
    draw_rounded_rect(d, [60, y, 520, y + 140], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(RED), width=2)
    d.text((100, y + 20), "배달 채널", fill=hex_to_rgb(RED), font=font(22, 6))
    d.text((100, y + 60), "자기잠식 ✓", fill=hex_to_rgb(WHITE), font=font(30, 8))
    draw_rounded_rect(d, [560, y, W - 60, y + 140], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(ACCENT), width=2)
    d.text((600, y + 20), "매장 식사", fill=hex_to_rgb(ACCENT), font=font(22, 6))
    d.text((600, y + 60), "자기잠식 ✕", fill=hex_to_rgb(WHITE), font=font(30, 8))
    draw_text_wrapped(d, "오프라인 매장 식사에서는 효과 없음.\n물리적 거리가 여전히 보호막 역할.", 60, y + 200, 900, font(26, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH", 5, N)
    slides.append(img)

    # Slide 6: So What
    img, d = create_slide()
    add_label(d, "SO WHAT", 60, 80)
    draw_text_wrapped(d, "프랜차이즈 본사가\n바꿔야 할 질문", 60, 180, 900, font(40, 8), hex_to_rgb(WHITE))
    # Before/After
    y = 380
    draw_rounded_rect(d, [60, y, W - 60, y + 140], radius=16, fill=hex_to_rgb("#1C1917"), outline=hex_to_rgb(RED))
    d.text((100, y + 15), "기존", fill=hex_to_rgb(RED), font=font(18, 6))
    draw_text_wrapped(d, "\"이 동네에 경쟁 브랜드가 몇 개 있는가?\"", 100, y + 50, 850, font(24, 3), hex_to_rgb(LIGHT_GRAY))
    y += 180
    draw_rounded_rect(d, [60, y, W - 60, y + 140], radius=16, fill=hex_to_rgb("#064E3B"), outline=hex_to_rgb(ACCENT))
    d.text((100, y + 15), "새로운 질문", fill=hex_to_rgb(ACCENT), font=font(18, 6))
    draw_text_wrapped(d, "\"우리 매장이 몇 개 겹치는가?\n배달 반경이 겹치는가?\"", 100, y + 50, 850, font(24, 6), hex_to_rgb(WHITE))
    add_footer(d, "LAB RESEARCH", 6, N)
    slides.append(img)

    # Slide 7: 한계
    img, d = create_slide()
    add_label(d, "LIMITATION", 60, 80, bg_color="#1E293B", text_color=GRAY)
    draw_text_wrapped(d, "이 연구의 한계", 60, 180, 900, font(36, 6), hex_to_rgb(WHITE))
    limits = [
        "단일 브랜드(치킨) → 다른 업종은?",
        "배달앱 UI/UX 변화에 따라 달라질 수 있음",
        "소비자 개인 수준 데이터는 미포함",
    ]
    y = 340
    for lim in limits:
        d.text((80, y), "·", fill=hex_to_rgb(AMBER), font=font(26, 6))
        draw_text_wrapped(d, lim, 120, y, 880, font(24, 0), hex_to_rgb(LIGHT_GRAY))
        y += 90
    add_footer(d, "LAB RESEARCH", 7, N)
    slides.append(img)

    # Slide 8: CTA
    img, d = create_slide()
    draw_text_wrapped(d, "전체 분석은\n프로필 링크에서", 60, 300, 900, font(48, 8), hex_to_rgb(WHITE), 1.3)
    d.text((60, 560), "bigdatamarketinglab.com", fill=hex_to_rgb(ACCENT), font=font(28, 6))
    draw_text_wrapped(d, "저장 + 공유 부탁드립니다", 60, 650, 900, font(24, 3), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH")
    slides.append(img)

    return prefix, slides


# ═══════════════════════════════════════════════════════
# 캐러셀 3: 쿠팡 로켓와우
# ═══════════════════════════════════════════════════════
def carousel_rocketwow():
    slides = []
    prefix = "rocketwow"
    N = 8

    # Slide 1: 훅
    img, d = create_slide()
    add_label(d, "LAB RESEARCH", 60, 80)
    draw_text_wrapped(d, "쿠팡플레이\n때문에\n로켓와우에\n가입하는 사람은", 60, 200, 900, font(54, 8), hex_to_rgb(WHITE), 1.25)
    draw_text_wrapped(d, "없습니다.", 60, 680, 900, font(54, 8), hex_to_rgb(RED), 1.2)
    d.text((60, 820), "n = 4,597명  |  4년  |  카드 결제 데이터", fill=hex_to_rgb(ACCENT), font=font(22, 3))
    add_footer(d, "LAB RESEARCH", 1, N)
    slides.append(img)

    # Slide 2: 가설
    img, d = create_slide()
    add_label(d, "가설", 60, 80, bg_color="#1E293B", text_color=GRAY)
    draw_text_wrapped(d, "플랫폼이 믿는 것:", 60, 180, 900, font(40, 6), hex_to_rgb(WHITE))
    draw_text_wrapped(d, "\"OTT를 끼워 넣으면\n가입하겠지?\"", 60, 300, 900, font(36, 3), hex_to_rgb(LIGHT_GRAY))
    # 5 가설
    y = 500
    hypotheses = [
        ("총지출이 큰 사람", "✅", ACCENT),
        ("온라인 쇼핑 비중 높은 사람", "✕", RED),
        ("해당 플랫폼에 집중하는 사람", "✅", ACCENT),
        ("디지털 콘텐츠 많이 쓰는 사람", "✕", RED),
        ("오프라인 레저 많은 사람", "✕", RED),
    ]
    for hyp, result, color in hypotheses:
        d.text((80, y), result, fill=hex_to_rgb(color), font=font(24, 8))
        d.text((130, y), hyp, fill=hex_to_rgb(WHITE if color == ACCENT else GRAY), font=font(22, 3))
        y += 50
    d.text((60, y + 30), "5개 가설 중 2개만 살아남았습니다.", fill=hex_to_rgb(ACCENT_LIGHT), font=font(24, 6))
    add_footer(d, "LAB RESEARCH", 2, N)
    slides.append(img)

    # Slide 3: 핵심 발견 1
    img, d = create_slide()
    draw_text_wrapped(d, "이미 많이 쓰는\n사람이\n가입합니다.", 60, 150, 900, font(52, 8), hex_to_rgb(WHITE), 1.3)
    draw_rounded_rect(d, [60, 530, W - 60, 750], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(ACCENT), width=2)
    draw_text_wrapped(d, "멤버십은 '새로운 고객'을\n데려오는 도구가 아닙니다.\n\n이미 많이 쓰는 고객의 지출을\n'구조화'하는 도구입니다.", 100, 560, 850, font(26, 3), hex_to_rgb(WHITE))
    add_footer(d, "LAB RESEARCH", 3, N)
    slides.append(img)

    # Slide 4: OTT 번들링 실패
    img, d = create_slide()
    draw_text_wrapped(d, "OTT 번들링은\n효과가 없었습니다.", 60, 180, 900, font(46, 8), hex_to_rgb(WHITE))
    y = 400
    draw_rounded_rect(d, [60, y, W - 60, y + 200], radius=16, fill=hex_to_rgb("#1C1917"), outline=hex_to_rgb(RED))
    draw_text_wrapped(d, "디지털 콘텐츠(OTT, 음악, 웹툰)\n지출이 높은 사람이\n멤버십에 가입할 확률:", 100, y + 30, 850, font(26, 3), hex_to_rgb(LIGHT_GRAY))
    d.text((100, y + 140), "통계적으로 유의하지 않음", fill=hex_to_rgb(RED), font=font(28, 8))
    draw_text_wrapped(d, "쿠팡플레이 때문에 로켓와우에 가입?\n네이버 시리즈온 때문에 플러스 멤버십?\n→ 데이터는 '아니오'라고 답합니다.", 60, y + 260, 900, font(24, 3), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH", 4, N)
    slides.append(img)

    # Slide 5: 그러면 뭐가?
    img, d = create_slide()
    add_label(d, "KEY", 60, 80)
    draw_text_wrapped(d, "그러면 뭐가\n가입을 결정하나?", 60, 180, 900, font(44, 8), hex_to_rgb(WHITE))
    y = 400
    items = [
        ("집중도", "해당 플랫폼 지출 비중이 높은 사람.\n'여기저기'가 아니라 '여기만' 쓰는 사람."),
        ("총지출", "전체 소비 규모가 큰 사람.\n절약이 아니라 효율화를 위해 가입."),
    ]
    for title, desc in items:
        draw_rounded_rect(d, [60, y, W - 60, y + 170], radius=16, fill=hex_to_rgb(BG_CARD), outline=hex_to_rgb(ACCENT), width=1)
        d.text((100, y + 20), title, fill=hex_to_rgb(ACCENT), font=font(30, 8))
        draw_text_wrapped(d, desc, 100, y + 70, 850, font(22, 0), hex_to_rgb(LIGHT_GRAY))
        y += 200
    add_footer(d, "LAB RESEARCH", 5, N)
    slides.append(img)

    # Slide 6: 팬데믹 vs 엔데믹
    img, d = create_slide()
    add_label(d, "시기별 차이", 60, 80, bg_color="#1E293B", text_color=GRAY)
    draw_text_wrapped(d, "팬데믹 때는 달랐다", 60, 180, 900, font(40, 8), hex_to_rgb(WHITE))
    y = 350
    draw_rounded_rect(d, [60, y, 510, y + 200], radius=16, fill=hex_to_rgb(BG_CARD))
    d.text((100, y + 20), "2020-2021", fill=hex_to_rgb(GRAY), font=font(18, 3))
    d.text((100, y + 50), "팬데믹", fill=hex_to_rgb(WHITE), font=font(28, 8))
    draw_text_wrapped(d, "오프라인 불가\n→ 온라인 비중만으로\n가입 예측 가능", 100, y + 100, 380, font(20, 0), hex_to_rgb(LIGHT_GRAY))
    draw_rounded_rect(d, [540, y, W - 60, y + 200], radius=16, fill=hex_to_rgb(BG_CARD))
    d.text((580, y + 20), "2022-2023", fill=hex_to_rgb(GRAY), font=font(18, 3))
    d.text((580, y + 50), "엔데믹", fill=hex_to_rgb(WHITE), font=font(28, 8))
    draw_text_wrapped(d, "선택지 복귀\n→ 플랫폼 집중도가\n핵심 예측 변수", 580, y + 100, 380, font(20, 0), hex_to_rgb(LIGHT_GRAY))
    draw_text_wrapped(d, "시기에 따라 가입 동인이 달라집니다.\n동일한 전략을 유지하면 안 됩니다.", 60, y + 260, 900, font(24, 3), hex_to_rgb(ACCENT_LIGHT))
    add_footer(d, "LAB RESEARCH", 6, N)
    slides.append(img)

    # Slide 7: So What
    img, d = create_slide()
    add_label(d, "SO WHAT", 60, 80)
    draw_text_wrapped(d, "멤버십 전략을\n바꿔야 합니다", 60, 180, 900, font(42, 8), hex_to_rgb(WHITE))
    items = [
        ("01", "OTT 번들링에 마케팅 비용 쓰지 마세요"),
        ("02", "이미 집중 구매하는 고객을 타겟하세요"),
        ("03", "시기별로 전략을 달리 하세요"),
    ]
    y = 400
    for num, text in items:
        draw_rounded_rect(d, [60, y, W - 60, y + 100], radius=12, fill=hex_to_rgb(BG_CARD))
        d.text((100, y + 28), num, fill=hex_to_rgb(ACCENT), font=font(30, 8))
        d.text((180, y + 30), text, fill=hex_to_rgb(WHITE), font=font(24, 3))
        y += 130
    add_footer(d, "LAB RESEARCH", 7, N)
    slides.append(img)

    # Slide 8: CTA
    img, d = create_slide()
    draw_text_wrapped(d, "전체 분석은\n프로필 링크에서", 60, 300, 900, font(48, 8), hex_to_rgb(WHITE), 1.3)
    d.text((60, 560), "bigdatamarketinglab.com", fill=hex_to_rgb(ACCENT), font=font(28, 6))
    draw_text_wrapped(d, "저장 + 공유 부탁드립니다", 60, 650, 900, font(24, 3), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH")
    slides.append(img)

    return prefix, slides


# ═══════════════════════════════════════════════════════
# 캐러셀 4: 새벽배송 효과
# ═══════════════════════════════════════════════════════
def carousel_dawn_delivery():
    slides = []
    prefix = "dawn_delivery"
    N = 8

    # Slide 1: 훅
    img, d = create_slide()
    add_label(d, "LAB RESEARCH", 60, 80)
    draw_text_wrapped(d, "새벽배송이\n매출을 올리는\n조건이 있습니다.", 60, 200, 900, font(54, 8), hex_to_rgb(WHITE), 1.3)
    d.text((60, 600), "n = 920명  |  실제 구매 데이터", fill=hex_to_rgb(ACCENT), font=font(24, 3))
    draw_text_wrapped(d, "그 조건은 대부분의 리테일러가\n간과하고 있습니다.", 60, 700, 900, font(30, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH", 1, N)
    slides.append(img)

    # Slide 2: 전체 효과
    img, d = create_slide()
    draw_text_wrapped(d, "새벽배송을 쓰면\n더 많이 삽니다.", 60, 180, 900, font(44, 8), hex_to_rgb(WHITE))
    y = 400
    metrics = [
        ("주 평균 지출", "12,000원 → 14,500원", "+21%"),
        ("주 평균 쇼핑 횟수", "0.39회 → 0.50회", "+28%"),
    ]
    for label, change, pct in metrics:
        draw_rounded_rect(d, [60, y, W - 60, y + 130], radius=16, fill=hex_to_rgb(BG_CARD))
        d.text((100, y + 20), label, fill=hex_to_rgb(GRAY), font=font(20, 0))
        d.text((100, y + 55), change, fill=hex_to_rgb(WHITE), font=font(26, 3))
        d.text((800, y + 50), pct, fill=hex_to_rgb(ACCENT), font=font(30, 8))
        y += 160
    draw_text_wrapped(d, "여기까지는 직관대로.\n하지만 진짜 발견은 다음 장.", 60, y + 20, 900, font(24, 3), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH", 2, N)
    slides.append(img)

    # Slide 3: 핵심 반전
    img, d = create_slide()
    draw_text_wrapped(d, "근처에\n오프라인 매장이\n있어야 합니다.", 60, 150, 900, font(52, 8), hex_to_rgb(WHITE), 1.3)
    y = 500
    # 비교
    draw_rounded_rect(d, [60, y, 510, y + 200], radius=16, fill=hex_to_rgb("#1C1917"), outline=hex_to_rgb(RED))
    d.text((100, y + 20), "오프라인 매장 없음", fill=hex_to_rgb(RED), font=font(20, 6))
    d.text((100, y + 70), "효과 없음", fill=hex_to_rgb(WHITE), font=font(36, 8))
    d.text((100, y + 130), "통계적으로 유의하지 않음", fill=hex_to_rgb(GRAY), font=font(18, 0))

    draw_rounded_rect(d, [540, y, W - 60, y + 200], radius=16, fill=hex_to_rgb("#064E3B"), outline=hex_to_rgb(ACCENT))
    d.text((580, y + 20), "오프라인 매장 있음", fill=hex_to_rgb(ACCENT), font=font(20, 6))
    d.text((580, y + 70), "+78%", fill=hex_to_rgb(WHITE), font=font(48, 8))
    d.text((580, y + 140), "주 +10,556원 지출 증가", fill=hex_to_rgb(ACCENT_LIGHT), font=font(18, 3))
    add_footer(d, "LAB RESEARCH", 3, N)
    slides.append(img)

    # Slide 4: 왜?
    img, d = create_slide()
    add_label(d, "WHY", 60, 80)
    draw_text_wrapped(d, "왜 오프라인이\n온라인을 밀어주는가?", 60, 180, 900, font(42, 8), hex_to_rgb(WHITE))
    d.text((60, 380), "핵심 키워드:", fill=hex_to_rgb(GRAY), font=font(22, 0))
    d.text((60, 420), "신 뢰 전 이", fill=hex_to_rgb(ACCENT), font=font(56, 8))
    draw_text_wrapped(d, "신선식품은 극도의 경험재.\n사진만 보고 수박의 당도를\n판단할 수 없습니다.\n\n오프라인 매장에서 쌓은 품질 신뢰가\n온라인 구매의 불확실성을 상쇄합니다.", 60, 560, 900, font(26, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH", 4, N)
    slides.append(img)

    # Slide 5: 비대칭
    img, d = create_slide()
    draw_text_wrapped(d, "신뢰 전이는\n한 방향입니다.", 60, 180, 900, font(44, 8), hex_to_rgb(WHITE))
    y = 400
    draw_rounded_rect(d, [60, y, W - 60, y + 120], radius=16, fill=hex_to_rgb("#064E3B"))
    d.text((100, y + 15), "오프라인 → 온라인", fill=hex_to_rgb(ACCENT), font=font(20, 6))
    d.text((100, y + 55), "신뢰가 전이됨 ✓", fill=hex_to_rgb(WHITE), font=font(28, 8))
    y += 160
    draw_rounded_rect(d, [60, y, W - 60, y + 120], radius=16, fill=hex_to_rgb("#1C1917"))
    d.text((100, y + 15), "온라인 → 오프라인", fill=hex_to_rgb(RED), font=font(20, 6))
    d.text((100, y + 55), "신뢰 전이 안 됨 ✕", fill=hex_to_rgb(GRAY), font=font(28, 8))
    draw_text_wrapped(d, "온라인에서 아무리 좋은 경험을 해도\n오프라인 매장 방문으로 이어지지 않습니다.", 60, y + 180, 900, font(24, 3), hex_to_rgb(LIGHT_GRAY))
    add_footer(d, "LAB RESEARCH", 5, N)
    slides.append(img)

    # Slide 6: 총지출 파이
    img, d = create_slide()
    add_label(d, "INSIGHT", 60, 80)
    draw_text_wrapped(d, "시장을 키우는 게 아니라\n경쟁사에서 뺏어옵니다.", 60, 180, 900, font(38, 8), hex_to_rgb(WHITE))
    y = 400
    draw_rounded_rect(d, [60, y, W - 60, y + 200], radius=16, fill=hex_to_rgb(BG_CARD))
    draw_text_wrapped(d, "총 식료품 지출: 월 24~25만원으로 고정\n\n새벽배송 전: 이 리테일러 20% / 타사 80%\n새벽배송 후: 이 리테일러 35% / 타사 65%", 100, y + 30, 850, font(24, 3), hex_to_rgb(LIGHT_GRAY))
    draw_text_wrapped(d, "월렛 셰어(Wallet Share) 전환입니다.\n파이를 키운 게 아니라 파이 안에서 비중을 빼앗은 것.", 60, y + 240, 900, font(24, 3), hex_to_rgb(ACCENT_LIGHT))
    add_footer(d, "LAB RESEARCH", 6, N)
    slides.append(img)

    # Slide 7: So What
    img, d = create_slide()
    add_label(d, "SO WHAT", 60, 80)
    draw_text_wrapped(d, "새벽배송 투자\n어디에 집중할까?", 60, 180, 900, font(40, 8), hex_to_rgb(WHITE))
    items = [
        ("01", "오프라인 매장 주변 고객부터 타겟"),
        ("02", "온라인 전용 브랜드는 신뢰 구축이 선행"),
        ("03", "옴니채널 시너지를 ROI 계산에 반영"),
    ]
    y = 400
    for num, text in items:
        draw_rounded_rect(d, [60, y, W - 60, y + 100], radius=12, fill=hex_to_rgb(BG_CARD))
        d.text((100, y + 28), num, fill=hex_to_rgb(ACCENT), font=font(30, 8))
        d.text((180, y + 30), text, fill=hex_to_rgb(WHITE), font=font(24, 3))
        y += 130
    d.text((60, y + 30), "연간 고객 1인당 추가 매출: 약 55만원", fill=hex_to_rgb(ACCENT), font=font(24, 6))
    add_footer(d, "LAB RESEARCH", 7, N)
    slides.append(img)

    # Slide 8: CTA
    img, d = create_slide()
    draw_text_wrapped(d, "전체 분석은\n프로필 링크에서", 60, 300, 900, font(48, 8), hex_to_rgb(WHITE), 1.3)
    d.text((60, 560), "bigdatamarketinglab.com", fill=hex_to_rgb(ACCENT), font=font(28, 6))
    draw_text_wrapped(d, "저장 + 공유 부탁드립니다", 60, 650, 900, font(24, 3), hex_to_rgb(GRAY))
    add_footer(d, "LAB RESEARCH")
    slides.append(img)

    return prefix, slides


# ═══════════════════════════════════════════════════════
# 실행
# ═══════════════════════════════════════════════════════
if __name__ == "__main__":
    carousels = [
        carousel_chicken,
        carousel_cannibalization,
        carousel_rocketwow,
        carousel_dawn_delivery,
    ]

    for func in carousels:
        prefix, slides = func()
        carousel_dir = os.path.join(OUTPUT_DIR, prefix)
        os.makedirs(carousel_dir, exist_ok=True)
        for i, slide in enumerate(slides, 1):
            path = os.path.join(carousel_dir, f"slide_{i:02d}.png")
            slide.save(path, quality=95)
            print(f"  ✓ {path}")
        print(f"✅ {prefix}: {len(slides)} slides")
    print("\n🎉 모든 캐러셀 생성 완료!")
