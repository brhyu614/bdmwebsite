#!/usr/bin/env python3
"""E 웜 오렌지 기반 — 폰트 색상 변형 3가지"""
import sys
sys.path.insert(0, '/Users/boramlim/Library/Python/3.9/lib/python/site-packages')
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1080, 1350
FONT_PATH = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
OUT = os.path.dirname(os.path.abspath(__file__))

def font(size, index=0):
    return ImageFont.truetype(FONT_PATH, size, index=index)

def C(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def draw_text_wrapped(draw, text, x, y, max_width, fnt, fill, line_spacing=1.25):
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

BG = "#FF8C42"

options = {
    "E1_black_text": {
        "title": "#000000",
        "sub": "#FFFFFF",
        "label_bg": "#000000",
        "label_text": "#FF8C42",
        "deco": "#E07830",
        "footer_a": "#000000",
        "footer_d": "#8B4513",
        "desc": "제목 검정 + 서브 흰색"
    },
    "E2_black_darkbrown": {
        "title": "#1C1917",
        "sub": "#FFFFFF",
        "label_bg": "#1C1917",
        "label_text": "#FFFFFF",
        "deco": "#E07830",
        "footer_a": "#1C1917",
        "footer_d": "#7A4A20",
        "desc": "제목 다크브라운 + 서브 흰색"
    },
    "E3_black_yellow": {
        "title": "#000000",
        "sub": "#FFF8E1",
        "label_bg": "#000000",
        "label_text": "#FFD54F",
        "deco": "#E07830",
        "footer_a": "#000000",
        "footer_d": "#8B4513",
        "desc": "제목 검정 + 서브 연노랑"
    },
}

for name, s in options.items():
    img = Image.new("RGB", (W, H), C(BG))
    d = ImageDraw.Draw(img)

    # 라벨
    label = "BDM Lab Data Report"
    fnt_label = font(18, 6)
    bbox = d.textbbox((0, 0), label, font=fnt_label)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.rounded_rectangle([70, 100, 70 + tw + 24, 100 + th + 14], radius=6, fill=C(s["label_bg"]))
    d.text((82, 107), label, fill=C(s["label_text"]), font=fnt_label)

    # 타이틀
    draw_text_wrapped(d, "치킨 프랜차이즈의\n3년치 빅데이터를\n분석했습니다.", 70, 240, 940, font(58, 8), C(s["title"]))

    # 서브
    draw_text_wrapped(d, "배달 매출을 결정하는 건\n리뷰가 아니었습니다.", 70, 620, 940, font(40, 6), C(s["sub"]))

    # 본문 컨텍스트 — 빅데이터 느낌
    context = "전국 349개 매장 · 일간 거래 데이터 · 채널별 매출 · 리뷰 10만 건"
    d.text((70, 820), context, fill=C(s["footer_a"]), font=font(20, 3))

    # 하단
    y = H - 90
    d.line([(70, y), (W - 70, y)], fill=C(s["deco"]), width=1)
    d.text((70, y + 25), "BDM Lab", fill=C(s["footer_a"]), font=font(22, 6))
    d.text((200, y + 27), "빅데이터 마케팅 랩", fill=C(s["footer_d"]), font=font(18, 0))
    d.text((W - 140, y + 25), name[:2], fill=C(s["footer_d"]), font=font(22, 6))

    path = os.path.join(OUT, f"sample_{name}.png")
    img.save(path, quality=95)
    print(f"  {name}: {s['desc']}")

print("\nDone!")
