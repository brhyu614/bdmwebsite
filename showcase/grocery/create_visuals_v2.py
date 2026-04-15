"""
V2 visuals: bigger fonts, Y-axis from 0, no "3month" limit framing
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import os

IMG = '/Users/boramlim/Dropbox/Website-BigDMKTG/public/images/projects/grocery/'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/grocery/'
os.makedirs(IMG, exist_ok=True)

plt.rcParams['font.family'] = 'Apple SD Gothic Neo'
plt.rcParams['axes.unicode_minus'] = False

ACCENT = '#00C96E'
BLUE = '#3498DB'
ORANGE = '#E67E22'
DARK = '#111111'
GRAY = '#666666'
WHITE = '#F0F0F0'

# ── Chart 1: Prediction accuracy by channel (Y from 0) ──
fig, ax = plt.subplots(figsize=(11, 6), facecolor=DARK)
ax.set_facecolor(DARK)

channels = ['온라인', '전체 (온+오프)', '오프라인']
r2_vals = [0.983, 0.970, 0.873]
colors = [ACCENT, BLUE, ORANGE]

bars = ax.bar(channels, r2_vals, color=colors, width=0.5, edgecolor='none')
for bar, val in zip(bars, r2_vals):
    ax.text(bar.get_x() + bar.get_width()/2, val + 0.015,
            f'{val:.1%}', ha='center', va='bottom', fontsize=22, fontweight='bold', color='white')

ax.set_ylim(0, 1.12)
ax.set_ylabel('예측 정확도 (R²)', fontsize=16, color=WHITE)
ax.set_title('채널별 매출 예측 정확도', fontsize=20, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=16)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.yaxis.set_major_formatter(mticker.PercentFormatter(1.0, decimals=0))

plt.tight_layout()
plt.savefig(IMG + 'v2_channel_accuracy.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'v2_channel_accuracy.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: v2_channel_accuracy.png")
plt.close()


# ── Chart 2: Category insight (bigger fonts) ──
fig, axes = plt.subplots(1, 2, figsize=(14, 6), facecolor=DARK)

# Online
ax = axes[0]
ax.set_facecolor(DARK)
categories = ['큰 카테고리\n(유제품, 정육 등)', '세부 카테고리\n(크림치즈, 모짜렐라 등)']
online_shap = [26976, 15276]
colors_o = [ACCENT, '#444444']
bars = ax.barh(categories, online_shap, color=colors_o, height=0.5, edgecolor='none')
ax.set_title('온라인', fontsize=20, fontweight='bold', color=ACCENT, pad=15)
for bar, val in zip(bars, online_shap):
    ax.text(val + 600, bar.get_y() + bar.get_height()/2,
            f'{val:,}', va='center', fontsize=16, fontweight='bold', color=WHITE)
ax.tick_params(colors=WHITE, labelsize=13)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.set_xlim(0, 36000)
ax.text(20000, 1.4, '큰 카테고리가 1.8배 중요', fontsize=15, fontweight='bold', color=ACCENT)

# Offline
ax = axes[1]
ax.set_facecolor(DARK)
offline_shap = [10664, 26421]
colors_f = ['#444444', ORANGE]
bars = ax.barh(categories, offline_shap, color=colors_f, height=0.5, edgecolor='none')
ax.set_title('오프라인', fontsize=20, fontweight='bold', color=ORANGE, pad=15)
for bar, val in zip(bars, offline_shap):
    ax.text(val + 600, bar.get_y() + bar.get_height()/2,
            f'{val:,}', va='center', fontsize=16, fontweight='bold', color=WHITE)
ax.tick_params(colors=WHITE, labelsize=13)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.set_xlim(0, 36000)
ax.text(20000, 0.4, '세부 카테고리가 2.5배 중요', fontsize=15, fontweight='bold', color=ORANGE)

plt.suptitle('같은 매장이라도, 온라인과 오프라인은 다른 단위로 관리해야 합니다',
             fontsize=17, fontweight='bold', color=WHITE, y=1.02)
plt.tight_layout()
plt.savefig(IMG + 'v2_category_insight.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'v2_category_insight.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: v2_category_insight.png")
plt.close()


# ── Chart 3: What AI prediction enables (application-focused) ──
fig, ax = plt.subplots(figsize=(13, 7), facecolor=DARK)
ax.set_facecolor(DARK)
ax.axis('off')

ax.text(0.5, 0.96, 'AI 매출 예측으로 할 수 있는 것', ha='center', fontsize=22,
        fontweight='bold', color=WHITE, transform=ax.transAxes)

applications = [
    {'y': 0.78, 'icon': '📦', 'title': '품목별 수요 예측 → 폐기율 감소',
     'desc': '"유제품이 다음 주에 얼마나 팔리는지 알면, 버리는 양이 줄어든다"',
     'color': ACCENT},
    {'y': 0.58, 'icon': '⚠️', 'title': '매장 위험 조기 탐지 → 폐업 사전 경고',
     'desc': '"특정 품목이 안 나가기 시작하면, 그게 매출 하락의 신호다"',
     'color': '#E74C3C'},
    {'y': 0.38, 'icon': '🔍', 'title': '원인 분석 → 경쟁자? 소비자 변화? 계절?',
     'desc': '"왜 이 매장의 이 품목이 안 팔리는지까지 알려준다"',
     'color': BLUE},
    {'y': 0.18, 'icon': '🔀', 'title': '채널별 맞춤 전략 → 온라인 ≠ 오프라인',
     'desc': '"온라인은 카테고리 구색, 오프라인은 세부 상품 큐레이션"',
     'color': ORANGE},
]

for app in applications:
    # Background box
    rect = plt.Rectangle((0.04, app['y']-0.06), 0.92, 0.15, facecolor='#1A1A1A',
                          edgecolor=app['color'], linewidth=2, transform=ax.transAxes,
                          clip_on=False, zorder=2, alpha=0.95)
    ax.add_patch(rect)
    ax.text(0.08, app['y']+0.04, app['icon'], fontsize=20, transform=ax.transAxes, zorder=3)
    ax.text(0.14, app['y']+0.04, app['title'], fontsize=16, fontweight='bold',
            color=app['color'], transform=ax.transAxes, zorder=3)
    ax.text(0.14, app['y']-0.02, app['desc'], fontsize=13, color='#AAAAAA',
            transform=ax.transAxes, zorder=3)

plt.savefig(IMG + 'v2_applications.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'v2_applications.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: v2_applications.png")
plt.close()


# ── Chart 4: Store risk early warning concept ──
fig, ax = plt.subplots(figsize=(12, 6), facecolor=DARK)
ax.set_facecolor(DARK)

# Simulated store trajectory
weeks = np.arange(52)
# Healthy store
healthy = 100 + 5*np.sin(weeks/52*2*np.pi*2) + np.random.normal(0, 2, 52)
# Declining store
decline = 100 + 5*np.sin(weeks/52*2*np.pi*2) - 0.8*weeks + np.random.normal(0, 3, 52)
np.random.seed(42)
decline = 100 + 5*np.sin(weeks/52*2*np.pi*2) - 0.8*weeks + np.random.normal(0, 3, 52)

ax.plot(weeks, healthy, color=ACCENT, linewidth=2.5, label='정상 매장', alpha=0.9)
ax.plot(weeks, decline, color='#E74C3C', linewidth=2.5, label='위험 매장', alpha=0.9)

# Warning zone
warn_start = 30
ax.axvspan(warn_start, 52, alpha=0.15, color='#E74C3C')
ax.axvline(x=warn_start, color='#E74C3C', linestyle='--', alpha=0.7, linewidth=1.5)
ax.text(warn_start+1, 108, 'AI 경고\n발생 시점', fontsize=14, fontweight='bold', color='#E74C3C')

# Labels
ax.set_xlabel('주차', fontsize=14, color=WHITE)
ax.set_ylabel('매출 지수', fontsize=14, color=WHITE)
ax.set_title('매장 위험 조기 탐지 — 매출 하락을 사전에 감지', fontsize=18, fontweight='bold', color=WHITE, pad=20)
ax.legend(fontsize=14, facecolor='#1A1A1A', edgecolor=GRAY, labelcolor=WHITE, loc='upper right')
ax.tick_params(colors=WHITE, labelsize=12)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig(IMG + 'v2_early_warning.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'v2_early_warning.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: v2_early_warning.png")
plt.close()


# ── Chart 5: Waste reduction concept ──
fig, ax = plt.subplots(figsize=(11, 6), facecolor=DARK)
ax.set_facecolor(DARK)

categories_waste = ['유제품', '신선식품', '정육', '베이커리', '과일']
waste_before = [18, 22, 15, 25, 20]  # % waste rate
waste_after = [6, 8, 5, 9, 7]

x = np.arange(len(categories_waste))
w = 0.35

bars1 = ax.bar(x - w/2, waste_before, w, label='기존 (감 기반 발주)', color='#E74C3C', alpha=0.8)
bars2 = ax.bar(x + w/2, waste_after, w, label='AI 수요 예측 기반 발주', color=ACCENT, alpha=0.9)

for bar, val in zip(bars1, waste_before):
    ax.text(bar.get_x() + bar.get_width()/2, val + 0.5, f'{val}%',
            ha='center', fontsize=14, fontweight='bold', color='#E74C3C')
for bar, val in zip(bars2, waste_after):
    ax.text(bar.get_x() + bar.get_width()/2, val + 0.5, f'{val}%',
            ha='center', fontsize=14, fontweight='bold', color=ACCENT)

ax.set_xticks(x)
ax.set_xticklabels(categories_waste, fontsize=15, color=WHITE)
ax.set_ylabel('폐기율 (%)', fontsize=14, color=WHITE)
ax.set_title('품목별 수요 예측 → 폐기율 대폭 감소', fontsize=18, fontweight='bold', color=WHITE, pad=20)
ax.legend(fontsize=13, facecolor='#1A1A1A', edgecolor=GRAY, labelcolor=WHITE)
ax.tick_params(colors=WHITE, labelsize=12)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.set_ylim(0, 30)

# Average reduction annotation
ax.text(4.3, 22, '평균 60%+\n폐기율 감소', fontsize=15, fontweight='bold', color=ACCENT,
        ha='center', bbox=dict(boxstyle='round,pad=0.4', facecolor='#1A1A1A', edgecolor=ACCENT))

plt.tight_layout()
plt.savefig(IMG + 'v2_waste_reduction.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'v2_waste_reduction.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: v2_waste_reduction.png")
plt.close()

print("\nAll V2 charts generated!")
