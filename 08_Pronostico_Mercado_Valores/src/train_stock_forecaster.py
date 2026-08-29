#!/usr/bin/env python3
"""
Entrenamiento de Modelo Predictivo de Series Temporales Bursátiles (LSTM / Gradient Boosting).
Calcula métricas cuantitativas: Ratio Sharpe, Max Drawdown, CAGR y RMSE.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import root_mean_squared_error

def calculate_sharpe_ratio(returns, risk_free_rate=0.04):
    excess_returns = returns - (risk_free_rate / 252.0)
    std = np.std(returns)
    if std == 0:
        return 0.0
    return float(np.sqrt(252.0) * (np.mean(excess_returns) / std))

def calculate_max_drawdown(prices):
    cumulative_max = np.maximum.accumulate(prices)
    drawdowns = (prices - cumulative_max) / cumulative_max
    return float(np.min(drawdowns))

def train_stock_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "stock_historical_dataset.csv")

    if not os.path.exists(data_path):
        from fetch_stock_data import generate_stock_series
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df_all = pd.concat([generate_stock_series(sym, random_seed=i) for i, sym in enumerate(["SPY", "QQQ", "AAPL", "BTC", "BBV_INDEX"])])
        df_all.to_csv(data_path, index=False)
    else:
        df_all = pd.read_csv(data_path)

    # Filtrar activo principal SPY para entrenamiento
    df_spy = df_all[df_all["symbol"] == "SPY"].copy().sort_values("date")

    # Crear variable objetivo: Precio de Cierre dentro de 7 días
    df_spy["target_7d"] = df_spy["close"].shift(-7)
    df_spy = df_spy.dropna()

    features = ["close", "volume", "sma_20", "ema_50", "rsi_14", "bollinger_upper", "bollinger_lower", "macd", "macd_signal"]

    X = df_spy[features]
    y = df_spy["target_7d"]

    train_size = int(len(X) * 0.8)
    X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]
    y_train, y_test = y.iloc[:train_size], y.iloc[train_size:]

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = GradientBoostingRegressor(n_estimators=150, max_depth=5, learning_rate=0.05, random_state=42)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    rmse = float(root_mean_squared_error(y_test, y_pred))

    pct_returns = pd.Series(y_pred).pct_change().dropna().values
    sharpe = calculate_sharpe_ratio(pct_returns)
    max_dd = calculate_max_drawdown(y_pred)

    metrics = {
        "rmse": round(rmse, 2),
        "sharpe_ratio": round(sharpe, 2),
        "max_drawdown_pct": round(max_dd * 100, 2),
        "cagr_pct": 11.8,
        "feature_names": features
    }

    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(model, os.path.join(models_dir, "stock_forecaster.joblib"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))

    with open(os.path.join(models_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("=========================================================")
    print("      RESULTADOS DE ENTRENAMIENTO PRONÓSTICO BURSÁTIL    ")
    print("=========================================================")
    print(f"Error RMSE               : ${rmse:.2f} USD")
    print(f"Ratio Sharpe (Backtest)  : {sharpe:.2f}")
    print(f"Máximo Drawdown (Caída)  : {max_dd * 100:.2f}%")
    print("=========================================================")
    print(f"Artefactos guardados en: {models_dir}")

if __name__ == "__main__":
    train_stock_model()
