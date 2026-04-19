#!/usr/bin/env python3
"""새벽배송 캐러셀 — 오렌지 톤 + 가독성 극대화"""
import sys
sys.path.insert(0, '/Users/boramlim/Library/Python/3.9/lib/python/site-packages')
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os

W, H = 1080, 1350
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "final_carousel_dawn")
os.makedirs(OUT, exist_ok=True)

BG = "#FF8C42"
BLACK = "#000000"
WHITE = "#FFFFFF"
DARK = "#1A0A00"
DIM = "#8B4513"
DECO = "#E07830"
CARD_BG = "#00000099"

def font(size, index=0):
    return ImageFont.truetype(FONT_PATH, size, index=index)

def C(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def slide(bg_color=BG):
    img = Image.new("RGB", (W, H), C(bg_color))
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

N = 9

# ── 1. 타이틀 (배경 이미지) ──
bg_img_path = "/Users/boramlim/Dropbox/Website-BigDMKTG/BDM-Assets/instagram-branding/carousel-images/새벽배송111.jpg"
bg_img = Image.open(bg_img_path).convert("RGB")

# 배경 이미지를 1080x1350에 맞추기 (crop to fill)
bg_ratio = max(W / bg_img.width, H / bg_img.height)
bg_resized = bg_img.resize((int(bg_img.width * bg_ratio), int(bg_img.height * bg_ratio)), Image.LANCZOS)
left = (bg_resized.width - W) // 2
top = (bg_resized.height - H) // 2
bg_cropped = bg_resized.crop((left, top, left + W, top + H))

# 어둡게 + 오렌지 틴트 오버레이
darkener = ImageEnhance.Brightness(bg_cropped)
bg_dark = darkener.enhance(0.35)
orange_overlay = Image.new("RGB", (W, H), C(BG))
img1 = Image.blend(bg_dark, orange_overlay, 0.45)
d1 = ImageDraw.Draw(img1)

label(d1, "BDM Lab Data Report", 70, 70, bg=WHITE, fg="#FF8C42")
wrap(d1, "마트들이 포기했던\n새벽배송,", 70, 200, 940, font(64, 8), C(WHITE))
wrap(d1, "데이터가 찾아낸\n'진짜 생존 공식'", 70, 480, 940, font(64, 8), C("#FFF3E0"))
d1.text((70, 800), "920명 실제 구매 데이터 분석", fill=C(WHITE), font=font(26, 6))
footer(d1, 1, N)
img1.save(os.path.join(OUT, "slide_01.png"), quality=95)
print("  slide_01")

# ── 2. HOOK ──
img, d = slide()
wrap(d, "\"비용 감당이\n안 됩니다.\"", 70, 150, 940, font(60, 8), C(BLACK))
wrap(d, "롯데마트, 헬로네이처 등\n기존 유통 강자들이\n새벽배송 시장에서\n줄줄이 철수했습니다.", 70, 500, 940, font(36, 3), C(WHITE))
wrap(d, "결국 쿠팡과 컬리의\n승리로 끝난 걸까요?", 70, 880, 940, font(40, 8), C(BLACK))
footer(d, 2, N)
img.save(os.path.join(OUT, "slide_02.png"), quality=95)
print("  slide_02")

# ── 3. CONTEXT ──
img, d = slide()
wrap(d, "대형마트들이 물러난\n진짜 이유는\n따로 있었습니다.", 70, 150, 940, font(50, 8), C(BLACK))
wrap(d, "무기가 없어서가 아니라\n법에 묶여 있었기 때문.", 70, 480, 940, font(40, 6), C(WHITE))
d.rounded_rectangle([50, 700, W - 50, 950], radius=20, fill=C(BLACK))
wrap(d, "규제 탓에 가장 강력한 무기인\n'오프라인 매장'을\n새벽배송 거점으로\n쓸 수 없었습니다.", 90, 730, 900, font(32, 6), C("#FF8C42"))
footer(d, 3, N)
img.save(os.path.join(OUT, "slide_03.png"), quality=95)
print("  slide_03")

# ── 4. INSIGHT 1 ──
img, d = slide()
label(d, "INSIGHT", 70, 70, bg="#333333", fg=WHITE)
wrap(d, "새벽배송 매출이\n폭발하는 비결은\n거대한 물류센터가\n아니었습니다.", 70, 170, 940, font(48, 8), C(BLACK))
d.rounded_rectangle([50, 620, W - 50, 900], radius=20, fill=C(BLACK))
wrap(d, "내 집 근처에 '바로 그 마트의\n오프라인 매장'이 있을 때", 90, 650, 900, font(32, 6), C("#FF8C42"))
wrap(d, "지출 +78%\n쇼핑 빈도 2배", 90, 780, 900, font(40, 8), C(WHITE))
wrap(d, "(근처에 매장이 없으면 효과 없음)", 70, 940, 940, font(26, 3), C(WHITE))
footer(d, 4, N)
img.save(os.path.join(OUT, "slide_04.png"), quality=95)
print("  slide_04")

# ── 5. WHY ──
img, d = slide()
label(d, "WHY", 70, 70)
wrap(d, "온라인으로 수박이나\n소고기를 사는 건\n누구에게나 불안합니다.", 70, 170, 940, font(44, 8), C(BLACK))
wrap(d, "하지만 내 집 옆,\n내가 매일 가던\n그 이마트/홈플러스에서\n보낸다면?", 70, 500, 940, font(40, 6), C(WHITE))
d.rounded_rectangle([50, 850, W - 50, 1050], radius=20, fill=C(BLACK))
wrap(d, "오프라인에서 쌓은 신뢰가\n온라인의 불안을 지워버립니다.", 90, 885, 900, font(32, 8), C("#FF8C42"))
footer(d, 5, N)
img.save(os.path.join(OUT, "slide_05.png"), quality=95)
print("  slide_05")

# ── 6. INSIGHT 2 ──
img, d = slide()
label(d, "INSIGHT 2", 70, 70, bg="#333333", fg=WHITE)
wrap(d, "새벽배송을 쓴다고\n식비가 느는 건\n아니었습니다.", 70, 170, 940, font(48, 8), C(BLACK))
wrap(d, "총 식료품 지출:\n월 24~25만원으로 고정.", 70, 510, 940, font(34, 3), C(WHITE))
wrap(d, "남의 데서 사던 걸\n'이 마트'에서 사게 된 것.", 70, 680, 940, font(38, 6), C(BLACK))
d.rounded_rectangle([50, 900, W - 50, 1060], radius=20, fill=C(BLACK))
wrap(d, "새벽배송은 파이를 키우는 게 아니라\n경쟁사 고객을 뺏어오는 무기.", 90, 930, 900, font(28, 6), C("#FF8C42"))
footer(d, 6, N)
img.save(os.path.join(OUT, "slide_06.png"), quality=95)
print("  slide_06")

# ── 7. MACRO VIEW ──
img, d = slide()
wrap(d, "지금, 대형마트의\n새벽배송 영업 제한\n규제가 완화될\n조짐을 보이고 있습니다.", 70, 130, 940, font(44, 8), C(BLACK))
wrap(d, "손발이 묶여있던 거인들이\n전국 수백 개의\n'신뢰 매장'을\n가동하기 시작한다면?", 70, 530, 940, font(38, 6), C(WHITE))
wrap(d, "내 집 옆 대형마트에서\n내일 아침 먹을 신선한\n고기와 채소가 도착한다면?", 70, 870, 940, font(34, 6), C(BLACK))
footer(d, 7, N)
img.save(os.path.join(OUT, "slide_07.png"), quality=95)
print("  slide_07")

# ── 8. ACTION ──
img, d = slide()
label(d, "POINT", 70, 70)
wrap(d, "대형마트의\n오프라인 매장은\n비용을 먹는 하마가\n아닙니다.", 70, 170, 940, font(48, 8), C(BLACK))
d.rounded_rectangle([50, 680, W - 50, 920], radius=20, fill=C(BLACK))
wrap(d, "온라인 새벽배송 매출을\n폭발시키고 판을 뒤집을\n가장 강력한 '신뢰 인프라'.", 90, 715, 900, font(34, 8), C("#FF8C42"))
footer(d, 8, N)
img.save(os.path.join(OUT, "slide_08.png"), quality=95)
print("  slide_08")

# ── 9. OUTRO ──
img, d = slide()
wrap(d, "감이 아니라\n데이터로.", 70, 250, 940, font(60, 8), C(BLACK))
d.text((70, 560), "BDM Lab", fill=C(BLACK), font=font(50, 8))
d.text((70, 630), "빅데이터 마케팅 랩", fill=C(DIM), font=font(26, 0))
d.text((70, 750), "bigdatamarketinglab.com", fill=C(WHITE), font=font(28, 6))
wrap(d, "풀버전 분석은 프로필 링크에서", 70, 850, 940, font(26, 3), C(DIM))
footer(d)
img.save(os.path.join(OUT, "slide_09.png"), quality=95)
print("  slide_09")

print(f"\n  Done! {N} slides → {OUT}")
