"""
Population prediction project visuals
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import numpy as np
import os

IMG = '/Users/boramlim/Dropbox/Website-BigDMKTG/public/images/projects/population/'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/population/'
os.makedirs(IMG, exist_ok=True)

plt.rcParams['font.family'] = 'Apple SD Gothic Neo'
plt.rcParams['axes.unicode_minus'] = False

ACCENT = '#00C96E'
BLUE = '#3498DB'
ORANGE = '#E67E22'
RED = '#E74C3C'
PURPLE = '#9B59B6'
DARK = '#111111'
GRAY = '#666666'
WHITE = '#F0F0F0'

# ── Chart 1: Prediction accuracy by population segment ──
fig, ax = plt.subplots(figsize=(12, 6), facecolor=DARK)
ax.set_facecolor(DARK)

targets = ['고령 인구\n변화', '청년(20~34세)\n인구 변화', '전체 인구\n유입 변화', '영유아(0~4세)\n인구 변화']
r2_vals = [0.500, 0.478, 0.473, 0.364]
colors = [PURPLE, BLUE, ACCENT, ORANGE]

bars = ax.bar(targets, r2_vals, color=colors, width=0.55, edgecolor='none')
for bar, val in zip(bars, r2_vals):
    ax.text(bar.get_x() + bar.get_width()/2, val + 0.015,
            f'R² {val:.1%}', ha='center', va='bottom', fontsize=18, fontweight='bold', color=WHITE)

ax.set_ylim(0, 0.65)
ax.set_ylabel('예측 설명력 (R²)', fontsize=15, color=WHITE)
ax.set_title('인구 세그먼트별 5년 후 변화 예측 정확도', fontsize=19, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=14)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.yaxis.set_major_formatter(mticker.PercentFormatter(1.0, decimals=0))

plt.tight_layout()
plt.savefig(IMG + 'chart_segment_accuracy.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'chart_segment_accuracy.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: chart_segment_accuracy.png")
plt.close()


# ── Chart 2: Key factors driving population change ──
fig, ax = plt.subplots(figsize=(12, 6), facecolor=DARK)
ax.set_facecolor(DARK)

factors = [
    '상업/금융 일자리 수',
    '1인 가구 비율',
    '고령화 지수',
    '주거 형태 (아파트 비율)',
    '자가 주택 비율',
    '제조업 고용',
    '공공서비스 일자리',
    '영유아 부양 비율',
]
importance = [100, 85, 70, 55, 45, 40, 35, 25]
colors_f = [ACCENT, RED, RED, BLUE, BLUE, ORANGE, ORANGE, GRAY]

bars = ax.barh(factors[::-1], importance[::-1], color=colors_f[::-1], height=0.6, edgecolor='none')
for bar, val in zip(bars, importance[::-1]):
    ax.text(val + 2, bar.get_y() + bar.get_height()/2,
            str(val), va='center', fontsize=13, fontweight='bold', color=WHITE)

ax.set_xlabel('상대적 중요도', fontsize=14, color=GRAY)
ax.set_title('인구 변화를 결정하는 핵심 요인', fontsize=19, fontweight='bold', color=WHITE, pad=20)
ax.tick_params(colors=WHITE, labelsize=13)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.set_xlim(0, 120)

# Legend
ax.text(85, 7.3, '경제 활력', fontsize=11, color=ACCENT, fontweight='bold')
ax.text(85, 6.8, '위험 신호', fontsize=11, color=RED, fontweight='bold')
ax.text(85, 6.3, '주거 환경', fontsize=11, color=BLUE, fontweight='bold')

plt.tight_layout()
plt.savefig(IMG + 'chart_pop_factors.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'chart_pop_factors.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: chart_pop_factors.png")
plt.close()


# ── Chart 3: Application flow ──
fig, ax = plt.subplots(figsize=(13, 7), facecolor=DARK)
ax.set_facecolor(DARK)
ax.axis('off')

ax.text(0.5, 0.96, '인구 변화 예측 → 프랜차이즈/리테일 의사결정',
        ha='center', fontsize=20, fontweight='bold', color=WHITE, transform=ax.transAxes)

apps = [
    {'y': 0.76, 'title': '출점 전 인구 리스크 체크',
     'desc': '"이 동네, 5년 후에도 사람이 있을까?" — 신규 출점 전 필수 확인',
     'color': ACCENT},
    {'y': 0.56, 'title': '폐점 후보 지역 사전 탐지',
     'desc': '"청년 인구가 줄고 있는 상권 → 매출 하락이 시간문제"',
     'color': RED},
    {'y': 0.36, 'title': '장기 임대 계약 리스크 평가',
     'desc': '"10년 임대 계약인데, 이 동네 인구가 5년 후에 20% 줄어든다면?"',
     'color': ORANGE},
    {'y': 0.16, 'title': '매출 예측 + 인구 예측 결합',
     'desc': '"지금 매출이 좋아도, 인구가 줄면 미래 매출도 줄어든다" — 복합 리스크 평가',
     'color': BLUE},
]

for app in apps:
    rect = plt.Rectangle((0.04, app['y']-0.06), 0.92, 0.15, facecolor='#1A1A1A',
                          edgecolor=app['color'], linewidth=2, transform=ax.transAxes,
                          clip_on=False, zorder=2, alpha=0.95)
    ax.add_patch(rect)
    ax.text(0.08, app['y']+0.04, app['title'], fontsize=17, fontweight='bold',
            color=app['color'], transform=ax.transAxes, zorder=3)
    ax.text(0.08, app['y']-0.02, app['desc'], fontsize=12, color='#AAAAAA',
            transform=ax.transAxes, zorder=3)

plt.savefig(IMG + 'chart_pop_applications.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'chart_pop_applications.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: chart_pop_applications.png")
plt.close()


# ── Chart 4: Conceptual declining district trajectory ──
fig, ax = plt.subplots(figsize=(12, 6), facecolor=DARK)
ax.set_facecolor(DARK)

np.random.seed(42)
years = np.arange(2005, 2031)

# Growing district
growing = 50000 + np.cumsum(np.random.normal(500, 200, len(years)))
# Stable district
stable = 45000 + np.cumsum(np.random.normal(50, 150, len(years)))
# Declining district
declining = 40000 + np.cumsum(np.random.normal(-600, 300, len(years)))

ax.plot(years[:17], growing[:17], color=ACCENT, linewidth=2.5, label='성장 지역')
ax.plot(years[:17], stable[:17], color=BLUE, linewidth=2.5, label='안정 지역')
ax.plot(years[:17], declining[:17], color=RED, linewidth=2.5, label='감소 지역')

# Prediction zone
ax.axvspan(2021, 2030, alpha=0.1, color=WHITE)
ax.axvline(x=2021, color=GRAY, linestyle='--', alpha=0.5)
ax.text(2021.3, growing[16]+2000, 'AI 예측 구간', fontsize=13, color=GRAY, fontstyle='italic')

# Dashed prediction lines
ax.plot(years[16:], growing[16:], color=ACCENT, linewidth=2, linestyle='--', alpha=0.7)
ax.plot(years[16:], stable[16:], color=BLUE, linewidth=2, linestyle='--', alpha=0.7)
ax.plot(years[16:], declining[16:], color=RED, linewidth=2, linestyle='--', alpha=0.7)

# Warning
ax.annotate('여기에 매장을\n열면 안 됩니다', xy=(2025, declining[20]),
            fontsize=13, fontweight='bold', color=RED, ha='center',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#1A1A1A', edgecolor=RED))

ax.set_xlabel('연도', fontsize=14, color=WHITE)
ax.set_ylabel('인구', fontsize=14, color=WHITE)
ax.set_title('지역별 인구 추이와 AI 예측 — 어디가 줄어드는가?', fontsize=18, fontweight='bold', color=WHITE, pad=20)
ax.legend(fontsize=14, facecolor='#1A1A1A', edgecolor=GRAY, labelcolor=WHITE, loc='upper left')
ax.tick_params(colors=WHITE, labelsize=12)
ax.spines['bottom'].set_color(GRAY)
ax.spines['left'].set_color(GRAY)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x, p: f'{x/1000:.0f}k'))

plt.tight_layout()
plt.savefig(IMG + 'chart_pop_trajectory.png', dpi=200, facecolor=DARK, bbox_inches='tight')
plt.savefig(OUT + 'chart_pop_trajectory.png', dpi=200, facecolor=DARK, bbox_inches='tight')
print("Saved: chart_pop_trajectory.png")
plt.close()

print("\nAll population charts generated!")
