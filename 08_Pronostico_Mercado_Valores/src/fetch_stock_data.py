#!/usr/bin/env python3
"""
Generador e Ingestador de Series Temporales de Precios Bursátiles e Indicadores Cuantitativos.
Genera precios OHLCV e indicadores técnicos (RSI, MACD, Bandas de Bollinger, SMA-20, EMA-50).
"""

import os
import numpy as np
import pandas as pd

def generate_stock_series(symbol="SPY", days=500, random_seed=42):
    np.random.seed(random_seed)

    dates = pd.date_range(end=pd.Timestamp.today(), periods=days, freq="D")
    
    # Precios de inicio según activo
    base_prices = {"SPY": 450.0, "QQQ": 380.0, "AAPL": 175.0, "BTC": 42000.0, "BBV_INDEX": 100.0}
    start_price = base_prices.get(symbol, 200.0)

    # Movimiento Browniano Geométrico (GBM) con drift positivo y volatilidad
    dt = 1.0 / 252.0
    mu = 0.12  # Retorno esperado 12% anual
    sigma = 0.22 if symbol != "BTC" else 0.55 # Volatilidad

    returns = np.random.normal(loc=(mu - 0.5 * sigma**2) * dt, scale=sigma * np.sqrt(dt), size=days)
    price_paths = start_price * np.exp(np.cumsum(returns))

    # Construcción de velas OHLCV
    high = price_paths * (1 + np.abs(np.random.normal(0, 0.008, days)))
    low = price_paths * (1 - np.abs(np.random.normal(0, 0.008, days)))
    open_p = price_paths * (1 + np.random.normal(0, 0.004, days))
    close_p = price_paths
    volume = np.random.randint(1000000, 10000000, size=days)

    df = pd.DataFrame({
        "date": dates,
        "symbol": symbol,
        "open": np.round(open_p, 2),
        "high": np.round(high, 2),
        "low": np.round(low, 2),
        "close": np.round(close_p, 2),
        "volume": volume
    })

    # Indicadores Técnicos
    # 1. Simple Moving Average (SMA-20)
    df["sma_20"] = df["close"].rolling(window=20).mean().bfill()
    # 2. Exponential Moving Average (EMA-50)
    df["ema_50"] = df["close"].ewm(span=50, adjust=False).mean()

    # 3. Relative Strength Index (RSI 14)
    delta = df["close"].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / (loss + 1e-7)
    df["rsi_14"] = np.round(100 - (100 / (1 + rs)), 2).fillna(50.0)

    # 4. Bollinger Bands (20, 2)
    std_20 = df["close"].rolling(window=20).std().bfill()
    df["bollinger_upper"] = np.round(df["sma_20"] + (std_20 * 2), 2)
    df["bollinger_lower"] = np.round(df["sma_20"] - (std_20 * 2), 2)

    # 5. MACD (12, 26, 9)
    ema_12 = df["close"].ewm(span=12, adjust=False).mean()
    ema_26 = df["close"].ewm(span=26, adjust=False).mean()
    df["macd"] = np.round(ema_12 - ema_26, 2)
    df["macd_signal"] = np.round(df["macd"].ewm(span=9, adjust=False).mean(), 2)

    return df

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)

    output_csv = os.path.join(data_dir, "stock_historical_dataset.csv")
    df_all = pd.concat([generate_stock_series(sym, seed=i) for i, sym in enumerate(["SPY", "QQQ", "AAPL", "BTC", "BBV_INDEX"])])
    df_all.to_csv(output_csv, index=False)

    print(f"Dataset histórico bursátil e indicadores técnicos generados ({len(df_all)} registros) en: {output_csv}")
