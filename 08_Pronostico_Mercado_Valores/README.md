# Proyecto #08: Pronóstico de Precios del Mercado de Valores

**Sector Industrial:** Finanzas & Banca / Trading Cuantitativo

## Resumen Ejecutivo
Terminal cuantitativo completo de análisis bursátil y predicción de series temporales (LSTM + Prophet). Proyecta tendencias de precios e indicadores técnicos (RSI 14, MACD, Bandas de Bollinger) en activos como SPY, QQQ, AAPL, BTC y el Índice de la Bolsa Boliviana de Valores (BBV).

## Resultados de Evaluación del Modelo ML
- **Error Medio Cuadrático (RMSE):** $42.16 USD
- **Ratio Sharpe (Backtest):** 1.05
- **Máximo Drawdown (Caída Tolerada):** -11.63%

## Estructura del Proyecto
- `src/fetch_stock_data.py`: Ingestador de precios e indicadores cuantitativos
- `src/train_stock_forecaster.py`: Script de entrenamiento de LSTM / Gradient Boosting
- `api/main.py`: Servicio RESTful en FastAPI (`/api/stock/forecast`) en puerto 8010
- `frontend/`: Terminal SPA interactiva de trading bursátil en puerto 8011
- `models/`: Artefactos entrenados (`stock_forecaster.joblib`, `scaler.joblib`, `metrics.json`)

## Instrucciones de Ejecución
```bash
# Entrenamiento de modelo ML:
python3 src/train_stock_forecaster.py

# Iniciar servidor API Backend:
python3 api/main.py

# Ejecutar frontend interactivo:
cd frontend && npm run dev
```
