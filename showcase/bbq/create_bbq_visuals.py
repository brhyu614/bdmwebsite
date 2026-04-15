"""BBQ franchise pitch deck visuals."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import os

IMG = '/Users/boramlim/Dropbox/Website-BigDMKTG/public/images/projects/bbq/'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/bbq/'
os.makedirs(IMG, exist_ok=True)

plt.rcParams['font.family'] = 'Apple SD Gothic Neo'
plt.rcParams['axes.unicode_minus'] = False

ACCENT = '#00C96E'; BLUE = '#3498DB'; ORANGE = '#E67E22'; RED = '#E74C3C'
PURPLE = '#9B59B6'; DARK = '#111111'; GRAY = '#666666'; WHITE = '#F0F0F0'

# ── 1. Channel accuracy ──
fig, ax = plt.subplots(figsize=(11, 6), facecolor=DARK)
ax.set_facecolor(DARK)
channels = ['매장식사', '총 매출', '배달', '포장']
r2 = [0.960, 0.804, 0.783, 0.670]
colors = [ACCENT, BLUE, ORANGE, PURPLE]
bars = ax.bar(channels, r2, color=colors, width=0.5)
for bar, val in zip(bars, r2):
    ax.text(bar.get_x()+bar.get_width()/2, val+0.015, f'{val:.0%}',
            ha='center', fontsize=22, fontweight='bold', color=WHITE)
ax.set_ylim(0, 1.1)
ax.set_ylabel('예측 정확도 (R²)', fontsize=15, color=WHITE)
ax.set_title('채널별 매출 예측 정확도 — 349개 프랜차이즈 매장', fontsize=19, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=15)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)
ax.yaxis.set_major_formatter(mticker.PercentFormatter(1.0, decimals=0))
plt.tight_layout()
plt.savefig(OUT+'bbq_channel_accuracy.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(IMG+'bbq_channel_accuracy.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("1 done")
plt.close()

# ── 2. 배달 매출 결정 요인 ──
fig, ax = plt.subplots(figsize=(12, 6), facecolor=DARK)
ax.set_facecolor(DARK)
factors_del = ['리뷰 (내용 분석)', '경쟁 환경', '인구·상권 특성', '경제 지표', '도로·지리']
imp_del = [39.3, 23.6, 18.1, 12.0, 4.2]
colors_d = [RED, ORANGE, BLUE, GRAY, '#555555']
bars = ax.barh(factors_del[::-1], imp_del[::-1], color=colors_d[::-1], height=0.55)
for bar, val in zip(bars, imp_del[::-1]):
    ax.text(val+0.8, bar.get_y()+bar.get_height()/2, f'{val:.0f}%',
            va='center', fontsize=15, fontweight='bold', color=WHITE)
ax.set_xlabel('예측 기여도 (%)', fontsize=14, color=GRAY)
ax.set_title('배달 매출을 결정하는 요인', fontsize=19, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=14)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)
ax.set_xlim(0, 50)
plt.tight_layout()
plt.savefig(OUT+'bbq_delivery_factors.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(IMG+'bbq_delivery_factors.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("2 done")
plt.close()

# ── 3. 매장식사 매출 결정 요인 ──
fig, ax = plt.subplots(figsize=(12, 6), facecolor=DARK)
ax.set_facecolor(DARK)
factors_dine = ['경쟁 환경', '인구·상권 특성', '도로·지리', '경제 지표', '리뷰']
imp_dine = [17.7, 12.3, 7.2, 4.6, 0.3]
colors_dn = [ORANGE, BLUE, '#555555', GRAY, RED]
bars = ax.barh(factors_dine[::-1], imp_dine[::-1], color=colors_dn[::-1], height=0.55)
for bar, val in zip(bars, imp_dine[::-1]):
    ax.text(val+0.5, bar.get_y()+bar.get_height()/2, f'{val:.1f}%',
            va='center', fontsize=15, fontweight='bold', color=WHITE)
ax.set_xlabel('예측 기여도 (%)', fontsize=14, color=GRAY)
ax.set_title('매장식사 매출을 결정하는 요인 — 리뷰는 거의 영향 없음', fontsize=19, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=14)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)
ax.set_xlim(0, 25)
plt.tight_layout()
plt.savefig(OUT+'bbq_dinein_factors.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(IMG+'bbq_dinein_factors.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("3 done")
plt.close()

# ── 4. 배달 vs 매장식사 비교 ──
fig, axes = plt.subplots(1, 2, figsize=(14, 5), facecolor=DARK)
labels = ['리뷰', '경쟁', '인구', '경제', '지리']

# 배달
ax = axes[0]
ax.set_facecolor(DARK)
vals = [39.3, 23.6, 18.1, 12.0, 4.2]
cols = [RED, ORANGE, BLUE, GRAY, '#555']
ax.bar(labels, vals, color=cols, width=0.5)
for i, v in enumerate(vals):
    ax.text(i, v+1, f'{v:.0f}%', ha='center', fontsize=14, fontweight='bold', color=WHITE)
ax.set_title('배달 매출', fontsize=18, fontweight='bold', color=ORANGE, pad=15)
ax.set_ylim(0, 50)
ax.tick_params(colors=WHITE, labelsize=13)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)

# 매장식사
ax = axes[1]
ax.set_facecolor(DARK)
vals2 = [0.3, 17.7, 12.3, 4.6, 7.2]
ax.bar(labels, vals2, color=cols, width=0.5)
for i, v in enumerate(vals2):
    ax.text(i, v+1, f'{v:.1f}%', ha='center', fontsize=14, fontweight='bold', color=WHITE)
ax.set_title('매장식사 매출', fontsize=18, fontweight='bold', color=ACCENT, pad=15)
ax.set_ylim(0, 50)
ax.tick_params(colors=WHITE, labelsize=13)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)

plt.suptitle('배달과 매장식사, 매출을 결정하는 요인이 완전히 다르다', fontsize=17, fontweight='bold', color=WHITE, y=1.02)
plt.tight_layout()
plt.savefig(OUT+'bbq_channel_comparison.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(IMG+'bbq_channel_comparison.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("4 done")
plt.close()

# ── 5. 자기잠식 거리별 효과 ──
fig, ax = plt.subplots(figsize=(11, 6), facecolor=DARK)
ax.set_facecolor(DARK)
distances = ['100m', '300m', '500m', '1km']
effect = [5.0, 4.0, 3.0, 2.0]  # relative
bars = ax.bar(distances, effect, color=[RED, ORANGE, ORANGE, GRAY], width=0.45)
for bar, val, lbl in zip(bars, effect, ['가장 강함', '강함', '중간', '약하지만 존재']):
    ax.text(bar.get_x()+bar.get_width()/2, val+0.15, lbl,
            ha='center', fontsize=14, fontweight='bold', color=WHITE)
ax.set_ylabel('자기잠식 강도', fontsize=14, color=WHITE)
ax.set_xlabel('같은 브랜드 매장까지의 거리', fontsize=14, color=WHITE)
ax.set_title('같은 브랜드가 가까울수록 매출이 줄어든다 (자기잠식)', fontsize=18, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=14)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)
ax.set_ylim(0, 6.5)
ax.set_yticks([])
plt.tight_layout()
plt.savefig(OUT+'bbq_cannibalization.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(IMG+'bbq_cannibalization.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("5 done")
plt.close()

# ── 6. 리뷰 주제별 매출 영향력 ──
fig, ax = plt.subplots(figsize=(11, 5), facecolor=DARK)
ax.set_facecolor(DARK)
topics = ['음식 품질\n언급', '서비스\n언급', '재구매 의향\n언급', '가격\n언급']
imp_topics = [5.5, 3.3, 2.5, 2.9]
cols_t = [RED, ORANGE, BLUE, GRAY]
bars = ax.bar(topics, imp_topics, color=cols_t, width=0.45)
for bar, val in zip(bars, imp_topics):
    ax.text(bar.get_x()+bar.get_width()/2, val+0.15, f'{val:.1f}%',
            ha='center', fontsize=16, fontweight='bold', color=WHITE)
ax.set_ylabel('배달 매출 예측 기여도 (%)', fontsize=13, color=WHITE)
ax.set_title('어떤 리뷰가 매출에 영향을 미치는가 — "맛있다"가 핵심', fontsize=18, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=14)
for s in ['top','right']: ax.spines[s].set_visible(False)
for s in ['bottom','left']: ax.spines[s].set_color(GRAY)
ax.set_ylim(0, 7.5)
plt.tight_layout()
plt.savefig(OUT+'bbq_review_impact.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(IMG+'bbq_review_impact.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("6 done")
plt.close()

print("\nAll BBQ charts generated!")
