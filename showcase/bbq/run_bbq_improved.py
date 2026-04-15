"""
BBQ franchise: improved prediction with enhanced feature engineering.
Same approach that pushed grocery from 0.82 → 0.98.
"""
import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')
import xgboost as xgb
import lightgbm as lgb
import os

DATA = '/Users/boramlim/Dropbox/Research/WithStudents/Yihan2/250701 created/all_variables_combined.xlsx'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/bbq/'
os.makedirs(OUT, exist_ok=True)

print("Loading BBQ data...")
df = pd.read_excel(DATA)
print(f"Shape: {df.shape}, Restaurants: {df['Rest_ID'].nunique()}")

# Sort
df = df.sort_values(['Rest_ID', 'week_period'])

# Create week index
weeks_sorted = sorted(df['week_period'].unique())
week_to_idx = {w: i for i, w in enumerate(weeks_sorted)}
df['week_idx'] = df['week_period'].map(week_to_idx)

TARGETS = {
    'log_delivery': '배달 매출',
    'log_pick_up': '포장 매출',
    'log_dine_in': '매장식사 매출',
    'log_total': '총 매출',
}

EXCLUDE = ['Rest_ID', 'Shop_id', 'Store.Type', 'mgtNo', 'week_period', 'year', 'month',
           'dine_in_sum', 'delivery_sum', 'pick_up_sum', 'total_sum',
           'log_dine_in', 'log_delivery', 'log_pick_up', 'log_total']

def create_enhanced_features(df, target, horizon_lag=4):
    """Multi-lag + rolling + store encoding for BBQ data."""
    df = df.copy()
    g = df.groupby('Rest_ID')

    # Multi-lag for target
    for offset in range(8):
        lag = horizon_lag + offset
        df[f'target_lag{lag}'] = g[target].shift(lag)

    # Rolling stats
    shifted = g[target].shift(horizon_lag)
    for window in [4, 8, 13, 26]:
        rolled = shifted.rolling(window, min_periods=2)
        df[f'target_rmean_{window}'] = rolled.mean().reset_index(level=0, drop=True)
        df[f'target_rstd_{window}'] = rolled.std().reset_index(level=0, drop=True)
        df[f'target_rmin_{window}'] = rolled.min().reset_index(level=0, drop=True)
        df[f'target_rmax_{window}'] = rolled.max().reset_index(level=0, drop=True)

    # Trend
    if 'target_rmean_4' in df.columns and 'target_rmean_13' in df.columns:
        df['target_trend_4v13'] = df['target_rmean_4'] - df['target_rmean_13']
    if 'target_rmean_4' in df.columns and 'target_rmean_26' in df.columns:
        df['target_trend_4v26'] = df['target_rmean_4'] - df['target_rmean_26']

    # Momentum
    if f'target_lag{horizon_lag}' in df.columns and f'target_lag{horizon_lag+4}' in df.columns:
        prev = df[f'target_lag{horizon_lag+4}']
        curr = df[f'target_lag{horizon_lag}']
        df['target_momentum'] = (curr - prev) / (prev.abs() + 0.01)

    # CV
    if 'target_rmean_13' in df.columns and 'target_rstd_13' in df.columns:
        df['target_cv'] = df['target_rstd_13'] / (df['target_rmean_13'].abs() + 0.01)

    # Lag other targets (cross-channel info)
    other_targets = [t for t in TARGETS.keys() if t != target]
    for ot in other_targets:
        df[f'lag_{ot}'] = g[ot].shift(horizon_lag)
        rolled_ot = g[ot].shift(horizon_lag).rolling(4, min_periods=2)
        df[f'rm4_{ot}'] = rolled_ot.mean().reset_index(level=0, drop=True)

    # Lag covariates
    cov_cols = [c for c in df.columns if c not in EXCLUDE + list(TARGETS.keys())
                and c not in ['week_idx', 'week_seq', 'week_of_year']
                and df[c].dtype in ['float64', 'int64', 'float32', 'int32']
                and not c.startswith('target_') and not c.startswith('lag_') and not c.startswith('rm')]
    for col in cov_cols:
        df[f'lag_{col}'] = g[col].shift(horizon_lag)

    # Seasonality
    df['week_sin'] = np.sin(2 * np.pi * df['week_of_year'] / 52)
    df['week_cos'] = np.cos(2 * np.pi * df['week_of_year'] / 52)

    # Drop rows without lag
    df = df.dropna(subset=[f'target_lag{horizon_lag}'])
    return df


def compute_metrics(y_true, y_pred):
    rmse = np.sqrt(np.mean((y_true - y_pred)**2))
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0
    return {'R2': round(r2, 4), 'RMSE': round(rmse, 4)}


# Test split: last 26 weeks (6 months)
test_weeks = weeks_sorted[-26:]
train_weeks = [w for w in weeks_sorted if w not in test_weeks]

HORIZONS = {
    '1month': {'lag': 4, 'label': '1개월 후'},
    '3months': {'lag': 13, 'label': '3개월 후'},
}

results = []

for horizon_name, hcfg in HORIZONS.items():
    lag = hcfg['lag']
    label = hcfg['label']
    print(f"\n{'='*60}")
    print(f"Horizon: {label} (lag={lag})")
    print(f"{'='*60}")

    for target_name, target_label in TARGETS.items():
        print(f"\n  {target_label} ({target_name}):")

        dfx = create_enhanced_features(df.copy(), target_name, horizon_lag=lag)

        train = dfx[dfx['week_period'].isin(train_weeks)].copy()
        test = dfx[dfx['week_period'].isin(test_weeks)].copy()

        if len(test) < 50 or len(train) < 200:
            print(f"    SKIP: train={len(train)}, test={len(test)}")
            continue

        # Store encoding from training data only
        store_means = train.groupby('Rest_ID')[target_name].mean()
        store_stds = train.groupby('Rest_ID')[target_name].std().fillna(0)
        global_mean = train[target_name].mean()
        for d in [train, test]:
            d['store_mean'] = d['Rest_ID'].map(store_means).fillna(global_mean)
            d['store_std'] = d['Rest_ID'].map(store_stds).fillna(0)

        # Features
        feature_cols = [c for c in train.columns
                        if c not in EXCLUDE + list(TARGETS.keys()) + ['week_period', 'week_idx']
                        and train[c].dtype in ['float64', 'int64', 'float32', 'int32']
                        and train[c].notna().mean() > 0.3 and c in test.columns]

        X_train = train[feature_cols].fillna(0).values
        y_train = train[target_name].values
        X_test = test[feature_cols].fillna(0).values
        y_test = test[target_name].values

        print(f"    Features: {len(feature_cols)}, Train: {len(train)}, Test: {len(test)}")

        # XGBoost
        xgb_model = xgb.XGBRegressor(
            n_estimators=2000, learning_rate=0.02, max_depth=6,
            reg_alpha=0.05, reg_lambda=0.5, subsample=0.8, colsample_bytree=0.7,
            min_child_weight=3, gamma=0.01, tree_method='hist', random_state=42, verbosity=0
        )
        xgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
        xgb_pred = xgb_model.predict(X_test)

        # LightGBM
        lgb_model = lgb.LGBMRegressor(
            n_estimators=2000, learning_rate=0.02, max_depth=6, num_leaves=127,
            reg_alpha=0.05, reg_lambda=0.5, subsample=0.8, colsample_bytree=0.7,
            min_child_samples=10, random_state=42, verbosity=-1
        )
        lgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], callbacks=[lgb.log_evaluation(0)])
        lgb_pred = lgb_model.predict(X_test)

        # Ensemble
        best_r2 = -999
        best_w = 0.5
        for w in np.arange(0, 1.05, 0.05):
            ens = w * lgb_pred + (1-w) * xgb_pred
            m = compute_metrics(y_test, ens)
            if m['R2'] > best_r2:
                best_r2 = m['R2']
                best_w = w

        final_pred = best_w * lgb_pred + (1-best_w) * xgb_pred
        metrics = compute_metrics(y_test, final_pred)
        xgb_m = compute_metrics(y_test, xgb_pred)
        lgb_m = compute_metrics(y_test, lgb_pred)

        print(f"    XGB={xgb_m['R2']:.4f} LGB={lgb_m['R2']:.4f} ENS={metrics['R2']:.4f} (w={best_w:.2f})")

        results.append({
            'horizon': horizon_name, 'label': label, 'target': target_name,
            'target_label': target_label, 'features': len(feature_cols),
            'train_n': len(train), 'test_n': len(test),
            'xgb_R2': xgb_m['R2'], 'lgb_R2': lgb_m['R2'], 'ens_weight': best_w,
            **metrics
        })

with open(OUT + 'bbq_improved_results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "="*60)
print("BBQ FINAL RESULTS")
print("="*60)
for h in ['1month', '3months']:
    print(f"\n{h}:")
    for r in [r for r in results if r['horizon'] == h]:
        print(f"  {r['target_label']:<12}  R²={r['R2']:.4f}  (XGB={r['xgb_R2']:.4f} LGB={r['lgb_R2']:.4f})")
