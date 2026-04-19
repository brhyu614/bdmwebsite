#!/usr/bin/env python3
"""타이틀 슬라이드를 4가지 배경색으로 샘플 생성"""
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

# 4가지 색상 옵션
options = {
    "A_deep_green": {
        "bg": "#0A2418",
        "title_color": "#FFFFFF",
        "sub_color": "#FBBF24",
        "accent": "#10B981",
        "label_bg": "#10B981",
        "label_text": "#000000",
        "footer_accent": "#10B981",
        "footer_dim": "#4B7A5E",
        "deco": "#0F3D2A",
        "desc": "진한 그린"
    },
    "B_warm_dark": {
        "bg": "#1A1410",
        "title_color": "#FFFFFF",
        "sub_color": "#FBBF24",
        "accent": "#D4A574",
        "label_bg": "#D4A574",
        "label_text": "#1A1410",
        "footer_accent": "#D4A574",
        "footer_dim": "#6B5A4E",
        "deco": "#2A2018",
        "desc": "웜 다크 (브라운)"
    },
    "C_cream_light": {
        "bg": "#F5F2EB",
        "title_color": "#1C1917",
        "sub_color": "#B45309",
        "accent": "#059669",
        "label_bg": "#059669",
        "label_text": "#FFFFFF",
        "footer_accent": "#059669",
        "footer_dim": "#A8A29E",
        "deco": "#E7E5E0",
        "desc": "크림/라이트"
    },
    "D_slate_blue": {
        "bg": "#0F1729",
        "title_color": "#FFFFFF",
        "sub_color": "#FBBF24",
        "accent": "#3B82F6",
        "label_bg": "#3B82F6",
        "label_text": "#FFFFFF",
        "footer_accent": "#3B82F6",
        "footer_dim": "#475569",
        "deco": "#1A2540",
        "desc": "슬레이트 블루"
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
    draw_text_wrapped(d, "치킨집 349개의\n3년치 데이터를\n분석했습니다.", 70, 240, 940, font(58, 8), C(s["title_color"]), 1.25)

    # 서브
    draw_text_wrapped(d, "배달 매출을 결정하는 건\n리뷰가 아니었습니다.", 70, 620, 940, font(40, 6), C(s["sub_color"]), 1.3)

    # 데코 숫자
    d.text((70, 950), "349", fill=C(s["deco"]), font=font(260, 8))

    # 하단
    y = H - 90
    d.line([(70, y), (W - 70, y)], fill=C(s["deco"]), width=1)
    d.text((70, y + 25), "BDM Lab", fill=C(s["footer_accent"]), font=font(22, 6))
    d.text((200, y + 27), "빅데이터 마케팅 랩", fill=C(s["footer_dim"]), font=font(18, 0))

    # 옵션 표시
    d.text((W - 200, y + 25), name[0], fill=C(s["footer_dim"]), font=font(22, 6))

    path = os.path.join(OUT, f"sample_{name}.png")
    img.save(path, quality=95)
    print(f"  {name}: {s['desc']} → {path}")

print("\nDone!")
