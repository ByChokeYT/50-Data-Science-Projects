# Proyecto #07: Detección de Fraude en Transacciones Bancarias

**Sector Industrial:** Finanzas & Banca

## Resumen Ejecutivo
Sistema completo de detección de anomalías y ciberseguridad financiera basado en algoritmos Isolation Forest, clasificadores de ensamble XGBoost con muestreo SMOTE, servidor RESTful FastAPI (`/api/fraud/eval`) y un Centro de Monitoreo de Transacciones en tiempo real en React + Vite.

## Resultados de Evaluación del Modelo ML
- **ROC-AUC Score:** 1.0000
- **PR-AUC (Precision-Recall):** 1.0000
- **Tasa de Falsos Positivos (FPR):** 0.00%
- **Rango de Score de Riesgo:** 0.0% (Legítima) a 100.0% (Bloqueo por Fraude)

## Estructura del Proyecto
- `src/generate_transactions.py`: Generador de dataset de transacciones bancarias con anomalías
- `src/train_fraud_detector.py`: Script de entrenamiento de Isolation Forest y XGBoost
- `api/main.py`: Servicio RESTful en FastAPI (`/api/fraud/eval`) en puerto 8008
- `frontend/`: Aplicación SPA interactiva de Centro de Monitoreo Antifraude en puerto 8009
- `models/`: Artefactos entrenados (`fraud_model.joblib`, `isolation_forest.joblib`, `scaler.joblib`, `metrics.json`)

## Instrucciones de Ejecución
```bash
# Entrenamiento de modelo ML:
python3 src/train_fraud_detector.py

# Iniciar servidor API Backend:
python3 api/main.py

# Ejecutar frontend interactivo:
cd frontend && npm run dev
```
