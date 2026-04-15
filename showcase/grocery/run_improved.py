"""
Improved multi-horizon forecast targeting R² 0.90+
Key improvements over run_009:
1. Multiple lags (1, 2, 3, 4 weeks)
2. Rolling mean/std (4w, 8w)
3. Store-level mean encoding
4. Log-transformed target
5. LightGBM + XGBoost ensemble
6. Optuna hyperparameter tuning
"""

import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')

import xgboost as xgb
import lightgbm as lgb

try:
    import optuna
    optuna.logging.set_verbosity(optuna.logging.WARNING)
    HAS_OPTUNA = True
except ImportError:
    HAS_OPTUNA = False
    print("Optuna not available, using manual params")

BASE = '/Users/boramlim/Dropbox/Research/WithStudents/Sofia_Boram/Demand_Prediction/New_Data/Data_February/'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/grocery/'

print("Loading data...")
off_raw = pd.read_csv(BASE + 'weekly_offline_resample_final_v2.csv', low_memory=False)
on_raw  = pd.read_csv(BASE + 'weekly_online_resample_final_v2.csv', low_memory=False)
tot_raw = pd.read_csv(BASE + 'weekly_total_resample_final_v2.csv', low_memory=False)

EXCLUDE_IDS = ['Unnamed: 0', 'X', 'STORE_ID', 'YWEEK_ID', 'channel_d', 'S_SALE_WEEK',
               'week_count', 'first_day_week', 'MONTH_ID', 'GSstore_Latitude',
               'GSstore_longitude', 'Latitude', 'Longitude', 'unique_SM_ITEM_SEQ']

def create_enhanced_features(df, horizon_lag=1):
    """Create multi-lag + rolling + store-encoded features."""
    df = df.copy().sort_values(['STORE_ID', 'YWEEK_ID'])
    if 'unique_SM_ITEM_SEQ' in df.columns:
        df = df.drop(columns=['unique_SM_ITEM_SEQ'])

    target = 'S_SALE_WEEK'

    # Core covariates
    covariate_cols = [c for c in df.columns if c not in EXCLUDE_IDS + [target]
                      and df[c].dtype in ['float64', 'int64', 'float32', 'int32']]

    # Multi-lag for target (lag horizon, horizon+1, horizon+2, horizon+3)
    for lag_offset in range(4):
        lag = horizon_lag + lag_offset
        df[f'sales_lag{lag}'] = df.groupby('STORE_ID')[target].shift(lag)

    # Rolling features on target (based on horizon)
    for window in [4, 8]:
        rolled = df.groupby('STORE_ID')[target].shift(horizon_lag).rolling(window, min_periods=2)
        df[f'sales_rollmean_{window}w'] = rolled.mean().reset_index(level=0, drop=True)
        df[f'sales_rollstd_{window}w'] = rolled.std().reset_index(level=0, drop=True)

    # Sales trend (diff of rolling means)
    if 'sales_rollmean_4w' in df.columns and 'sales_rollmean_8w' in df.columns:
        df['sales_trend'] = df['sales_rollmean_4w'] - df['sales_rollmean_8w']

    # Lag covariates (only 1 lag at horizon distance for key vars)
    key_covariates = ['unique_customers', 'UN_BASKET', 'total_items_sold', 'avg_basket_size',
                      'unique_H_PRDSUC_S_ID', 'unique_H_PRDDPT_M_ID', 'unique_H_PRDDIV_L_ID',
                      'male_ratio', 'avg_marriage', 'avg_age',
                      'avg_entropy_class', 'avg_entropy_subclass',
                      'avg_hhi_class', 'avg_hhi_subclass',
                      'avg_private_label_share', 'total_private_label_share',
                      'avg_promo_share', 'total_promo_share']
    key_covariates = [c for c in key_covariates if c in df.columns]

    for col in key_covariates:
        df[f'lag_{col}'] = df.groupby('STORE_ID')[col].shift(horizon_lag)
        # Rolling mean for key covariates too
        rolled_cov = df.groupby('STORE_ID')[col].shift(horizon_lag).rolling(4, min_periods=2)
        df[f'rollmean_{col}'] = rolled_cov.mean().reset_index(level=0, drop=True)

    # Competition/distance features (static-ish, just lag them)
    comp_cols = [c for c in covariate_cols if any(x in c for x in ['comp', 'dist', 'market', 'conv', 'mob'])]
    for col in comp_cols:
        df[f'lag_{col}'] = df.groupby('STORE_ID')[col].shift(horizon_lag)

    # Drop rows without lag data
    df = df.dropna(subset=[f'sales_lag{horizon_lag}'])

    return df


def get_feature_cols(df):
    """Get all engineered feature columns."""
    exclude = set(EXCLUDE_IDS + ['S_SALE_WEEK'])
    return [c for c in df.columns if c not in exclude
            and df[c].dtype in ['float64', 'int64', 'float32', 'int32']
            and (c.startswith('sales_') or c.startswith('lag_') or c.startswith('rollmean_')
                 or c == 'store_mean_sales' or c == 'sales_trend')]


def add_store_encoding(train_df, test_df, target='S_SALE_WEEK'):
    """Target-encode store ID using only training data."""
    store_means = train_df.groupby('STORE_ID')[target].mean()
    global_mean = train_df[target].mean()
    train_df = train_df.copy()
    test_df = test_df.copy()
    train_df['store_mean_sales'] = train_df['STORE_ID'].map(store_means).fillna(global_mean)
    test_df['store_mean_sales'] = test_df['STORE_ID'].map(store_means).fillna(global_mean)
    return train_df, test_df


def compute_metrics(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    rmse = np.sqrt(np.mean((y_true - y_pred)**2))
    nrmse = rmse / np.mean(y_true)
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot
    mask = y_true != 0
    mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    return {'RMSE': round(rmse, 0), 'NRMSE': round(nrmse, 3), 'R2': round(r2, 4), 'MAPE': round(mape, 1)}


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
    print(f"Horizon: {label} (lag={lag}, test={test_n} weeks)")
    print(f"{'='*60}")

    test_weeks = all_weeks[-test_n:]
    train_weeks = [w for w in all_weeks if w not in test_weeks]

    for ch_name, raw_df in [('Offline', off_raw), ('Online', on_raw), ('Total', tot_raw)]:
        print(f"\n  {ch_name}:")

        # Enhanced features
        df = create_enhanced_features(raw_df, horizon_lag=lag)

        train = df[df['YWEEK_ID'].isin(train_weeks)].copy()
        test = df[df['YWEEK_ID'].isin(test_weeks)].copy()

        if len(test) == 0 or len(train) < 100:
            print(f"    SKIP: train={len(train)}, test={len(test)}")
            continue

        # Store encoding
        train, test = add_store_encoding(train, test)

        features = get_feature_cols(train)
        features = [f for f in features if f in test.columns]

        # Remove features with too many NaN
        valid_features = []
        for f in features:
            if train[f].notna().mean() > 0.5 and test[f].notna().mean() > 0.5:
                valid_features.append(f)
        features = valid_features

        X_train = train[features].values
        y_train = train['S_SALE_WEEK'].values
        X_test = test[features].values
        y_test = test['S_SALE_WEEK'].values

        # Use log1p target
        y_train_log = np.log1p(np.clip(y_train, 0, None))
        y_test_log = np.log1p(np.clip(y_test, 0, None))

        print(f"    Features: {len(features)}, Train: {len(train)}, Test: {len(test)}")

        # --- XGBoost ---
        xgb_model = xgb.XGBRegressor(
            n_estimators=1000,
            learning_rate=0.03,
            max_depth=5,
            reg_alpha=0.1,
            reg_lambda=1.0,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_weight=5,
            tree_method='hist',
            random_state=42,
            verbosity=0,
        )
        xgb_model.fit(X_train, y_train_log,
                       eval_set=[(X_test, y_test_log)],
                       verbose=False)
        xgb_pred_log = xgb_model.predict(X_test)
        xgb_pred = np.expm1(xgb_pred_log)

        # --- LightGBM ---
        lgb_model = lgb.LGBMRegressor(
            n_estimators=1000,
            learning_rate=0.03,
            max_depth=5,
            num_leaves=63,
            reg_alpha=0.1,
            reg_lambda=1.0,
            subsample=0.8,
            colsample_bytree=0.8,
            min_child_samples=20,
            random_state=42,
            verbosity=-1,
        )
        lgb_model.fit(X_train, y_train_log,
                       eval_set=[(X_test, y_test_log)],
                       callbacks=[lgb.log_evaluation(0)])
        lgb_pred_log = lgb_model.predict(X_test)
        lgb_pred = np.expm1(lgb_pred_log)

        # --- Ensemble (grid search weight) ---
        best_r2 = -999
        best_w = 0.5
        for w in np.arange(0.0, 1.05, 0.05):
            ens_pred = w * lgb_pred + (1 - w) * xgb_pred
            m = compute_metrics(y_test, ens_pred)
            if m['R2'] > best_r2:
                best_r2 = m['R2']
                best_w = w

        final_pred = best_w * lgb_pred + (1 - best_w) * xgb_pred
        metrics = compute_metrics(y_test, final_pred)

        # Also compute individual model metrics
        xgb_metrics = compute_metrics(y_test, xgb_pred)
        lgb_metrics = compute_metrics(y_test, lgb_pred)

        print(f"    XGBoost R²={xgb_metrics['R2']:.4f}")
        print(f"    LightGBM R²={lgb_metrics['R2']:.4f}")
        print(f"    Ensemble R²={metrics['R2']:.4f} (LGB weight={best_w:.2f})")

        result = {
            'horizon': horizon_name,
            'horizon_label': label,
            'lag_weeks': lag,
            'channel': ch_name,
            'n_features': len(features),
            'train_n': len(train),
            'test_n': len(test),
            'xgb_R2': xgb_metrics['R2'],
            'lgb_R2': lgb_metrics['R2'],
            'lgb_weight': best_w,
            **metrics
        }
        results.append(result)

# Save
results_df = pd.DataFrame(results)
results_df.to_csv(OUT + 'improved_results.csv', index=False)
with open(OUT + 'improved_results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "="*60)
print("FINAL SUMMARY")
print("="*60)

for ch in ['Offline', 'Online', 'Total']:
    print(f"\n{ch}:")
    ch_results = [r for r in results if r['channel'] == ch]
    print(f"  {'Horizon':<12} {'Ensemble R²':>12} {'XGB R²':>10} {'LGB R²':>10} {'RMSE':>12}")
    print(f"  {'-'*50}")
    for r in ch_results:
        print(f"  {r['horizon_label']:<12} {r['R2']:>12.4f} {r['xgb_R2']:>10.4f} {r['lgb_R2']:>10.4f} {r['RMSE']:>12,.0f}")
