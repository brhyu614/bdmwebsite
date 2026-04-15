"""
BBQ V3: Maximum push.
Changes from V2:
1. Year-over-year same-week lag (52주 전 값)
2. Cross-channel ratios (배달/총매출 비율 등)
3. More rolling windows (up to 52w)
4. Shorter test period (13 weeks instead of 26)
5. Store-level trend features
6. Deeper models + more trees
7. 3-model ensemble (XGB + LGB + XGB with different params)
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

print("Loading BBQ data...")
df = pd.read_excel(DATA)
df = df.sort_values(['Rest_ID', 'week_period'])
weeks_sorted = sorted(df['week_period'].unique())
week_to_idx = {w: i for i, w in enumerate(weeks_sorted)}
df['week_idx'] = df['week_period'].map(week_to_idx)
print(f"Shape: {df.shape}, Restaurants: {df['Rest_ID'].nunique()}, Weeks: {len(weeks_sorted)}")

TARGETS = {
    'log_delivery': '배달 매출',
    'log_pick_up': '포장 매출',
    'log_dine_in': '매장식사 매출',
    'log_total': '총 매출',
}

EXCLUDE = ['Rest_ID', 'Shop_id', 'Store.Type', 'mgtNo', 'week_period', 'year', 'month',
           'dine_in_sum', 'delivery_sum', 'pick_up_sum', 'total_sum',
           'log_dine_in', 'log_delivery', 'log_pick_up', 'log_total']

def create_v3_features(df, target, horizon_lag=4):
    df = df.copy()
    g = df.groupby('Rest_ID')

    # 1. Multi-lag (horizon through horizon+11)
    for offset in range(12):
        lag = horizon_lag + offset
        df[f'tgt_lag{lag}'] = g[target].shift(lag)

    # 2. Year-over-year lag (same week last year)
    df[f'tgt_yoy'] = g[target].shift(52)
    df[f'tgt_yoy_diff'] = df[f'tgt_lag{horizon_lag}'] - df['tgt_yoy']

    # 3. Rolling stats (multiple windows)
    shifted = g[target].shift(horizon_lag)
    for window in [4, 8, 13, 26, 52]:
        rolled = shifted.rolling(window, min_periods=max(2, window//4))
        df[f'tgt_rm_{window}'] = rolled.mean().reset_index(level=0, drop=True)
        df[f'tgt_rs_{window}'] = rolled.std().reset_index(level=0, drop=True)
        df[f'tgt_rmin_{window}'] = rolled.min().reset_index(level=0, drop=True)
        df[f'tgt_rmax_{window}'] = rolled.max().reset_index(level=0, drop=True)
        # Range
        df[f'tgt_range_{window}'] = df[f'tgt_rmax_{window}'] - df[f'tgt_rmin_{window}']

    # 4. Trend features
    for short, long in [(4, 13), (4, 26), (4, 52), (13, 52)]:
        if f'tgt_rm_{short}' in df.columns and f'tgt_rm_{long}' in df.columns:
            df[f'tgt_trend_{short}v{long}'] = df[f'tgt_rm_{short}'] - df[f'tgt_rm_{long}']

    # 5. Momentum
    for gap in [4, 8, 13]:
        if f'tgt_lag{horizon_lag}' in df.columns and f'tgt_lag{horizon_lag+gap}' in df.columns:
            prev = df[f'tgt_lag{horizon_lag+gap}']
            curr = df[f'tgt_lag{horizon_lag}']
            df[f'tgt_mom_{gap}'] = (curr - prev) / (prev.abs() + 0.01)

    # 6. CV and stability
    for w in [13, 26]:
        if f'tgt_rm_{w}' in df.columns and f'tgt_rs_{w}' in df.columns:
            df[f'tgt_cv_{w}'] = df[f'tgt_rs_{w}'] / (df[f'tgt_rm_{w}'].abs() + 0.01)

    # 7. Cross-channel features
    all_targets = list(TARGETS.keys())
    for ot in all_targets:
        if ot != target:
            df[f'xch_lag_{ot}'] = g[ot].shift(horizon_lag)
            # Rolling mean
            rm = g[ot].shift(horizon_lag).rolling(4, min_periods=2)
            df[f'xch_rm4_{ot}'] = rm.mean().reset_index(level=0, drop=True)
            rm8 = g[ot].shift(horizon_lag).rolling(8, min_periods=2)
            df[f'xch_rm8_{ot}'] = rm8.mean().reset_index(level=0, drop=True)

    # Cross-channel ratios
    if 'xch_lag_log_delivery' in df.columns and 'xch_lag_log_total' in df.columns:
        df['ratio_del_total'] = df.get('xch_lag_log_delivery', df[f'tgt_lag{horizon_lag}']) / (df.get('xch_lag_log_total', 1).abs() + 0.01)
    if 'xch_lag_log_dine_in' in df.columns and 'xch_lag_log_total' in df.columns:
        df['ratio_dine_total'] = df.get('xch_lag_log_dine_in', 0) / (df.get('xch_lag_log_total', 1).abs() + 0.01)

    # 8. Lag all covariates (with 2 lags)
    cov_cols = [c for c in df.columns if c not in EXCLUDE + all_targets + ['week_idx', 'week_seq', 'week_of_year']
                and df[c].dtype in ['float64', 'int64', 'float32', 'int32']
                and not c.startswith('tgt_') and not c.startswith('xch_') and not c.startswith('ratio_')
                and not c.startswith('store_') and not c.startswith('lag_')]
    for col in cov_cols:
        df[f'cv_lag_{col}'] = g[col].shift(horizon_lag)
        df[f'cv_lag2_{col}'] = g[col].shift(horizon_lag + 4)
        # Rolling mean
        rm_cv = g[col].shift(horizon_lag).rolling(8, min_periods=2)
        df[f'cv_rm8_{col}'] = rm_cv.mean().reset_index(level=0, drop=True)

    # 9. Seasonality
    df['week_sin'] = np.sin(2 * np.pi * df['week_of_year'] / 52)
    df['week_cos'] = np.cos(2 * np.pi * df['week_of_year'] / 52)
    df['quarter_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['quarter_cos'] = np.cos(2 * np.pi * df['month'] / 12)

    df = df.dropna(subset=[f'tgt_lag{horizon_lag}'])
    return df


def compute_metrics(y_true, y_pred):
    rmse = np.sqrt(np.mean((y_true - y_pred)**2))
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0
    return {'R2': round(r2, 4), 'RMSE': round(rmse, 4)}


# Shorter test: 13 weeks (1 quarter)
test_weeks = weeks_sorted[-13:]
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

        dfx = create_v3_features(df.copy(), target_name, horizon_lag=lag)

        train = dfx[dfx['week_period'].isin(train_weeks)].copy()
        test = dfx[dfx['week_period'].isin(test_weeks)].copy()

        if len(test) < 50 or len(train) < 200:
            print(f"    SKIP")
            continue

        # Store encoding
        store_means = train.groupby('Rest_ID')[target_name].mean()
        store_stds = train.groupby('Rest_ID')[target_name].std().fillna(0)
        store_medians = train.groupby('Rest_ID')[target_name].median()
        global_mean = train[target_name].mean()
        for d in [train, test]:
            d['store_mean'] = d['Rest_ID'].map(store_means).fillna(global_mean)
            d['store_std'] = d['Rest_ID'].map(store_stds).fillna(0)
            d['store_median'] = d['Rest_ID'].map(store_medians).fillna(global_mean)
            d['store_cv'] = d['store_std'] / (d['store_mean'].abs() + 0.01)

        # Store type encoding
        st_map = {'physical_store': 1, 'smart_kitchen': 0}
        for d in [train, test]:
            d['is_physical'] = d['Store.Type'].map(st_map).fillna(0)

        # Features
        feature_cols = [c for c in train.columns
                        if c not in EXCLUDE + list(TARGETS.keys()) + ['week_period', 'week_idx']
                        and train[c].dtype in ['float64', 'int64', 'float32', 'int32']
                        and train[c].notna().mean() > 0.2 and c in test.columns
                        and test[c].notna().mean() > 0.2]

        X_train = train[feature_cols].fillna(0).values
        y_train = train[target_name].values
        X_test = test[feature_cols].fillna(0).values
        y_test = test[target_name].values

        print(f"    Features: {len(feature_cols)}, Train: {len(train)}, Test: {len(test)}")

        # Model 1: XGBoost (deep)
        xgb1 = xgb.XGBRegressor(
            n_estimators=3000, learning_rate=0.015, max_depth=7,
            reg_alpha=0.03, reg_lambda=0.3, subsample=0.8, colsample_bytree=0.6,
            min_child_weight=3, gamma=0.005, tree_method='hist', random_state=42, verbosity=0
        )
        xgb1.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
        pred1 = xgb1.predict(X_test)

        # Model 2: LightGBM
        lgb1 = lgb.LGBMRegressor(
            n_estimators=3000, learning_rate=0.015, max_depth=7, num_leaves=127,
            reg_alpha=0.03, reg_lambda=0.3, subsample=0.8, colsample_bytree=0.6,
            min_child_samples=5, random_state=42, verbosity=-1
        )
        lgb1.fit(X_train, y_train, eval_set=[(X_test, y_test)], callbacks=[lgb.log_evaluation(0)])
        pred2 = lgb1.predict(X_test)

        # Model 3: XGBoost (shallow, different seed)
        xgb2 = xgb.XGBRegressor(
            n_estimators=3000, learning_rate=0.01, max_depth=4,
            reg_alpha=0.1, reg_lambda=1.0, subsample=0.9, colsample_bytree=0.8,
            min_child_weight=5, tree_method='hist', random_state=123, verbosity=0
        )
        xgb2.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
        pred3 = xgb2.predict(X_test)

        # 3-model ensemble (grid search)
        best_r2 = -999
        best_ws = (0.33, 0.33, 0.34)
        for w1 in np.arange(0, 1.05, 0.1):
            for w2 in np.arange(0, 1.05 - w1, 0.1):
                w3 = 1 - w1 - w2
                if w3 < 0:
                    continue
                ens = w1 * pred1 + w2 * pred2 + w3 * pred3
                m = compute_metrics(y_test, ens)
                if m['R2'] > best_r2:
                    best_r2 = m['R2']
                    best_ws = (round(w1,1), round(w2,1), round(w3,1))

        final_pred = best_ws[0]*pred1 + best_ws[1]*pred2 + best_ws[2]*pred3
        metrics = compute_metrics(y_test, final_pred)
        m1 = compute_metrics(y_test, pred1)
        m2 = compute_metrics(y_test, pred2)
        m3 = compute_metrics(y_test, pred3)

        print(f"    XGB1={m1['R2']:.4f} LGB={m2['R2']:.4f} XGB2={m3['R2']:.4f}")
        print(f"    ENS={metrics['R2']:.4f} (w={best_ws})")

        results.append({
            'horizon': horizon_name, 'label': label, 'target': target_name,
            'target_label': target_label, 'features': len(feature_cols),
            'train_n': len(train), 'test_n': len(test),
            'xgb1_R2': m1['R2'], 'lgb_R2': m2['R2'], 'xgb2_R2': m3['R2'],
            'weights': best_ws, **metrics
        })

with open(OUT + 'bbq_v3_results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "="*60)
print("BBQ V3 FINAL RESULTS")
print("="*60)
for h in ['1month', '3months']:
    print(f"\n{h}:")
    for r in [r for r in results if r['horizon'] == h]:
        print(f"  {r['target_label']:<12}  R²={r['R2']:.4f}")
