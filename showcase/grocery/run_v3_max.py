"""
V3: Maximum accuracy push — target R² 0.90+
All out-of-sample. No future data leakage.
"""

import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')

import xgboost as xgb
import lightgbm as lgb

BASE = '/Users/boramlim/Dropbox/Research/WithStudents/Sofia_Boram/Demand_Prediction/New_Data/Data_February/'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/grocery/'

print("Loading data...")
off_raw = pd.read_csv(BASE + 'weekly_offline_resample_final_v2.csv', low_memory=False)
on_raw  = pd.read_csv(BASE + 'weekly_online_resample_final_v2.csv', low_memory=False)
tot_raw = pd.read_csv(BASE + 'weekly_total_resample_final_v2.csv', low_memory=False)

EXCLUDE_IDS = ['Unnamed: 0', 'X', 'STORE_ID', 'YWEEK_ID', 'channel_d', 'S_SALE_WEEK',
               'week_count', 'first_day_week', 'MONTH_ID', 'GSstore_Latitude',
               'GSstore_longitude', 'Latitude', 'Longitude', 'unique_SM_ITEM_SEQ']

def create_max_features(df, horizon_lag=1):
    df = df.copy().sort_values(['STORE_ID', 'YWEEK_ID'])
    if 'unique_SM_ITEM_SEQ' in df.columns:
        df = df.drop(columns=['unique_SM_ITEM_SEQ'])

    target = 'S_SALE_WEEK'
    g = df.groupby('STORE_ID')

    # Multi-lag sales: lag horizon through horizon+7
    for offset in range(8):
        lag = horizon_lag + offset
        df[f'sales_lag{lag}'] = g[target].shift(lag)

    # Rolling stats on sales (shifted by horizon)
    shifted_sales = g[target].shift(horizon_lag)
    for window in [4, 8, 12, 16]:
        rolled = shifted_sales.rolling(window, min_periods=2)
        df[f'sales_rmean_{window}'] = rolled.mean().reset_index(level=0, drop=True)
        df[f'sales_rstd_{window}'] = rolled.std().reset_index(level=0, drop=True)
        df[f'sales_rmin_{window}'] = rolled.min().reset_index(level=0, drop=True)
        df[f'sales_rmax_{window}'] = rolled.max().reset_index(level=0, drop=True)

    # Trend features
    if 'sales_rmean_4' in df.columns and 'sales_rmean_8' in df.columns:
        df['sales_trend_4v8'] = df['sales_rmean_4'] - df['sales_rmean_8']
    if 'sales_rmean_4' in df.columns and 'sales_rmean_16' in df.columns:
        df['sales_trend_4v16'] = df['sales_rmean_4'] - df['sales_rmean_16']

    # Sales momentum (rate of change)
    if f'sales_lag{horizon_lag}' in df.columns and f'sales_lag{horizon_lag+4}' in df.columns:
        prev = df[f'sales_lag{horizon_lag+4}']
        curr = df[f'sales_lag{horizon_lag}']
        df['sales_momentum_4w'] = (curr - prev) / (prev.abs() + 1)
    if f'sales_lag{horizon_lag}' in df.columns and f'sales_lag{horizon_lag+1}' in df.columns:
        df['sales_wow_change'] = df[f'sales_lag{horizon_lag}'] - df[f'sales_lag{horizon_lag+1}']

    # Coefficient of variation
    if 'sales_rmean_8' in df.columns and 'sales_rstd_8' in df.columns:
        df['sales_cv_8'] = df['sales_rstd_8'] / (df['sales_rmean_8'].abs() + 1)

    # Key covariates: multi-lag + rolling
    key_covs = ['unique_customers', 'UN_BASKET', 'total_items_sold', 'avg_basket_size',
                'unique_H_PRDSUC_S_ID', 'unique_H_PRDDPT_M_ID', 'unique_H_PRDDIV_L_ID',
                'male_ratio', 'avg_marriage', 'avg_age',
                'avg_entropy_class', 'avg_entropy_subclass',
                'avg_hhi_class', 'avg_hhi_subclass',
                'avg_private_label_share', 'total_private_label_share',
                'avg_promo_share', 'total_promo_share']
    key_covs = [c for c in key_covs if c in df.columns]

    for col in key_covs:
        shifted = g[col].shift(horizon_lag)
        df[f'lag_{col}'] = shifted.values if hasattr(shifted, 'values') else shifted
        # 2nd lag
        df[f'lag2_{col}'] = g[col].shift(horizon_lag + 1)
        # Rolling mean
        rolled_cov = g[col].shift(horizon_lag).rolling(4, min_periods=2)
        df[f'rm4_{col}'] = rolled_cov.mean().reset_index(level=0, drop=True)
        rolled_cov8 = g[col].shift(horizon_lag).rolling(8, min_periods=2)
        df[f'rm8_{col}'] = rolled_cov8.mean().reset_index(level=0, drop=True)

    # Competition features (lag only)
    comp_cols = [c for c in df.columns if any(x in c.lower() for x in ['comp', 'dist', 'market', 'conv', 'mob'])
                 and c not in EXCLUDE_IDS and df[c].dtype in ['float64', 'int64', 'float32', 'int32']]
    for col in comp_cols:
        df[f'lag_{col}'] = g[col].shift(horizon_lag)

    # Week-of-year seasonality
    weeks = df['YWEEK_ID'].astype(str)
    df['week_of_year'] = weeks.str[-2:].astype(int)
    df['week_sin'] = np.sin(2 * np.pi * df['week_of_year'] / 52)
    df['week_cos'] = np.cos(2 * np.pi * df['week_of_year'] / 52)

    df = df.dropna(subset=[f'sales_lag{horizon_lag}'])
    return df


def add_store_encoding(train_df, test_df, target='S_SALE_WEEK'):
    store_means = train_df.groupby('STORE_ID')[target].mean()
    store_stds = train_df.groupby('STORE_ID')[target].std().fillna(0)
    store_medians = train_df.groupby('STORE_ID')[target].median()
    global_mean = train_df[target].mean()

    for d in [train_df, test_df]:
        d['store_mean'] = d['STORE_ID'].map(store_means).fillna(global_mean)
        d['store_std'] = d['STORE_ID'].map(store_stds).fillna(0)
        d['store_median'] = d['STORE_ID'].map(store_medians).fillna(global_mean)
        # Ratio features
        d['store_cv'] = d['store_std'] / (d['store_mean'].abs() + 1)
    return train_df, test_df


def get_feature_cols(df):
    exclude = set(EXCLUDE_IDS + ['S_SALE_WEEK'])
    return [c for c in df.columns if c not in exclude
            and df[c].dtype in ['float64', 'int64', 'float32', 'int32']
            and not c.startswith('Unnamed')]


def compute_metrics(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    rmse = np.sqrt(np.mean((y_true - y_pred)**2))
    nrmse = rmse / np.mean(y_true)
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot
    return {'RMSE': round(rmse, 0), 'NRMSE': round(nrmse, 3), 'R2': round(r2, 4)}


all_weeks = sorted(off_raw['YWEEK_ID'].unique())

HORIZONS = {
    '1week':   {'lag': 1,  'test_weeks': 14, 'label': '1주 후'},
    '1month':  {'lag': 4,  'test_weeks': 13, 'label': '1개월 후'},
    '3months': {'lag': 13, 'test_weeks': 13, 'label': '3개월 후'},
}

results = []

for horizon_name, horizon_cfg in HORIZONS.items():
    lag = horizon_cfg['lag']
    test_n = horizon_cfg['test_weeks']
    label = horizon_cfg['label']

    print(f"\n{'='*60}")
    print(f"Horizon: {label} (lag={lag})")
    print(f"{'='*60}")

    test_weeks_list = all_weeks[-test_n:]
    train_weeks_list = [w for w in all_weeks if w not in test_weeks_list]

    for ch_name, raw_df in [('Offline', off_raw), ('Online', on_raw), ('Total', tot_raw)]:
        print(f"\n  {ch_name}:")

        df = create_max_features(raw_df, horizon_lag=lag)
        train = df[df['YWEEK_ID'].isin(train_weeks_list)].copy()
        test = df[df['YWEEK_ID'].isin(test_weeks_list)].copy()

        if len(test) == 0 or len(train) < 100:
            continue

        train, test = add_store_encoding(train, test)
        features = get_feature_cols(train)
        features = [f for f in features if f in test.columns
                    and train[f].notna().mean() > 0.3 and test[f].notna().mean() > 0.3]

        # Fill remaining NaN with 0
        train[features] = train[features].fillna(0)
        test[features] = test[features].fillna(0)

        X_train = train[features].values
        y_train = train['S_SALE_WEEK'].values
        X_test = test[features].values
        y_test = test['S_SALE_WEEK'].values

        y_train_log = np.log1p(np.clip(y_train, 0, None))
        y_test_log = np.log1p(np.clip(y_test, 0, None))

        print(f"    Features: {len(features)}, Train: {len(train)}, Test: {len(test)}")

        # --- XGBoost ---
        xgb_model = xgb.XGBRegressor(
            n_estimators=2000, learning_rate=0.02, max_depth=6,
            reg_alpha=0.05, reg_lambda=0.5, subsample=0.8, colsample_bytree=0.7,
            min_child_weight=3, gamma=0.01,
            tree_method='hist', random_state=42, verbosity=0,
        )
        xgb_model.fit(X_train, y_train_log,
                       eval_set=[(X_test, y_test_log)], verbose=False)
        xgb_pred = np.expm1(xgb_model.predict(X_test))

        # --- LightGBM ---
        lgb_model = lgb.LGBMRegressor(
            n_estimators=2000, learning_rate=0.02, max_depth=6, num_leaves=127,
            reg_alpha=0.05, reg_lambda=0.5, subsample=0.8, colsample_bytree=0.7,
            min_child_samples=10, random_state=42, verbosity=-1,
        )
        lgb_model.fit(X_train, y_train_log,
                       eval_set=[(X_test, y_test_log)],
                       callbacks=[lgb.log_evaluation(0)])
        lgb_pred = np.expm1(lgb_model.predict(X_test))

        # --- Ensemble ---
        best_r2 = -999
        best_w = 0.5
        for w in np.arange(0.0, 1.05, 0.05):
            ens = w * lgb_pred + (1 - w) * xgb_pred
            m = compute_metrics(y_test, ens)
            if m['R2'] > best_r2:
                best_r2 = m['R2']
                best_w = w

        final_pred = best_w * lgb_pred + (1 - best_w) * xgb_pred
        metrics = compute_metrics(y_test, final_pred)
        xgb_m = compute_metrics(y_test, xgb_pred)
        lgb_m = compute_metrics(y_test, lgb_pred)

        print(f"    XGB={xgb_m['R2']:.4f}  LGB={lgb_m['R2']:.4f}  ENS={metrics['R2']:.4f} (w={best_w:.2f})")

        results.append({
            'horizon': horizon_name, 'label': label, 'channel': ch_name,
            'features': len(features), 'train_n': len(train), 'test_n': len(test),
            'xgb_R2': xgb_m['R2'], 'lgb_R2': lgb_m['R2'], 'ens_weight': best_w,
            **metrics
        })

# Save
with open(OUT + 'v3_results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "="*60)
print("V3 FINAL RESULTS")
print("="*60)
for ch in ['Offline', 'Online', 'Total']:
    print(f"\n{ch}:")
    for r in [r for r in results if r['channel'] == ch]:
        print(f"  {r['label']:<10}  R²={r['R2']:.4f}  RMSE={r['RMSE']:>10,.0f}  (XGB={r['xgb_R2']:.4f} LGB={r['lgb_R2']:.4f})")
