#!/usr/bin/env python3
"""
BDM Lab 리서치 캐러셀 — FINAL
E1 웜 오렌지 + 검정 텍스트 + 큰 글씨
"""
import sys
sys.path.insert(0, '/Users/boramlim/Library/Python/3.9/lib/python/site-packages')
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1350
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
OUT = os.path.dirname(os.path.abspath(__file__))

# 색상
BG = "#FF8C42"
BLACK = "#000000"
WHITE = "#FFFFFF"
CREAM = "#FFF8E1"
DIM = "#8B4513"
DECO = "#E07830"
LABEL_BG = "#000000"
LABEL_TEXT = "#FF8C42"
CARD_BG = "#E07830"
CARD_BORDER = "#C06020"

def font(size, index=0):
    return ImageFont.truetype(FONT_PATH, size, index=index)

def C(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def create_slide():
    img = Image.new("RGB", (W, H), C(BG))
    draw = ImageDraw.Draw(img)
    return img, draw

def draw_wrapped(d, text, x, y, max_w, fnt, fill, spacing=1.25):
    lines = []
    for para in text.split('\n'):
        if para == '':
            lines.append('')
            continue
        cur = ""
        for ch in para:
            test = cur + ch
            bbox = d.textbbox((0, 0), test, font=fnt)
            if bbox[2] - bbox[0] > max_w:
                lines.append(cur)
                cur = ch
            else:
                cur = test
        if cur:
            lines.append(cur)
    ty = y
    lh = d.textbbox((0, 0), "가Ag", font=fnt)[3] - d.textbbox((0, 0), "가Ag", font=fnt)[1]
    for line in lines:
        if line == '':
            ty += int(lh * 0.5)
            continue
        d.text((x, ty), line, fill=fill, font=fnt)
        ty += int(lh * spacing)
    return ty

def label(d, text, x, y, bg=LABEL_BG, fg=LABEL_TEXT):
    f = font(20, 6)
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.rounded_rectangle([x, y, x + tw + 28, y + th + 16], radius=8, fill=C(bg))
    d.text((x + 14, y + 8), text, fill=C(fg), font=f)

def footer(d, page=None, total=None):
    y = H - 100
    d.line([(70, y), (W - 70, y)], fill=C(DECO), width=1)
    d.text((70, y + 30), "BDM Lab", fill=C(BLACK), font=font(24, 6))
    d.text((210, y + 32), "빅데이터 마케팅 랩", fill=C(DIM), font=font(20, 0))
    if page and total:
        pt = f"{page} / {total}"
        bbox = d.textbbox((0, 0), pt, font=font(20, 0))
        d.text((W - 70 - (bbox[2] - bbox[0]), y + 32), pt, fill=C(DIM), font=font(20, 0))


# ═══════════════════════════════════════════════════════
# 캐러셀 1: 치킨집 배달 매출
# ═══════════════════════════════════════════════════════
def carousel_1():
    slides = []
    N = 8

    # 1. 타이틀
    img, d = create_slide()
    label(d, "BDM Lab Data Report", 70, 80)
    draw_wrapped(d, "치킨 프랜차이즈의\n3년치 빅데이터를\n분석했습니다.", 70, 200, 940, font(68, 8), C(BLACK))
    draw_wrapped(d, "배달 매출을 결정하는 건\n리뷰가 아니었습니다.", 70, 620, 940, font(46, 6), C(WHITE))
    d.text((70, 880), "전국 349개 매장 · 16만 건+ 일간 거래 데이터 · 채널별 매출 · 리뷰 10만 건", fill=C(BLACK), font=font(20, 3))
    footer(d, 1, N)
    slides.append(img)

    # 2. HOOK
    img, d = create_slide()
    label(d, "HOOK", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "매장을 열 때\n사장님들이 가장\n신경 쓰는 두 가지.", 70, 200, 940, font(56, 8), C(BLACK))
    draw_wrapped(d, "\"주변에 경쟁 매장이\n얼마나 있나?\"", 70, 580, 940, font(42, 6), C(WHITE))
    draw_wrapped(d, "\"배달앱 별점 관리는\n어떻게 하지?\"", 70, 780, 940, font(42, 6), C(WHITE))
    footer(d, 2, N)
    slides.append(img)

    # 3. CONTEXT
    img, d = create_slide()
    draw_wrapped(d, "BDM Lab이\n349개 치킨 매장의\n3년치 거래 데이터와", 70, 140, 940, font(48, 6), C(BLACK))
    draw_wrapped(d, "10만 건의 리뷰를\n데이터로 검증해\n보았습니다.", 70, 520, 940, font(48, 6), C(WHITE))
    draw_wrapped(d, "우리의 상식은\n맞았을까요?", 70, 860, 940, font(52, 8), C(BLACK))
    footer(d, 3, N)
    slides.append(img)

    # 4. INSIGHT 1
    img, d = create_slide()
    label(d, "INSIGHT 1", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "결과는 직관을\n완전히\n뒤집었습니다.", 70, 200, 940, font(60, 8), C(BLACK))
    draw_wrapped(d, "주변 경쟁 매장의 숫자도,\n목숨 걸고 사수하는\n'리뷰 별점'도", 70, 600, 940, font(38, 3), C(WHITE))
    draw_wrapped(d, "배달 매출의 절대적\n지배자는 아니었습니다.", 70, 880, 940, font(40, 6), C(BLACK))
    footer(d, 4, N)
    slides.append(img)

    # 5. INSIGHT 2
    img, d = create_slide()
    label(d, "INSIGHT 2", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "수십 개의 변수를 제치고\n배달 매출을 지배한\n압도적인 1위 변수.", 70, 200, 940, font(44, 6), C(BLACK))
    draw_wrapped(d, "그것은 바로\n그 동네의 '인구 구성',\n특히", 70, 520, 940, font(40, 3), C(WHITE))
    # 강조 박스
    d.rounded_rectangle([50, 780, W - 50, 920], radius=20, fill=C(BLACK))
    draw_wrapped(d, "'1인 가구 비율'", 90, 810, 900, font(56, 8), C(BG))
    draw_wrapped(d, "이었습니다.", 70, 960, 940, font(40, 6), C(BLACK))
    footer(d, 5, N)
    slides.append(img)

    # 6. WHY
    img, d = create_slide()
    label(d, "WHY", 70, 80)
    draw_wrapped(d, "옴니채널,\n배달앱 시대라지만\n결국 본질은\n다릅니다.", 70, 200, 940, font(52, 8), C(BLACK))
    draw_wrapped(d, "온라인에서 아무리\n마케팅을 잘해도\n결국 내 매장 주변에\n'1인 가구가 얼마나\n밀집해 있느냐'가\n배달 수요의 절대량을\n결정짓습니다.", 70, 600, 940, font(34, 3), C(WHITE))
    footer(d, 6, N)
    slides.append(img)

    # 7. ACTION
    img, d = create_slide()
    label(d, "ACTION", 70, 80)
    draw_wrapped(d, "리뷰 별점 0.1점에\n집착하기 전에\n이 팩트를\n인정해야 합니다.", 70, 200, 940, font(48, 8), C(BLACK))
    draw_wrapped(d, "배달 매출의\n진짜 상한선(천장)은\n사장님의 마케팅 노력\n이전에,", 70, 600, 940, font(36, 3), C(WHITE))
    d.rounded_rectangle([50, 880, W - 50, 1060], radius=20, fill=C(BLACK))
    draw_wrapped(d, "'매장을 오픈하는 그 순간,\n그 위치의 인구 구성'이\n이미 결정해 버립니다.", 90, 900, 900, font(32, 6), C(BG))
    footer(d, 7, N)
    slides.append(img)

    # 8. OUTRO
    img, d = create_slide()
    draw_wrapped(d, "가짜 직관을 버리고\n진짜 데이터를\n읽어야 할 때.", 70, 250, 940, font(56, 8), C(BLACK))
    d.text((70, 680), "bigdatamarketinglab.com", fill=C(WHITE), font=font(30, 6))
    d.text((70, 800), "BDM Lab", fill=C(BLACK), font=font(44, 8))
    d.text((70, 860), "빅데이터 마케팅 랩", fill=C(DIM), font=font(24, 0))
    footer(d)
    slides.append(img)

    return "final_carousel_1", slides


# ═══════════════════════════════════════════════════════
# 캐러셀 2: 10만 건 리뷰
# ═══════════════════════════════════════════════════════
def carousel_2():
    slides = []
    N = 8

    # 1. 타이틀
    img, d = create_slide()
    label(d, "BDM Lab Data Report", 70, 80)
    draw_wrapped(d, "10만 건의 리뷰\n데이터를\n분석했습니다.", 70, 200, 940, font(68, 8), C(BLACK))
    draw_wrapped(d, "매출이 높은 치킨집의\n리뷰는 따로 있었습니다.", 70, 650, 940, font(42, 6), C(WHITE))
    d.text((70, 900), "BDM Lab · 빅데이터 마케팅 랩 데이터 분석", fill=C(BLACK), font=font(22, 3))
    footer(d, 1, N)
    slides.append(img)

    # 2. HOOK
    img, d = create_slide()
    label(d, "HOOK", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "\"리뷰 관리는\n무조건 중요해!\"", 70, 200, 940, font(56, 8), C(BLACK))
    draw_wrapped(d, "반은 맞고\n반은 틀립니다.", 70, 520, 940, font(50, 6), C(WHITE))
    draw_wrapped(d, "어디서 어떻게 파느냐에 따라\n리뷰의 파급력은\n완전히 달랐습니다.", 70, 780, 940, font(34, 3), C(BLACK))
    footer(d, 2, N)
    slides.append(img)

    # 3. INSIGHT 1
    img, d = create_slide()
    label(d, "INSIGHT 1", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "리뷰의 중요성은\n고객의 '경험 거리'에\n비례합니다.", 70, 200, 940, font(48, 8), C(BLACK))
    # 3단계
    y = 600
    steps = [
        ("매장 내 식사", "직접 경험 → 리뷰 의존 낮음"),
        ("픽업", "매장만 방문 → 중간"),
        ("배달", "매장을 모름 → 리뷰에 극도로 의존"),
    ]
    for i, (title, desc) in enumerate(steps):
        color = C(BLACK) if i < 2 else C(WHITE)
        bg_c = C(DECO) if i < 2 else C(BLACK)
        d.rounded_rectangle([70, y, W - 70, y + 110], radius=14, fill=bg_c)
        d.text((110, y + 15), title, fill=color if i < 2 else C(BG), font=font(28, 8))
        d.text((110, y + 60), desc, fill=C(WHITE) if i < 2 else C(CREAM), font=font(20, 0))
        y += 130
    footer(d, 3, N)
    slides.append(img)

    # 4. INSIGHT 2
    img, d = create_slide()
    label(d, "INSIGHT 2", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "매장에 직접 방문하는\n손님은 리뷰에\n덜 의존합니다.", 70, 200, 940, font(42, 6), C(BLACK))
    draw_wrapped(d, "하지만 매장을\n눈으로 볼 수 없는\n배달 고객에게", 70, 520, 940, font(42, 6), C(WHITE))
    d.rounded_rectangle([50, 800, W - 50, 960], radius=20, fill=C(BLACK))
    draw_wrapped(d, "리뷰는 유일한\n시각적, 미각적 단서입니다.", 90, 825, 900, font(38, 8), C(BG))
    footer(d, 4, N)
    slides.append(img)

    # 5. PROBLEM
    img, d = create_slide()
    draw_wrapped(d, "그렇다면\n어떤 리뷰가\n돈이 되는가?", 70, 200, 940, font(62, 8), C(BLACK))
    draw_wrapped(d, "BDM Lab이\n10만 건의 리뷰를\n4가지 주제로\n쪼개 보았습니다.", 70, 600, 940, font(38, 3), C(WHITE))
    # 4개 태그
    y = 960
    tags = ["가격", "서비스", "재구매", "음식 품질"]
    x = 70
    for t in tags:
        f = font(24, 6)
        bbox = d.textbbox((0, 0), t, font=f)
        tw = bbox[2] - bbox[0]
        d.rounded_rectangle([x, y, x + tw + 30, y + 48], radius=10, fill=C(BLACK))
        d.text((x + 15, y + 10), t, fill=C(BG), font=f)
        x += tw + 50
    footer(d, 5, N)
    slides.append(img)

    # 6. INSIGHT 3
    img, d = create_slide()
    label(d, "INSIGHT 3", 70, 80, bg="#333333", fg=WHITE)
    draw_wrapped(d, "정답은", 70, 200, 940, font(44, 6), C(BLACK))
    draw_wrapped(d, "'음식 품질에 대한\n구체적 언급'", 70, 300, 940, font(54, 8), C(WHITE))
    draw_wrapped(d, "이었습니다.", 70, 520, 940, font(44, 6), C(BLACK))
    d.rounded_rectangle([50, 650, W - 50, 880], radius=20, fill=C(BLACK))
    draw_wrapped(d, "\"치킨이 바삭하다\"\n\"양념이 미쳤다\"", 100, 690, 900, font(44, 8), C(BG))
    draw_wrapped(d, "는 리뷰가 많은 매장이\n배달 매출을 올렸습니다.", 70, 920, 940, font(36, 3), C(WHITE))
    footer(d, 6, N)
    slides.append(img)

    # 7. ACTION
    img, d = create_slide()
    label(d, "ACTION", 70, 80)
    draw_wrapped(d, "리뷰 이벤트의\n공식을\n바꿔야 합니다.", 70, 200, 940, font(52, 8), C(BLACK))
    draw_wrapped(d, "\"리뷰 쓰면 치킨 1조각 추가\"\n→ 별점만 올라감, 매출과 무관", 70, 560, 940, font(30, 3), C(WHITE))
    draw_wrapped(d, "진짜 해야 할 것:", 70, 720, 940, font(34, 6), C(BLACK))
    d.rounded_rectangle([50, 800, W - 50, 1020], radius=20, fill=C(BLACK))
    draw_wrapped(d, "음식 맛에 대해\n구체적으로 쓰게 만드는 것.\n\"어떤 메뉴가 가장 맛있었나요?\"", 90, 830, 900, font(30, 6), C(BG))
    draw_wrapped(d, "별점 숫자가 아니라\n리뷰 안의 '내용'이 매출입니다.", 70, 1060, 940, font(32, 6), C(WHITE))
    footer(d, 7, N)
    slides.append(img)

    # 8. OUTRO
    img, d = create_slide()
    draw_wrapped(d, "별점에\n집착하지 마세요.\n리뷰의 '내용'을\n바꾸세요.", 70, 200, 940, font(58, 8), C(BLACK))
    d.text((70, 720), "bigdatamarketinglab.com", fill=C(WHITE), font=font(30, 6))
    d.text((70, 850), "BDM Lab", fill=C(BLACK), font=font(44, 8))
    d.text((70, 910), "빅데이터 마케팅 랩", fill=C(DIM), font=font(24, 0))
    footer(d)
    slides.append(img)

    return "final_carousel_2", slides


if __name__ == "__main__":
    for func in [carousel_1, carousel_2]:
        prefix, slides = func()
        out_dir = os.path.join(OUT, prefix)
        os.makedirs(out_dir, exist_ok=True)
        for i, slide in enumerate(slides, 1):
            path = os.path.join(out_dir, f"slide_{i:02d}.png")
            slide.save(path, quality=95)
            print(f"  {path}")
        print(f"  {prefix}: {len(slides)} slides\n")
    print("Done!")
