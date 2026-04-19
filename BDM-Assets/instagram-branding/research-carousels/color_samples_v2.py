#!/usr/bin/env python3
"""밝고 발랄한 톤 샘플 6가지"""
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

options = {
    "E_warm_orange": {
        "bg": "#FF8C42",
        "title": "#FFFFFF",
        "sub": "#1C1917",
        "label_bg": "#FFFFFF",
        "label_text": "#FF8C42",
        "deco": "#E07830",
        "footer_a": "#FFFFFF",
        "footer_d": "#FFB880",
        "desc": "웜 오렌지"
    },
    "F_sunset_gradient": {
        "bg": "#FF6B35",
        "title": "#FFFFFF",
        "sub": "#FFF3E0",
        "label_bg": "#FFF3E0",
        "label_text": "#FF6B35",
        "deco": "#E05A28",
        "footer_a": "#FFFFFF",
        "footer_d": "#FFAD8A",
        "desc": "선셋 오렌지"
    },
    "G_mango_yellow": {
        "bg": "#FFB627",
        "title": "#1C1917",
        "sub": "#7C2D12",
        "label_bg": "#1C1917",
        "label_text": "#FFB627",
        "deco": "#E5A020",
        "footer_a": "#1C1917",
        "footer_d": "#8B7020",
        "desc": "망고 옐로우"
    },
    "H_peach_cream": {
        "bg": "#FFECD2",
        "title": "#1C1917",
        "sub": "#D4530A",
        "label_bg": "#FF8C42",
        "label_text": "#FFFFFF",
        "deco": "#FFD9B3",
        "footer_a": "#FF8C42",
        "footer_d": "#C4A882",
        "desc": "피치 크림"
    },
    "I_coral_orange": {
        "bg": "#FF7F50",
        "title": "#FFFFFF",
        "sub": "#2D1810",
        "label_bg": "#2D1810",
        "label_text": "#FF7F50",
        "deco": "#E06B40",
        "footer_a": "#FFFFFF",
        "footer_d": "#FFB090",
        "desc": "코랄 오렌지"
    },
    "J_tangerine_pop": {
        "bg": "#FF9F1C",
        "title": "#FFFFFF",
        "sub": "#2D1810",
        "label_bg": "#FFFFFF",
        "label_text": "#FF9F1C",
        "deco": "#E08A15",
        "footer_a": "#FFFFFF",
        "footer_d": "#FFD08A",
        "desc": "탄저린 팝"
    },
}

for name, s in options.items():
    img = Image.new("RGB", (W, H), C(s["bg"]))
    d = ImageDraw.Draw(img)

    # 라벨
    label = "BDM Lab Data Report"
    fnt_label = font(18, 6)
    bbox = d.textbbox((0, 0), label, font=fnt_label)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.rounded_rectangle([70, 100, 70 + tw + 24, 100 + th + 14], radius=6, fill=C(s["label_bg"]))
    d.text((82, 107), label, fill=C(s["label_text"]), font=fnt_label)

    # 타이틀
    draw_text_wrapped(d, "치킨집 349개의\n3년치 데이터를\n분석했습니다.", 70, 240, 940, font(58, 8), C(s["title"]))

    # 서브
    draw_text_wrapped(d, "배달 매출을 결정하는 건\n리뷰가 아니었습니다.", 70, 620, 940, font(40, 6), C(s["sub"]))

    # 데코 숫자
    d.text((70, 950), "349", fill=C(s["deco"]), font=font(260, 8))

    # 하단
    y = H - 90
    d.line([(70, y), (W - 70, y)], fill=C(s["deco"]), width=1)
    d.text((70, y + 25), "BDM Lab", fill=C(s["footer_a"]), font=font(22, 6))
    d.text((200, y + 27), "빅데이터 마케팅 랩", fill=C(s["footer_d"]), font=font(18, 0))
    d.text((W - 120, y + 25), name[:1], fill=C(s["footer_d"]), font=font(22, 6))

    path = os.path.join(OUT, f"sample_{name}.png")
    img.save(path, quality=95)
    print(f"  {name}: {s['desc']}")

print("\nDone!")
