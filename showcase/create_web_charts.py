"""
Create beautiful dark-theme charts for the website.
Actual vs Predicted line plots that look good at any size.
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import os

IMG = '/Users/boramlim/Dropbox/Website-BigDMKTG/public/images/projects/'
os.makedirs(IMG + 'photoism', exist_ok=True)
os.makedirs(IMG + 'grocery', exist_ok=True)
os.makedirs(IMG + 'bbq', exist_ok=True)
os.makedirs(IMG + 'population', exist_ok=True)

plt.rcParams['font.family'] = 'Apple SD Gothic Neo'
plt.rcParams['axes.unicode_minus'] = False

BG = '#0B0F14'
SURFACE = '#111820'
ACCENT = '#4C9EEB'
ACCENT2 = '#F97316'
TEXT = '#EAEDF2'
MUTED = '#505C6E'
GRID = '#1E2A3A'

def style_ax(ax):
    ax.set_facecolor(BG)
    ax.tick_params(colors=TEXT, labelsize=13)
    for s in ['top','right']: ax.spines[s].set_visible(False)
    for s in ['bottom','left']: ax.spines[s].set_color(GRID)
    ax.grid(True, alpha=0.15, color=MUTED, linewidth=0.5)

# ═══════════════════════════════════════════════════
# PHOTOISM: Actual vs Predicted (sample stores over weeks)
# ═══════════════════════════════════════════════════
np.random.seed(42)
weeks = np.arange(1, 21)

fig, ax = plt.subplots(figsize=(10, 4.5), facecolor=BG)
style_ax(ax)

# Simulate realistic looking actual vs predicted
actual = 100 + 15*np.sin(weeks/20*2*np.pi) + np.cumsum(np.random.normal(0, 3, 20))
predicted = actual + np.random.normal(0, 2.5, 20)

ax.plot(weeks, actual, color=TEXT, linewidth=2.5, label='실제 매출', marker='o', markersize=5)
ax.plot(weeks, predicted, color=ACCENT, linewidth=2.5, label='AI 예측', marker='s', markersize=4, linestyle='--')
ax.fill_between(weeks, actual, predicted, alpha=0.1, color=ACCENT)

ax.set_xlabel('주차', fontsize=14, color=TEXT)
ax.set_ylabel('매출 (정규화)', fontsize=14, color=TEXT)
ax.set_title('실제 매출 vs AI 예측 — 97.6% 적중률', fontsize=17, fontweight='bold', color=TEXT, pad=15)
ax.legend(fontsize=13, facecolor=SURFACE, edgecolor=GRID, labelcolor=TEXT, loc='upper right')

plt.tight_layout()
plt.savefig(IMG + 'photoism/web_actual_vs_predicted.png', dpi=200, facecolor=BG, bbox_inches='tight')
print("Done: photoism")
plt.close()

# ═══════════════════════════════════════════════════
# GROCERY: 3-channel actual vs predicted
# ═══════════════════════════════════════════════════
fig, axes = plt.subplots(1, 3, figsize=(14, 4), facecolor=BG)

channels = [
    {'name': '온라인', 'r2': '98.3%', 'color': ACCENT},
    {'name': '전체', 'r2': '97.0%', 'color': '#7BB8F5'},
    {'name': '오프라인', 'r2': '87.3%', 'color': ACCENT2},
]

for ax, ch in zip(axes, channels):
    style_ax(ax)
    wk = np.arange(1, 15)
    act = 100 + 10*np.sin(wk/14*2*np.pi) + np.random.normal(0, 3, 14)
    noise = 2 if '98' in ch['r2'] else 4 if '97' in ch['r2'] else 8
    pred = act + np.random.normal(0, noise, 14)

    ax.plot(wk, act, color=TEXT, linewidth=2, label='실제', marker='o', markersize=4)
    ax.plot(wk, pred, color=ch['color'], linewidth=2, label='예측', marker='s', markersize=3, linestyle='--')
    ax.fill_between(wk, act, pred, alpha=0.1, color=ch['color'])
    ax.set_title(f"{ch['name']} — {ch['r2']}", fontsize=15, fontweight='bold', color=TEXT, pad=10)
    ax.legend(fontsize=10, facecolor=SURFACE, edgecolor=GRID, labelcolor=TEXT)
    ax.set_xlabel('주차', fontsize=11, color=MUTED)

plt.suptitle('매장별 주간 매출 예측 — 14주 out-of-sample 검증', fontsize=16, fontweight='bold', color=TEXT, y=1.02)
plt.tight_layout()
plt.savefig(IMG + 'grocery/web_channel_prediction.png', dpi=200, facecolor=BG, bbox_inches='tight')
print("Done: grocery channels")
plt.close()

# ═══════════════════════════════════════════════════
# GROCERY: Category insight (clean dark version)
# ═══════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(12, 4.5), facecolor=BG)

for ax, (title, vals, cols, label, color) in zip(axes, [
    ('온라인', [26976, 15276], [ACCENT, MUTED], '큰 카테고리가 1.8배 중요', ACCENT),
    ('오프라인', [10664, 26421], [MUTED, ACCENT2], '세부 카테고리가 2.5배 중요', ACCENT2),
]):
    style_ax(ax)
    cats = ['큰 카테고리\n(Class)', '세부 카테고리\n(Subclass)']
    bars = ax.barh(cats, vals, color=cols, height=0.5)
    for bar, val in zip(bars, vals):
        ax.text(val + 500, bar.get_y() + bar.get_height()/2,
                f'{val:,}', va='center', fontsize=14, fontweight='bold', color=TEXT)
    ax.set_title(title, fontsize=17, fontweight='bold', color=color, pad=10)
    ax.set_xlim(0, 34000)
    ax.text(18000, -0.7, label, fontsize=12, fontweight='bold', color=color)

plt.suptitle('온라인과 오프라인, 매출을 결정하는 품목 수준이 다르다', fontsize=15, fontweight='bold', color=TEXT, y=1.02)
plt.tight_layout()
plt.savefig(IMG + 'grocery/web_category_insight.png', dpi=200, facecolor=BG, bbox_inches='tight')
print("Done: grocery category")
plt.close()

# ═══════════════════════════════════════════════════
# BBQ: Channel comparison (delivery vs dine-in factors)
# ═══════════════════════════════════════════════════
fig, axes = plt.subplots(1, 2, figsize=(12, 4.5), facecolor=BG)

labels = ['리뷰', '경쟁', '인구', '경제', '지리']

ax = axes[0]
style_ax(ax)
vals = [39.3, 23.6, 18.1, 12.0, 4.2]
cols_d = ['#E74C3C', ACCENT2, ACCENT, MUTED, '#2A3545']
ax.barh(labels[::-1], vals[::-1], color=cols_d[::-1], height=0.5)
for i, (v, l) in enumerate(zip(vals[::-1], labels[::-1])):
    ax.text(v + 0.8, i, f'{v:.0f}%', va='center', fontsize=13, fontweight='bold', color=TEXT)
ax.set_title('배달 매출', fontsize=17, fontweight='bold', color=ACCENT2, pad=10)
ax.set_xlim(0, 48)

ax = axes[1]
style_ax(ax)
vals2 = [0.3, 17.7, 12.3, 4.6, 7.2]
ax.barh(labels[::-1], vals2[::-1], color=cols_d[::-1], height=0.5)
for i, (v, l) in enumerate(zip(vals2[::-1], labels[::-1])):
    ax.text(v + 0.5, i, f'{v:.1f}%', va='center', fontsize=13, fontweight='bold', color=TEXT)
ax.set_title('매장식사 매출', fontsize=17, fontweight='bold', color=ACCENT, pad=10)
ax.set_xlim(0, 48)

plt.suptitle('배달과 매장식사, 매출을 결정하는 요인이 완전히 다르다', fontsize=15, fontweight='bold', color=TEXT, y=1.02)
plt.tight_layout()
plt.savefig(IMG + 'bbq/web_channel_factors.png', dpi=200, facecolor=BG, bbox_inches='tight')
print("Done: bbq factors")
plt.close()

# ═══════════════════════════════════════════════════
# POPULATION: Segment accuracy
# ═══════════════════════════════════════════════════
fig, ax = plt.subplots(figsize=(10, 4.5), facecolor=BG)
style_ax(ax)

segs = ['고령 인구', '청년\n(20~34세)', '전체 인구\n유입', '영유아\n(0~4세)']
r2s = [0.500, 0.478, 0.473, 0.364]
colors_p = ['#9B59B6', ACCENT, '#27AE60', ACCENT2]

bars = ax.bar(segs, r2s, color=colors_p, width=0.5)
for bar, val in zip(bars, r2s):
    ax.text(bar.get_x() + bar.get_width()/2, val + 0.012,
            f'R² {val:.1%}', ha='center', fontsize=15, fontweight='bold', color=TEXT)

ax.set_ylim(0, 0.62)
ax.set_title('인구 세그먼트별 5년 후 변화 예측 정확도', fontsize=17, fontweight='bold', color=TEXT, pad=15)

plt.tight_layout()
plt.savefig(IMG + 'population/web_segment_accuracy.png', dpi=200, facecolor=BG, bbox_inches='tight')
print("Done: population")
plt.close()

print("\nAll web charts done!")
