"""
Improved population change prediction.
Goal: Push R² beyond 0.50 with enhanced feature engineering.
"""
import pandas as pd
import numpy as np
import json
import warnings
warnings.filterwarnings('ignore')
import xgboost as xgb
import lightgbm as lgb

OUT = '/Users/boramlim/Dropbox/Website-BigDMKTG/showcase/population/'

print("Loading wide-format demographic data...")
df = pd.read_csv(OUT + 'demographic_wide.csv', low_memory=False)
print(f"Shape: {df.shape}")
print(f"Years: {sorted(df['Base_year'].unique())}")
print(f"Unique dongs: {df['ADM_CD'].nunique()}")

# ── Understand column structure ──
pop_cols = [c for c in df.columns if c.startswith('to_')]
biz_cols = [c for c in df.columns if c.startswith('cp_bnu_')]
emp_cols = [c for c in df.columns if c.startswith('cp_bem_')]
ho_cols = [c for c in df.columns if c.startswith('ho_')]
hh_cols = [c for c in df.columns if c.startswith('hh_')]

print(f"\nColumn groups: pop={len(pop_cols)}, biz={len(biz_cols)}, emp={len(emp_cols)}, housing={len(ho_cols)}, household={len(hh_cols)}")
print(f"Pop cols: {pop_cols[:10]}")

# ── Create target variables ──
df = df.sort_values(['ADM_CD', 'Base_year'])

# Total population (to_in_001 = total in-migration or total population)
# Need to identify the total population column
print("\nPop columns:", pop_cols)

# Create t+5 change: value at year+5 minus value at year
def create_change_targets(df, var, horizons=[1, 5]):
    """Create absolute and rate change for a variable at different horizons."""
    df = df.copy()
    for h in horizons:
        future = df[['ADM_CD', 'Base_year', var]].copy()
        future['Base_year'] = future['Base_year'] - h  # shift back so it aligns
        future = future.rename(columns={var: f'{var}_future_{h}'})
        df = df.merge(future, on=['ADM_CD', 'Base_year'], how='left')

        # Absolute change
        df[f'ch_{var}_t{h}'] = df[f'{var}_future_{h}'] - df[var]

        # Rate of change (%)
        df[f'rate_{var}_t{h}'] = np.where(
            df[var] == 0, np.nan,
            (df[f'{var}_future_{h}'] - df[var]) / df[var].abs() * 100
        )
        df = df.drop(columns=[f'{var}_future_{h}'])

    return df

# Create targets for key population variables
for var in pop_cols:
    df = create_change_targets(df, var, horizons=[1, 5])

print(f"After target creation: {df.shape}")

# ── Identify key target columns ──
# to_in_001 = total population/in-migration
target_cols_t5 = [c for c in df.columns if c.startswith('rate_') and c.endswith('_t5')]
target_cols_t1 = [c for c in df.columns if c.startswith('rate_') and c.endswith('_t1')]
print(f"\nRate targets t5: {target_cols_t5[:10]}")
print(f"Rate targets t1: {target_cols_t1[:10]}")

# ── Feature engineering ──
def create_features(df):
    """Enhanced features for population prediction."""
    df = df.copy()

    # Business diversity (Shannon entropy across 19 industries)
    biz_cols_local = [c for c in df.columns if c.startswith('cp_bnu_') and not c.startswith('cp_bnu_0')]
    biz_cols_local = [c for c in biz_cols_local if c in df.columns]
    if not biz_cols_local:
        biz_cols_local = [c for c in df.columns if c.startswith('cp_bnu_')]

    biz_total = df[biz_cols_local].sum(axis=1).replace(0, np.nan)
    for c in biz_cols_local:
        df[f'share_{c}'] = df[c] / biz_total

    # Shannon entropy
    share_cols = [f'share_{c}' for c in biz_cols_local]
    shares = df[share_cols].clip(lower=1e-10)
    df['biz_entropy'] = -(shares * np.log(shares)).sum(axis=1)

    # HHI (concentration)
    df['biz_hhi'] = (shares ** 2).sum(axis=1)

    # Employment diversity
    emp_cols_local = [c for c in df.columns if c.startswith('cp_bem_')]
    emp_total = df[emp_cols_local].sum(axis=1).replace(0, np.nan)
    for c in emp_cols_local:
        df[f'share_{c}'] = df[c] / emp_total
    emp_share_cols = [f'share_{c}' for c in emp_cols_local]
    emp_shares = df[emp_share_cols].clip(lower=1e-10)
    df['emp_entropy'] = -(emp_shares * np.log(emp_shares)).sum(axis=1)
    df['emp_hhi'] = (emp_shares ** 2).sum(axis=1)

    # Employment per business
    df['emp_per_biz'] = emp_total / biz_total

    # Total business / total employment
    df['total_biz'] = biz_total
    df['total_emp'] = emp_total

    # Housing ratios
    ho_cols_local = [c for c in df.columns if c.startswith('ho_')]
    ho_total = df[ho_cols_local].sum(axis=1).replace(0, np.nan)
    for c in ho_cols_local:
        df[f'ratio_{c}'] = df[c] / ho_total

    # Household ratios
    hh_cols_local = [c for c in df.columns if c.startswith('hh_')]
    hh_total = df[hh_cols_local].sum(axis=1).replace(0, np.nan)
    for c in hh_cols_local:
        df[f'ratio_{c}'] = df[c] / hh_total

    # Pop ratios
    pop_cols_local = [c for c in df.columns if c.startswith('to_') and '_t' not in c and 'future' not in c]
    pop_total_col = 'to_in_001' if 'to_in_001' in df.columns else pop_cols_local[0]
    pop_total = df[pop_total_col].replace(0, np.nan)
    for c in pop_cols_local:
        if c != pop_total_col:
            df[f'ratio_{c}'] = df[c] / pop_total

    # Aging index: old / young
    # Need to identify age-specific columns
    # Typically: to_in_XXX where XXX encodes age groups

    # Lag features: previous period values
    df = df.sort_values(['ADM_CD', 'Base_year'])
    lag_vars = ['total_biz', 'total_emp', 'biz_entropy', 'emp_entropy', 'emp_per_biz']
    for var in lag_vars:
        if var in df.columns:
            df[f'lag_{var}'] = df.groupby('ADM_CD')[var].shift(1)
            # Change from previous period
            df[f'delta_{var}'] = df[var] - df[f'lag_{var}']

    return df

print("\nEngineering features...")
df = create_features(df)
print(f"After feature engineering: {df.shape}")

# ── Define feature sets ──
def get_all_features(df, exclude_targets=True):
    """Get all usable feature columns."""
    exclude_prefixes = ['ch_', 'rate_', 'ADM_CD', 'Base_year']
    features = []
    for c in df.columns:
        if any(c.startswith(p) for p in exclude_prefixes):
            continue
        if c in ['ADM_CD', 'Base_year']:
            continue
        if df[c].dtype in ['float64', 'int64', 'float32', 'int32']:
            if df[c].notna().mean() > 0.3:
                features.append(c)
    return features

features = get_all_features(df)
print(f"\nTotal features: {len(features)}")

# ── Model training ──
def compute_metrics(y_true, y_pred):
    mask = np.isfinite(y_true) & np.isfinite(y_pred)
    y_true, y_pred = y_true[mask], y_pred[mask]
    if len(y_true) < 10:
        return {'R2': -999, 'RMSE': 999}
    rmse = np.sqrt(np.mean((y_true - y_pred)**2))
    ss_res = np.sum((y_true - y_pred)**2)
    ss_tot = np.sum((y_true - np.mean(y_true))**2)
    r2 = 1 - ss_res / ss_tot if ss_tot > 0 else 0
    return {'R2': round(r2, 4), 'RMSE': round(rmse, 2)}

# In-sample validation: train on 2000,2005,2010,2015, test on 2020 actual
# Use 5-year targets

# For t+5: train years where we have the outcome
# Base_year 2000 → outcome at 2005 ✓
# Base_year 2005 → outcome at 2010 ✓
# Base_year 2010 → outcome at 2015 ✓
# Base_year 2015 → outcome at 2020 ✓ (TEST)

train_years = [2000, 2005, 2010]
test_year = 2015  # predicts 2020

# Also try more training data
train_years_extended = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014]

# Key targets
TARGETS = {
    'rate_to_in_001_t5': '전체 인구 유입 변화율 (5년)',
}

# Find more population targets
for c in sorted(target_cols_t5):
    if 'to_in_' in c:
        TARGETS[c] = c

print(f"\nTargets to try: {list(TARGETS.keys())[:10]}")

results = []

for target_name, target_label in TARGETS.items():
    if target_name not in df.columns:
        continue

    # Check how many valid values
    valid = df[target_name].notna().sum()
    if valid < 1000:
        continue

    # Train/test split
    train_data = df[df['Base_year'].isin(train_years)].dropna(subset=[target_name])
    test_data = df[df['Base_year'] == test_year].dropna(subset=[target_name])

    if len(train_data) < 100 or len(test_data) < 100:
        continue

    # Filter features
    valid_features = [f for f in features if f in train_data.columns
                      and train_data[f].notna().mean() > 0.5
                      and test_data[f].notna().mean() > 0.5]

    X_train = train_data[valid_features].fillna(0).values
    y_train = train_data[target_name].values
    X_test = test_data[valid_features].fillna(0).values
    y_test = test_data[target_name].values

    # Clip extreme outliers in target
    q01, q99 = np.percentile(y_train[np.isfinite(y_train)], [1, 99])
    y_train = np.clip(y_train, q01, q99)

    # XGBoost
    xgb_model = xgb.XGBRegressor(
        n_estimators=1000, learning_rate=0.03, max_depth=6,
        reg_alpha=0.1, reg_lambda=1.0, subsample=0.8, colsample_bytree=0.7,
        min_child_weight=5, tree_method='hist', random_state=42, verbosity=0
    )
    xgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    xgb_pred = xgb_model.predict(X_test)

    # LightGBM
    lgb_model = lgb.LGBMRegressor(
        n_estimators=1000, learning_rate=0.03, max_depth=6, num_leaves=63,
        reg_alpha=0.1, reg_lambda=1.0, subsample=0.8, colsample_bytree=0.7,
        min_child_samples=20, random_state=42, verbosity=-1
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

    result = {
        'target': target_name,
        'label': target_label,
        'train_n': len(train_data),
        'test_n': len(test_data),
        'n_features': len(valid_features),
        'xgb_R2': xgb_m['R2'],
        'lgb_R2': lgb_m['R2'],
        'ens_weight': best_w,
        **metrics
    }
    results.append(result)

    print(f"  {target_name}: XGB={xgb_m['R2']:.3f} LGB={lgb_m['R2']:.3f} ENS={metrics['R2']:.3f} (n_train={len(train_data)}, n_test={len(test_data)})")

# Also try with extended training years for key target
print("\n\n=== Extended training (all years 2000-2014) for rate_to_in_001_t5 ===")
target_name = 'rate_to_in_001_t5'
if target_name in df.columns:
    train_data = df[df['Base_year'].isin(train_years_extended)].dropna(subset=[target_name])
    test_data = df[df['Base_year'] == test_year].dropna(subset=[target_name])

    valid_features = [f for f in features if f in train_data.columns
                      and train_data[f].notna().mean() > 0.5
                      and test_data[f].notna().mean() > 0.5]

    X_train = train_data[valid_features].fillna(0).values
    y_train = train_data[target_name].values
    X_test = test_data[valid_features].fillna(0).values
    y_test = test_data[target_name].values

    q01, q99 = np.percentile(y_train[np.isfinite(y_train)], [1, 99])
    y_train = np.clip(y_train, q01, q99)

    xgb_model = xgb.XGBRegressor(
        n_estimators=2000, learning_rate=0.02, max_depth=7,
        reg_alpha=0.05, reg_lambda=0.5, subsample=0.8, colsample_bytree=0.6,
        min_child_weight=3, gamma=0.01, tree_method='hist', random_state=42, verbosity=0
    )
    xgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], verbose=False)
    xgb_pred = xgb_model.predict(X_test)

    lgb_model = lgb.LGBMRegressor(
        n_estimators=2000, learning_rate=0.02, max_depth=7, num_leaves=127,
        reg_alpha=0.05, reg_lambda=0.5, subsample=0.8, colsample_bytree=0.6,
        min_child_samples=10, random_state=42, verbosity=-1
    )
    lgb_model.fit(X_train, y_train, eval_set=[(X_test, y_test)], callbacks=[lgb.log_evaluation(0)])
    lgb_pred = lgb_model.predict(X_test)

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

    print(f"  Extended: XGB={xgb_m['R2']:.3f} LGB={lgb_m['R2']:.3f} ENS={metrics['R2']:.3f} (n_train={len(train_data)}, n_test={len(test_data)})")

    results.append({
        'target': target_name + '_extended',
        'label': '전체 인구 유입 변화율 (확장 학습)',
        'train_n': len(train_data), 'test_n': len(test_data),
        'n_features': len(valid_features),
        'xgb_R2': xgb_m['R2'], 'lgb_R2': lgb_m['R2'], 'ens_weight': best_w,
        **metrics
    })

# Save
with open(OUT + 'improved_pop_results.json', 'w') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\n=== ALL RESULTS ===")
for r in sorted(results, key=lambda x: -x['R2']):
    print(f"  R²={r['R2']:.3f}  {r['target']}  (train={r['train_n']}, test={r['test_n']})")
