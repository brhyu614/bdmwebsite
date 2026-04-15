"""
Multi-horizon forecast: 1week, 1month(4w), 3months(13w), 6months(26w) ahead
Uses the same XGBoost setup as RUN_009 but with different train/test splits.
"""

import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')

try:
    import xgboost as xgb
    print("XGBoost loaded OK")
except ImportError:
    print("ERROR: xgboost not installed. Run: pip install xgboost")
    exit(1)

BASE = '/Users/boramlim/Dropbox/Research/WithStudents/Sofia_Boram/Demand_Prediction/New_Data/Data_February/'
OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/grocery/'

# Load data
print("Loading data...")
off_raw = pd.read_csv(BASE + 'weekly_offline_resample_final_v2.csv', low_memory=False)
on_raw  = pd.read_csv(BASE + 'weekly_online_resample_final_v2.csv', low_memory=False)
tot_raw = pd.read_csv(BASE + 'weekly_total_resample_final_v2.csv', low_memory=False)
print(f"  Offline: {off_raw.shape}, Online: {on_raw.shape}, Total: {tot_raw.shape}")

EXCLUDE_IDS = ['Unnamed: 0', 'X', 'STORE_ID', 'YWEEK_ID', 'channel_d', 'S_SALE_WEEK',
               'week_count', 'first_day_week', 'MONTH_ID', 'GSstore_Latitude',
               'GSstore_longitude', 'Latitude', 'Longitude', 'unique_SM_ITEM_SEQ']

def create_features(df, lag_weeks=1):
    """Create lagged features with configurable lag."""
    df = df.copy().sort_values(['STORE_ID', 'YWEEK_ID'])
    if 'unique_SM_ITEM_SEQ' in df.columns:
        df = df.drop(columns=['unique_SM_ITEM_SEQ'])
    df['lagged_sales'] = df.groupby('STORE_ID')['S_SALE_WEEK'].shift(lag_weeks)
    covariate_cols = [c for c in df.columns if c not in EXCLUDE_IDS + ['S_SALE_WEEK', 'lagged_sales']
                      and df[c].dtype in ['float64', 'int64', 'float32', 'int32']]
    for col in covariate_cols:
        df[f'lag1_{col}'] = df.groupby('STORE_ID')[col].shift(lag_weeks)
    df = df.dropna(subset=['lagged_sales'])
    return df

def compute_metrics(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    rmse = np.sqrt(np.mean((y_true - y_pred)**2))
    nrmse = rmse / np.mean(y_true)
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot
    mask = y_true != 0
    mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    return {'RMSE': round(rmse, 0), 'NRMSE': round(nrmse, 3), 'R2': round(r2, 3), 'MAPE': round(mape, 1)}

# Channel-specific hyperparameters
CHANNEL_HP = {
    'Offline': {'learning_rate': 0.05, 'max_depth': 3, 'reg_alpha': 1.0, 'reg_lambda': 10.0},
    'Online':  {'learning_rate': 0.01, 'max_depth': 3, 'reg_alpha': 0.1, 'reg_lambda': 5.0},
    'Total':   {'learning_rate': 0.05, 'max_depth': 3, 'reg_alpha': 0.1, 'reg_lambda': 1.0},
}

# Week range in data: 201337 to 201436 (52 weeks)
# We'll use different horizons for the test set
# Horizon: how many weeks ahead we predict
HORIZONS = {
    '1week':   {'lag': 1,  'test_weeks': 14, 'label': '1주 후'},
    '1month':  {'lag': 4,  'test_weeks': 13, 'label': '1개월 후'},
    '3months': {'lag': 13, 'test_weeks': 13, 'label': '3개월 후'},
    '6months': {'lag': 26, 'test_weeks': 13, 'label': '6개월 후'},
}

# Get all unique weeks sorted
all_weeks = sorted(off_raw['YWEEK_ID'].unique())
print(f"Total weeks: {len(all_weeks)}, range: {all_weeks[0]} - {all_weeks[-1]}")

# Feature sets (using the CustPurchase model which showed the best performance)
def get_cust_purchase_features():
    return ['lagged_sales',
            'lag1_UN_BASKET', 'lag1_unique_customers', 'lag1_total_items_sold',
            'lag1_avg_basket_size', 'lag1_male_ratio', 'lag1_avg_marriage',
            'lag1_avg_age', 'lag1_max_age', 'lag1_min_age',
            'lag1_unique_H_PRDSUC_S_ID', 'lag1_unique_H_PRDDPT_M_ID',
            'lag1_unique_H_PRDDIV_L_ID',
            'lag1_avg_entropy_class', 'lag1_avg_entropy_subclass',
            'lag1_avg_hhi_class', 'lag1_avg_hhi_subclass',
            'lag1_avg_private_label_share', 'lag1_total_private_label_share']

results = []

for horizon_name, horizon_cfg in HORIZONS.items():
    lag = horizon_cfg['lag']
    test_n = horizon_cfg['test_weeks']
    label = horizon_cfg['label']

    print(f"\n{'='*60}")
    print(f"Horizon: {label} (lag={lag} weeks, test={test_n} weeks)")
    print(f"{'='*60}")

    # Split: last test_n weeks as test, rest as train
    test_weeks = all_weeks[-test_n:]
    train_weeks = [w for w in all_weeks if w not in test_weeks]

    # Need enough weeks before test for lagging
    # The lag means we use data from `lag` weeks ago to predict current

    for ch_name, raw_df in [('Offline', off_raw), ('Online', on_raw), ('Total', tot_raw)]:
        print(f"\n  Channel: {ch_name}")

        # Create features with the given lag
        df = create_features(raw_df, lag_weeks=lag)

        train = df[df['YWEEK_ID'].isin(train_weeks)].copy()
        test = df[df['YWEEK_ID'].isin(test_weeks)].copy()

        if len(test) == 0 or len(train) == 0:
            print(f"    SKIP: train={len(train)}, test={len(test)}")
            continue

        features = get_cust_purchase_features()
        # Only use features that exist in the dataframe
        features = [f for f in features if f in df.columns]

        X_train = train[features].values
        y_train = train['S_SALE_WEEK'].values
        X_test = test[features].values
        y_test = test['S_SALE_WEEK'].values

        hp = CHANNEL_HP[ch_name]
        model = xgb.XGBRegressor(
            n_estimators=500,
            learning_rate=hp['learning_rate'],
            max_depth=hp['max_depth'],
            reg_alpha=hp['reg_alpha'],
            reg_lambda=hp['reg_lambda'],
            tree_method='hist',
            random_state=42,
            verbosity=0,
        )

        # Fit with early stopping
        model.fit(
            X_train, y_train,
            eval_set=[(X_test, y_test)],
            verbose=False,
        )

        y_pred = model.predict(X_test)
        metrics = compute_metrics(y_test, y_pred)

        result = {
            'horizon': horizon_name,
            'horizon_label': label,
            'lag_weeks': lag,
            'channel': ch_name,
            'train_n': len(train),
            'test_n': len(test),
            'train_weeks': len(train_weeks),
            'test_weeks': test_n,
            **metrics
        }
        results.append(result)

        print(f"    Train: {len(train)} rows, Test: {len(test)} rows")
        print(f"    R²={metrics['R2']:.3f}, RMSE={metrics['RMSE']:,.0f}, MAPE={metrics['MAPE']:.1f}%")

# Save results
results_df = pd.DataFrame(results)
results_df.to_csv(OUT + 'multi_horizon_results.csv', index=False)

with open(OUT + 'multi_horizon_results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n" + "="*60)
print("SUMMARY TABLE")
print("="*60)

# Pretty print pivot
for ch in ['Offline', 'Online', 'Total']:
    print(f"\n{ch}:")
    ch_results = [r for r in results if r['channel'] == ch]
    print(f"  {'Horizon':<12} {'R²':>8} {'RMSE':>12} {'MAPE':>8}")
    print(f"  {'-'*42}")
    for r in ch_results:
        print(f"  {r['horizon_label']:<12} {r['R2']:>8.3f} {r['RMSE']:>12,.0f} {r['MAPE']:>7.1f}%")

print(f"\nResults saved to {OUT}multi_horizon_results.json")
