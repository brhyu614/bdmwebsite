#!/usr/bin/env python3
"""새벽배송 + 자기잠식 캐러셀 — 오렌지 톤 통일"""
import sys
sys.path.insert(0, '/Users/boramlim/Library/Python/3.9/lib/python/site-packages')
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os

W, H = 1080, 1350
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
BASE = os.path.dirname(os.path.abspath(__file__))

BG = "#FF8C42"
BLACK = "#000000"
WHITE = "#FFFFFF"
DIM = "#8B4513"
DECO = "#E07830"

def font(size, index=0):
    return ImageFont.truetype(FONT_PATH, size, index=index)

def C(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def slide():
    img = Image.new("RGB", (W, H), C(BG))
    draw = ImageDraw.Draw(img)
    return img, draw

def wrap(d, text, x, y, max_w, fnt, fill, spacing=1.35):
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

def label(d, text, x, y, bg=BLACK, fg=BG):
    f = font(22, 6)
    bbox = d.textbbox((0, 0), text, font=f)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.rounded_rectangle([x, y, x + tw + 30, y + th + 18], radius=8, fill=C(bg))
    d.text((x + 15, y + 9), text, fill=C(fg), font=f)

def footer(d, page=None, total=None):
    y = H - 100
    d.line([(70, y), (W - 70, y)], fill=C(DECO), width=1)
    d.text((70, y + 30), "BDM Lab", fill=C(BLACK), font=font(26, 8))
    d.text((220, y + 34), "빅데이터 마케팅 랩", fill=C(DIM), font=font(20, 0))
    if page and total:
        pt = f"{page} / {total}"
        bbox = d.textbbox((0, 0), pt, font=font(20, 0))
        d.text((W - 70 - (bbox[2] - bbox[0]), y + 34), pt, fill=C(DIM), font=font(20, 0))

def make_outro(d, line1, line2):
    """임팩트 있는 마지막 장"""
    # 상단 큰 메시지
    wrap(d, line1, 70, 200, 940, font(56, 8), C(BLACK))
    # 중간 서브
    wrap(d, line2, 70, 520, 940, font(36, 6), C(WHITE))
    # 구분선
    d.line([(70, 750), (400, 750)], fill=C(BLACK), width=3)
    # BDM Lab
    d.text((70, 800), "BDM Lab", fill=C(BLACK), font=font(44, 8))
    d.text((70, 860), "빅데이터 마케팅 랩", fill=C(DIM), font=font(24, 0))
    d.text((70, 930), "bigdatamarketinglab.com", fill=C(WHITE), font=font(26, 6))
    wrap(d, "풀버전 분석은 프로필 링크에서", 70, 1000, 940, font(24, 3), C(DIM))
    footer(d)


# ═══════════════════════════════════════════════════════
# 새벽배송 캐러셀 (수정판)
# ═══════════════════════════════════════════════════════
def dawn_delivery():
    out = os.path.join(BASE, "final_carousel_dawn")
    os.makedirs(out, exist_ok=True)
    N = 9

    # 1. 타이틀 (배경 이미지)
    bg_path = os.path.join(BASE, "..", "carousel-images", "새벽배송111.jpg")
    bg_img = Image.open(bg_path).convert("RGB")
    bg_ratio = max(W / bg_img.width, H / bg_img.height)
    bg_resized = bg_img.resize((int(bg_img.width * bg_ratio), int(bg_img.height * bg_ratio)), Image.LANCZOS)
    left = (bg_resized.width - W) // 2
    top = (bg_resized.height - H) // 2
    bg_cropped = bg_resized.crop((left, top, left + W, top + H))
    bg_dark = ImageEnhance.Brightness(bg_cropped).enhance(0.35)
    orange_overlay = Image.new("RGB", (W, H), C(BG))
    img1 = Image.blend(bg_dark, orange_overlay, 0.45)
    d1 = ImageDraw.Draw(img1)
    label(d1, "BDM Lab Data Report", 70, 70, bg=WHITE, fg="#FF8C42")
    wrap(d1, "마트들이 포기했던\n새벽배송,", 70, 200, 940, font(64, 8), C(WHITE))
    wrap(d1, "데이터가 찾아낸\n'진짜 생존 공식'", 70, 480, 940, font(64, 8), C("#FFF3E0"))
    d1.text((70, 800), "920명 실제 구매 데이터 분석", fill=C(WHITE), font=font(26, 6))
    footer(d1, 1, N)
    img1.save(os.path.join(out, "slide_01.png"), quality=95)

    # 2. HOOK
    img, d = slide()
    wrap(d, "\"비용 감당이\n안 됩니다.\"", 70, 150, 940, font(60, 8), C(BLACK))
    wrap(d, "롯데마트, 헬로네이처 등\n기존 유통 강자들이\n새벽배송 시장에서\n줄줄이 철수했습니다.", 70, 500, 940, font(36, 3), C(WHITE))
    wrap(d, "결국 쿠팡과 컬리의\n승리로 끝난 걸까요?", 70, 880, 940, font(40, 8), C(BLACK))
    footer(d, 2, N)
    img.save(os.path.join(out, "slide_02.png"), quality=95)

    # 3. CONTEXT
    img, d = slide()
    wrap(d, "대형마트들이 물러난\n진짜 이유는\n따로 있었습니다.", 70, 150, 940, font(50, 8), C(BLACK))
    wrap(d, "무기가 없어서가 아니라\n법에 묶여 있었기 때문.", 70, 480, 940, font(40, 6), C(WHITE))
    d.rounded_rectangle([50, 700, W - 50, 950], radius=20, fill=C(BLACK))
    wrap(d, "규제 탓에 가장 강력한 무기인\n'오프라인 매장'을\n새벽배송 거점으로\n쓸 수 없었습니다.", 90, 730, 900, font(32, 6), C("#FF8C42"))
    footer(d, 3, N)
    img.save(os.path.join(out, "slide_03.png"), quality=95)

    # 4. INSIGHT 1
    img, d = slide()
    label(d, "INSIGHT", 70, 70, bg="#333333", fg=WHITE)
    wrap(d, "새벽배송 매출이\n폭발하는 비결은\n거대한 물류센터가\n아니었습니다.", 70, 170, 940, font(48, 8), C(BLACK))
    d.rounded_rectangle([50, 620, W - 50, 900], radius=20, fill=C(BLACK))
    wrap(d, "내 집 근처에 '바로 그 마트의\n오프라인 매장'이 있을 때", 90, 650, 900, font(32, 6), C("#FF8C42"))
    wrap(d, "지출 +78%\n쇼핑 빈도 2배", 90, 780, 900, font(40, 8), C(WHITE))
    wrap(d, "(근처에 매장이 없으면 효과 없음)", 70, 940, 940, font(26, 3), C(WHITE))
    footer(d, 4, N)
    img.save(os.path.join(out, "slide_04.png"), quality=95)

    # 5. WHY
    img, d = slide()
    label(d, "WHY", 70, 70)
    wrap(d, "온라인으로 수박이나\n소고기를 사는 건\n누구에게나 불안합니다.", 70, 170, 940, font(44, 8), C(BLACK))
    wrap(d, "하지만 내 집 옆,\n내가 매일 가던\n그 이마트/홈플러스에서\n보낸다면?", 70, 500, 940, font(40, 6), C(WHITE))
    d.rounded_rectangle([50, 850, W - 50, 1050], radius=20, fill=C(BLACK))
    wrap(d, "오프라인에서 쌓은 신뢰가\n온라인의 불안을 지워버립니다.", 90, 885, 900, font(32, 8), C("#FF8C42"))
    footer(d, 5, N)
    img.save(os.path.join(out, "slide_05.png"), quality=95)

    # 6. INSIGHT 2 (수정: 총 식료품 지출 라인 삭제)
    img, d = slide()
    label(d, "INSIGHT 2", 70, 70, bg="#333333", fg=WHITE)
    wrap(d, "새벽배송을 쓴다고\n식비가 느는 건\n아니었습니다.", 70, 170, 940, font(48, 8), C(BLACK))
    wrap(d, "남의 데서 사던 걸\n'이 마트'에서\n사게 된 것.", 70, 530, 940, font(44, 6), C(WHITE))
    d.rounded_rectangle([50, 850, W - 50, 1050], radius=20, fill=C(BLACK))
    wrap(d, "새벽배송은 파이를 키우는 게 아니라\n경쟁사 고객을 뺏어오는 무기.", 90, 885, 900, font(30, 6), C("#FF8C42"))
    footer(d, 6, N)
    img.save(os.path.join(out, "slide_06.png"), quality=95)

    # 7. MACRO VIEW
    img, d = slide()
    wrap(d, "지금, 대형마트의\n새벽배송 영업 제한\n규제가 완화될\n조짐을 보이고 있습니다.", 70, 130, 940, font(44, 8), C(BLACK))
    wrap(d, "손발이 묶여있던 거인들이\n전국 수백 개의\n'신뢰 매장'을\n가동하기 시작한다면?", 70, 530, 940, font(38, 6), C(WHITE))
    wrap(d, "내 집 옆 대형마트에서\n내일 아침 먹을 신선한\n고기와 채소가 도착한다면?", 70, 870, 940, font(34, 6), C(BLACK))
    footer(d, 7, N)
    img.save(os.path.join(out, "slide_07.png"), quality=95)

    # 8. ACTION
    img, d = slide()
    label(d, "POINT", 70, 70)
    wrap(d, "대형마트의\n오프라인 매장은\n비용을 먹는 하마가\n아닙니다.", 70, 170, 940, font(48, 8), C(BLACK))
    d.rounded_rectangle([50, 680, W - 50, 920], radius=20, fill=C(BLACK))
    wrap(d, "온라인 새벽배송 매출을\n폭발시키고 판을 뒤집을\n가장 강력한 '신뢰 인프라'.", 90, 715, 900, font(34, 8), C("#FF8C42"))
    footer(d, 8, N)
    img.save(os.path.join(out, "slide_08.png"), quality=95)

    # 9. OUTRO — 임팩트 강화
    img, d = slide()
    make_outro(d,
        "오프라인 매장을 가진 자가\n새벽배송의\n최종 승자입니다.",
        "데이터가 증명합니다."
    )
    img.save(os.path.join(out, "slide_09.png"), quality=95)

    print(f"  dawn_delivery: {N} slides → {out}")


# ═══════════════════════════════════════════════════════
# 자기잠식 캐러셀 (오렌지 디자인 통일)
# ═══════════════════════════════════════════════════════
def cannibalization():
    out = os.path.join(BASE, "final_carousel_cannibal")
    os.makedirs(out, exist_ok=True)
    N = 9

    # 1. 타이틀
    img, d = slide()
    label(d, "BDM Lab Data Report", 70, 70, bg=WHITE, fg="#FF8C42")
    wrap(d, "배달의민족에서\n우리 매장의\n진짜 경쟁자는", 70, 200, 940, font(60, 8), C(BLACK))
    wrap(d, "옆집 교촌이\n아닙니다.", 70, 620, 940, font(60, 8), C(WHITE))
    d.text((70, 900), "349개 매장 · 3년치 배달 vs. 매장 식사 데이터", fill=C(BLACK), font=font(22, 3))
    footer(d, 1, N)
    img.save(os.path.join(out, "slide_01.png"), quality=95)

    # 2. HOOK
    img, d = slide()
    wrap(d, "프랜차이즈 본사가\n신규 매장 낼 때\n첫 번째로 하는 일:", 70, 150, 940, font(46, 8), C(BLACK))
    d.rounded_rectangle([50, 530, W - 50, 730], radius=20, fill=C(BLACK))
    wrap(d, "\"이 동네에 경쟁 브랜드가\n몇 개 있는가?\"", 90, 570, 900, font(38, 8), C("#FF8C42"))
    wrap(d, "이 질문 자체가\n잘못됐을 수 있습니다.", 70, 820, 940, font(42, 8), C(WHITE))
    footer(d, 2, N)
    img.save(os.path.join(out, "slide_02.png"), quality=95)

    # 3. 오프라인 vs 배달앱
    img, d = slide()
    label(d, "구조 변화", 70, 70, bg="#333333", fg=WHITE)
    wrap(d, "오프라인에서는\n거리가 보호막입니다.", 70, 170, 940, font(44, 8), C(BLACK))
    # 오프라인 박스
    d.rounded_rectangle([50, 420, W - 50, 580], radius=16, fill=C(DECO))
    wrap(d, "우리 매장 ← 도보 15분 → 우리 2호점\n고객이 물리적으로 겹치지 않음", 90, 445, 900, font(26, 3), C(BLACK))
    # 배달앱 박스
    d.rounded_rectangle([50, 630, W - 50, 850], radius=16, fill=C(BLACK))
    wrap(d, "배달앱에서는?\n같은 화면에 동시에 뜹니다.\n메뉴 같고, 가격 같고, 프로모션도 같고.\n완벽한 대체재.", 90, 655, 900, font(28, 6), C("#FF8C42"))
    footer(d, 3, N)
    img.save(os.path.join(out, "slide_03.png"), quality=95)

    # 4. 핵심 발견
    img, d = slide()
    label(d, "KEY FINDING", 70, 70, bg="#333333", fg=WHITE)
    wrap(d, "타 브랜드보다\n자사 브랜드가\n더 무섭습니다.", 70, 170, 940, font(52, 8), C(BLACK))
    wrap(d, "배달 매출이 기대보다 낮을 때\n\"주변 타 브랜드 때문\"으로만\n보면 설명이 안 됩니다.", 70, 530, 940, font(32, 3), C(WHITE))
    d.rounded_rectangle([50, 800, W - 50, 980], radius=20, fill=C(BLACK))
    wrap(d, "\"주변 자사 매장\"까지 넣어야\n비로소 매출이 설명됩니다.", 90, 835, 900, font(34, 8), C("#FF8C42"))
    footer(d, 4, N)
    img.save(os.path.join(out, "slide_04.png"), quality=95)

    # 5. 거리별
    img, d = slide()
    label(d, "DATA", 70, 70)
    wrap(d, "100미터 이내가\n가장 치명적.", 70, 170, 940, font(52, 8), C(BLACK))
    wrap(d, "배달앱에서 100m 이내 매장은\n거의 동시에 노출됩니다.", 70, 440, 940, font(32, 3), C(WHITE))
    # 거리 바
    y = 620
    distances = [("100m", 940), ("300m", 750), ("500m", 560), ("1km", 370)]
    for label_text, bar_w in distances:
        d.text((70, y + 8), label_text, fill=C(BLACK), font=font(26, 8))
        d.rounded_rectangle([200, y, 200 + bar_w - 200, y + 45], radius=8, fill=C(BLACK))
        y += 70
    wrap(d, "1km까지도 효과가 남습니다.", 70, y + 20, 940, font(28, 3), C(WHITE))
    footer(d, 5, N)
    img.save(os.path.join(out, "slide_05.png"), quality=95)

    # 6. 배달에서만
    img, d = slide()
    wrap(d, "가장 중요한 발견:", 70, 150, 940, font(40, 6), C(BLACK))
    wrap(d, "이건 배달에서만\n일어납니다.", 70, 280, 940, font(56, 8), C(WHITE))
    # 비교 박스
    d.rounded_rectangle([50, 560, 520, 760], radius=16, fill=C(BLACK))
    wrap(d, "배달 채널", 90, 585, 400, font(24, 6), C("#FF8C42"))
    wrap(d, "자기잠식\n발생 ✓", 90, 640, 400, font(36, 8), C(WHITE))

    d.rounded_rectangle([550, 560, W - 50, 760], radius=16, fill=C(DECO))
    wrap(d, "매장 식사(홀)", 590, 585, 400, font(24, 6), C(BLACK))
    wrap(d, "자기잠식\n없음 ✕", 590, 640, 400, font(36, 8), C(BLACK))

    wrap(d, "자기잠식은 브랜드의 문제가 아니라\n배달앱이 만들어낸\n구조적 현상입니다.", 70, 840, 940, font(30, 3), C(BLACK))
    footer(d, 6, N)
    img.save(os.path.join(out, "slide_06.png"), quality=95)

    # 7. 왜 위험한가
    img, d = slide()
    label(d, "WARNING", 70, 70, bg="#333333", fg=WHITE)
    wrap(d, "본사는 매장을 늘려야\n성장합니다.", 70, 170, 940, font(44, 8), C(BLACK))
    wrap(d, "가맹점주는 배달 반경이\n보호되어야 생존합니다.", 70, 380, 940, font(38, 6), C(WHITE))
    d.rounded_rectangle([50, 620, W - 50, 920], radius=20, fill=C(BLACK))
    wrap(d, "신규 매장이 열리면\n본사는 가맹비를 받지만\n기존 가맹점 매출은 나눠집니다.\n\n문제는, 가맹점주는\n원인을 모릅니다.", 90, 650, 900, font(30, 6), C("#FF8C42"))
    footer(d, 7, N)
    img.save(os.path.join(out, "slide_07.png"), quality=95)

    # 8. ACTION
    img, d = slide()
    label(d, "ACTION", 70, 70)
    wrap(d, "출점 심사의\n첫 번째 질문을\n바꿔야 합니다.", 70, 170, 940, font(48, 8), C(BLACK))
    # Before
    d.rounded_rectangle([50, 530, W - 50, 680], radius=16, fill=C(DECO))
    wrap(d, "기존: \"이 동네에 경쟁 브랜드가\n몇 개인가?\"", 90, 560, 900, font(28, 3), C(BLACK))
    # After
    d.rounded_rectangle([50, 720, W - 50, 920], radius=16, fill=C(BLACK))
    wrap(d, "새로운 질문:\n\"이 동네에 우리 매장이 이미 있는가?\n배달 반경이 겹치는가?\"", 90, 745, 900, font(28, 8), C("#FF8C42"))
    footer(d, 8, N)
    img.save(os.path.join(out, "slide_08.png"), quality=95)

    # 9. OUTRO — 임팩트
    img, d = slide()
    make_outro(d,
        "배달앱 위에서\n같은 편은 없습니다.\n모든 매장은 경쟁자입니다.",
        "보이지 않는 적을\n데이터로 찾아냈습니다."
    )
    img.save(os.path.join(out, "slide_09.png"), quality=95)

    print(f"  cannibalization: {N} slides → {out}")


if __name__ == "__main__":
    dawn_delivery()
    cannibalization()
    print("\nDone!")
