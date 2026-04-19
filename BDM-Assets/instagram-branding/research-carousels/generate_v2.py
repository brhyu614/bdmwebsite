#!/usr/bin/env python3
"""
BDM Lab 리서치 캐러셀 v2
검은색 배경 + 기존 인스타 톤 통일
"""
import sys
sys.path.insert(0, '/Users/boramlim/Library/Python/3.9/lib/python/site-packages')

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1350
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# 색상 — 검은색 기반
BG = "#000000"
BG_CARD = "#111111"
ACCENT = "#059669"
ACCENT_LIGHT = "#10B981"
WHITE = "#FFFFFF"
GRAY = "#999999"
LIGHT_GRAY = "#CCCCCC"
RED = "#EF4444"
YELLOW = "#FBBF24"
BORDER = "#222222"
DIM = "#666666"

FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"

def font(size, index=0):
    """0=Regular, 3=SemiBold, 6=Bold, 8=Heavy"""
    return ImageFont.truetype(FONT_PATH, size, index=index)

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

C = hex_to_rgb

def create_slide():
    img = Image.new("RGB", (W, H), C(BG))
    draw = ImageDraw.Draw(img)
    return img, draw

def draw_text_wrapped(draw, text, x, y, max_width, fnt, fill, line_spacing=1.4):
    lines = []
    for paragraph in text.split('\n'):
        if paragraph == '':
            lines.append('')
            continue
        current = ""
        for char in paragraph:
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
        if line == '':
            total_y += int(line_h * 0.6)
            continue
        draw.text((x, total_y), line, fill=fill, font=fnt)
        total_y += int(line_h * line_spacing)
    return total_y

def add_label(draw, text, x, y):
    fnt = font(18, 6)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.rounded_rectangle([x, y, x + tw + 24, y + th + 14], radius=6, fill=C(ACCENT))
    draw.text((x + 12, y + 7), text, fill=C("#000000"), font=fnt)

def add_dim_label(draw, text, x, y):
    fnt = font(18, 6)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.rounded_rectangle([x, y, x + tw + 24, y + th + 14], radius=6, fill=C("#1A1A1A"), outline=C("#333333"))
    draw.text((x + 12, y + 7), text, fill=C(GRAY), font=fnt)

def footer(draw, page=None, total=None):
    y = H - 90
    draw.line([(70, y), (W - 70, y)], fill=C("#222222"), width=1)
    # 로고
    draw.text((70, y + 25), "BDM Lab", fill=C(ACCENT), font=font(22, 6))
    draw.text((200, y + 27), "빅데이터 마케팅 랩", fill=C(DIM), font=font(18, 0))
    if page and total:
        pt = f"{page} / {total}"
        bbox = draw.textbbox((0, 0), pt, font=font(18, 0))
        draw.text((W - 70 - (bbox[2] - bbox[0]), y + 27), pt, fill=C(DIM), font=font(18, 0))


# ═══════════════════════════════════════════════════════
# 캐러셀 1: 치킨집 배달 매출
# ═══════════════════════════════════════════════════════
def carousel_1():
    slides = []
    N = 8

    # ── 1. 타이틀 ──
    img, d = create_slide()
    add_label(d, "BDM Lab Data Report", 70, 100)
    draw_text_wrapped(d, "치킨집 349개의\n3년치 데이터를\n분석했습니다.", 70, 240, 940, font(58, 8), C(WHITE), 1.25)
    draw_text_wrapped(d, "배달 매출을 결정하는 건\n리뷰가 아니었습니다.", 70, 620, 940, font(40, 6), C(YELLOW), 1.3)
    # 데코 숫자
    d.text((70, 950), "349", fill=C("#111111"), font=font(260, 8))
    footer(d, 1, N)
    slides.append(img)

    # ── 2. HOOK ──
    img, d = create_slide()
    add_dim_label(d, "HOOK", 70, 100)
    draw_text_wrapped(d, "매장을 열 때\n사장님들이 가장\n신경 쓰는 두 가지.", 70, 200, 940, font(46, 8), C(WHITE), 1.3)
    # 인용 박스
    y = 560
    draw_text_wrapped(d, "\"주변에 경쟁 매장이\n얼마나 있나?\"", 70, y, 940, font(34, 3), C(LIGHT_GRAY), 1.3)
    y2 = 730
    draw_text_wrapped(d, "\"배달앱 별점 관리는\n어떻게 하지?\"", 70, y2, 940, font(34, 3), C(LIGHT_GRAY), 1.3)
    footer(d, 2, N)
    slides.append(img)

    # ── 3. CONTEXT ──
    img, d = create_slide()
    draw_text_wrapped(d, "BDM Lab이\n349개 치킨 매장의\n3년치 거래 데이터와", 70, 180, 940, font(42, 6), C(WHITE), 1.3)
    draw_text_wrapped(d, "10만 건의 리뷰를\n데이터로 검증해 보았습니다.", 70, 500, 940, font(42, 6), C(ACCENT_LIGHT), 1.3)
    draw_text_wrapped(d, "우리의 상식은\n맞았을까요?", 70, 750, 940, font(42, 8), C(WHITE), 1.3)
    footer(d, 3, N)
    slides.append(img)

    # ── 4. INSIGHT 1: 상식의 배신 ──
    img, d = create_slide()
    add_dim_label(d, "INSIGHT 1", 70, 100)
    draw_text_wrapped(d, "결과는 직관을\n완전히 뒤집었습니다.", 70, 200, 940, font(46, 8), C(WHITE), 1.3)
    y = 460
    draw_text_wrapped(d, "주변 경쟁 매장의 숫자도,\n목숨 걸고 사수하는\n'리뷰 별점'도", 70, y, 940, font(32, 3), C(LIGHT_GRAY), 1.35)
    draw_text_wrapped(d, "배달 매출의 절대적 지배자는\n아니었습니다.", 70, y + 220, 940, font(34, 6), C(YELLOW), 1.3)
    footer(d, 4, N)
    slides.append(img)

    # ── 5. INSIGHT 2: 진짜 지배자 ──
    img, d = create_slide()
    add_dim_label(d, "INSIGHT 2", 70, 100)
    draw_text_wrapped(d, "수십 개의 변수를 제치고\n배달 매출을 지배한\n압도적인 1위 변수.", 70, 200, 940, font(38, 6), C(WHITE), 1.35)
    draw_text_wrapped(d, "그것은 바로\n그 동네의 '인구 구성',\n특히", 70, 520, 940, font(34, 3), C(LIGHT_GRAY), 1.35)
    # 강조 박스
    y = 750
    d.rounded_rectangle([50, y, W - 50, y + 120], radius=16, fill=C(ACCENT))
    draw_text_wrapped(d, "'1인 가구 비율'", 70, y + 25, 900, font(48, 8), C("#000000"))
    draw_text_wrapped(d, "이었습니다.", 70, y + 150, 940, font(34, 3), C(LIGHT_GRAY))
    footer(d, 5, N)
    slides.append(img)

    # ── 6. WHY ──
    img, d = create_slide()
    add_dim_label(d, "WHY", 70, 100)
    draw_text_wrapped(d, "옴니채널, 배달앱 시대라지만\n결국 본질은 다릅니다.", 70, 200, 940, font(38, 6), C(WHITE), 1.35)
    draw_text_wrapped(d, "온라인에서 아무리\n마케팅을 잘해도", 70, 430, 940, font(32, 3), C(LIGHT_GRAY), 1.35)
    draw_text_wrapped(d, "결국 내 매장 주변에\n'사람이 얼마나 사느냐',\n특히", 70, 590, 940, font(32, 3), C(LIGHT_GRAY), 1.35)
    draw_text_wrapped(d, "'1인 가구가 얼마나\n밀집해 있느냐'가\n배달 수요의 절대량을\n결정짓습니다.", 70, 790, 940, font(34, 6), C(ACCENT_LIGHT), 1.3)
    footer(d, 6, N)
    slides.append(img)

    # ── 7. ACTION ──
    img, d = create_slide()
    add_dim_label(d, "ACTION", 70, 100)
    draw_text_wrapped(d, "리뷰 별점 0.1점에\n집착하기 전에\n이 팩트를 인정해야 합니다.", 70, 200, 940, font(38, 6), C(WHITE), 1.35)
    draw_text_wrapped(d, "배달 매출의\n진짜 상한선(천장)은", 70, 500, 940, font(32, 3), C(LIGHT_GRAY), 1.35)
    draw_text_wrapped(d, "사장님의 마케팅 노력 이전에,\n'매장을 오픈하는 그 순간,\n그 위치의 인구 구성'이\n이미 결정해 버립니다.", 70, 660, 940, font(34, 6), C(YELLOW), 1.3)
    footer(d, 7, N)
    slides.append(img)

    # ── 8. OUTRO / CTA ──
    img, d = create_slide()
    draw_text_wrapped(d, "가짜 직관을 버리고\n진짜 데이터를\n읽어야 할 때.", 70, 300, 940, font(46, 8), C(WHITE), 1.3)
    d.text((70, 680), "bigdatamarketinglab.com", fill=C(ACCENT), font=font(26, 6))
    # 하단 BDM Lab 브랜딩
    y = 850
    d.text((70, y), "BDM Lab", fill=C(ACCENT), font=font(36, 8))
    d.text((70, y + 50), "빅데이터 마케팅 랩", fill=C(DIM), font=font(22, 0))
    footer(d)
    slides.append(img)

    return "carousel_1_chicken", slides


# ═══════════════════════════════════════════════════════
# 캐러셀 2: 10만 건 리뷰
# ═══════════════════════════════════════════════════════
def carousel_2():
    slides = []
    N = 8

    # ── 1. 타이틀 ──
    img, d = create_slide()
    add_label(d, "BDM Lab Data Report", 70, 100)
    draw_text_wrapped(d, "10만 건의 리뷰\n데이터를\n분석했습니다.", 70, 240, 940, font(58, 8), C(WHITE), 1.25)
    draw_text_wrapped(d, "매출이 높은 치킨집의 리뷰는\n따로 있었습니다.", 70, 620, 940, font(38, 6), C(YELLOW), 1.3)
    footer(d, 1, N)
    slides.append(img)

    # ── 2. HOOK ──
    img, d = create_slide()
    add_dim_label(d, "HOOK", 70, 100)
    draw_text_wrapped(d, "\"리뷰 관리는\n무조건 중요해!\"", 70, 220, 940, font(46, 8), C(WHITE), 1.3)
    draw_text_wrapped(d, "반은 맞고\n반은 틀립니다.", 70, 500, 940, font(38, 6), C(YELLOW), 1.3)
    draw_text_wrapped(d, "어디서 어떻게 파느냐에 따라\n리뷰의 파급력은\n완전히 달랐습니다.", 70, 700, 940, font(32, 3), C(LIGHT_GRAY), 1.35)
    footer(d, 2, N)
    slides.append(img)

    # ── 3. INSIGHT 1: 거리와 리뷰 ──
    img, d = create_slide()
    add_dim_label(d, "INSIGHT 1", 70, 100)
    draw_text_wrapped(d, "리뷰의 중요성은\n고객의 '경험 거리'에\n비례합니다.", 70, 200, 940, font(40, 8), C(WHITE), 1.3)
    # 시각화
    y = 530
    items = [
        ("매장 내 식사", "직접 경험 → 리뷰 의존 낮음", DIM),
        ("픽업", "매장만 방문 → 중간", GRAY),
        ("배달", "매장을 모름 → 리뷰에 극도로 의존", ACCENT),
    ]
    for label, desc, color in items:
        d.rounded_rectangle([70, y, W - 70, y + 100], radius=12, fill=C("#111111"), outline=C("#222222"))
        d.text((100, y + 15), label, fill=C(color), font=font(26, 6))
        d.text((100, y + 55), desc, fill=C(LIGHT_GRAY), font=font(18, 0))
        y += 120
    footer(d, 3, N)
    slides.append(img)

    # ── 4. INSIGHT 2: 배달의 유일한 단서 ──
    img, d = create_slide()
    add_dim_label(d, "INSIGHT 2", 70, 100)
    draw_text_wrapped(d, "매장에 직접 방문하는 손님은\n리뷰에 덜 의존합니다.", 70, 200, 940, font(34, 6), C(LIGHT_GRAY), 1.35)
    draw_text_wrapped(d, "하지만 매장을\n눈으로 볼 수 없는\n배달 고객에게", 70, 400, 940, font(36, 6), C(WHITE), 1.35)
    draw_text_wrapped(d, "리뷰는 유일한\n시각적, 미각적 단서입니다.", 70, 640, 940, font(40, 8), C(YELLOW), 1.3)
    draw_text_wrapped(d, "배달일수록\n리뷰는 생명줄이 됩니다.", 70, 860, 940, font(32, 3), C(LIGHT_GRAY), 1.3)
    footer(d, 4, N)
    slides.append(img)

    # ── 5. PROBLEM ──
    img, d = create_slide()
    add_dim_label(d, "PROBLEM", 70, 100)
    draw_text_wrapped(d, "그렇다면\n어떤 리뷰가\n돈이 되는가?", 70, 250, 940, font(50, 8), C(WHITE), 1.25)
    draw_text_wrapped(d, "BDM Lab이 10만 건의 리뷰를\n4가지 주제로 쪼개 보았습니다.", 70, 600, 940, font(30, 3), C(LIGHT_GRAY), 1.35)
    # 4가지
    y = 770
    topics = ["가격", "서비스", "재구매", "음식 품질"]
    x = 70
    for t in topics:
        fnt = font(22, 6)
        bbox = d.textbbox((0, 0), t, font=fnt)
        tw = bbox[2] - bbox[0]
        d.rounded_rectangle([x, y, x + tw + 30, y + 44], radius=8, fill=C("#111111"), outline=C("#333333"))
        d.text((x + 15, y + 10), t, fill=C(GRAY), font=fnt)
        x += tw + 50
    footer(d, 5, N)
    slides.append(img)

    # ── 6. INSIGHT 3: 음식 품질 ──
    img, d = create_slide()
    add_dim_label(d, "INSIGHT 3", 70, 100)
    draw_text_wrapped(d, "정답은", 70, 220, 940, font(36, 6), C(LIGHT_GRAY))
    draw_text_wrapped(d, "'음식 품질에 대한\n구체적 언급'", 70, 300, 940, font(46, 8), C(ACCENT_LIGHT), 1.25)
    draw_text_wrapped(d, "이었습니다.", 70, 490, 940, font(36, 6), C(LIGHT_GRAY))
    draw_text_wrapped(d, "친절하다는 서비스 칭찬이나\n가격 언급보다,", 70, 620, 940, font(30, 3), C(GRAY), 1.35)
    # 강조 인용
    d.rounded_rectangle([50, 760, W - 50, 960], radius=16, fill=C("#111111"), outline=C(ACCENT), width=2)
    draw_text_wrapped(d, "\"치킨이 바삭하다\"\n\"양념이 미쳤다\"", 100, 790, 860, font(36, 8), C(WHITE), 1.3)
    draw_text_wrapped(d, "는 리뷰가 많은 매장이\n배달 매출을 올렸습니다.", 70, 990, 940, font(30, 3), C(LIGHT_GRAY), 1.35)
    footer(d, 6, N)
    slides.append(img)

    # ── 7. ACTION ──
    img, d = create_slide()
    add_dim_label(d, "ACTION", 70, 100)
    draw_text_wrapped(d, "리뷰 이벤트의\n공식을 바꿔야 합니다.", 70, 200, 940, font(42, 8), C(WHITE), 1.3)
    draw_text_wrapped(d, "\"리뷰 쓰면 치킨 1조각 추가\"\n→ 별점만 올라감, 매출과 무관", 70, 430, 940, font(28, 3), C(GRAY), 1.4)
    draw_text_wrapped(d, "진짜 해야 할 것:", 70, 600, 940, font(30, 6), C(WHITE), 1.3)
    draw_text_wrapped(d, "음식 맛에 대해\n구체적으로 언급하게 만드는 것.", 70, 680, 940, font(34, 6), C(YELLOW), 1.3)
    draw_text_wrapped(d, "\"어떤 메뉴가 가장 맛있었나요?\"\n\"바삭함은 어떠셨나요?\"\n\n별점 숫자가 아니라\n리뷰 안의 '내용'이 매출입니다.", 70, 850, 940, font(28, 3), C(LIGHT_GRAY), 1.4)
    footer(d, 7, N)
    slides.append(img)

    # ── 8. OUTRO / CTA ──
    img, d = create_slide()
    draw_text_wrapped(d, "별점에 집착하지 마세요.\n리뷰의 '내용'을 바꾸세요.", 70, 300, 940, font(42, 8), C(WHITE), 1.3)
    d.text((70, 600), "bigdatamarketinglab.com", fill=C(ACCENT), font=font(26, 6))
    y = 780
    d.text((70, y), "BDM Lab", fill=C(ACCENT), font=font(36, 8))
    d.text((70, y + 50), "빅데이터 마케팅 랩", fill=C(DIM), font=font(22, 0))
    footer(d)
    slides.append(img)

    return "carousel_2_reviews", slides


if __name__ == "__main__":
    for func in [carousel_1, carousel_2]:
        prefix, slides = func()
        out_dir = os.path.join(OUTPUT_DIR, prefix)
        os.makedirs(out_dir, exist_ok=True)
        for i, slide in enumerate(slides, 1):
            path = os.path.join(out_dir, f"slide_{i:02d}.png")
            slide.save(path, quality=95)
            print(f"  {path}")
        print(f"  {prefix}: {len(slides)} slides\n")
    print("Done!")
