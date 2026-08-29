# Proyecto #06: Modelo de Puntuación Crediticia (Credit Scoring & Scorecard System)

**Sector Industrial:** Finanzas & Banca

## Resumen Ejecutivo
Sistema completo de evaluación de solvencia e Scoring de Préstamos Bancarios basado en transformaciones Weight of Evidence (WoE), regresión logística calibrada a escala FICO (300 a 850 puntos) y un Dashboard Web interactivo de simulación de solicitudes en tiempo real.

## Resultados de Evaluación del Modelo ML
- **ROC-AUC Score:** 0.8243
- **Coeficiente Gini:** 0.6485
- **Estadística KS:** 0.5017
- **Rango de Scorecard Calibrado:** 300 (Riesgo Crítico) a 850 (Solvencia Excelente)

## Estructura del Proyecto
- `src/generate_data.py`: Generador de dataset sintético bancario
- `src/train_scorecard.py`: Script de entrenamiento WoE + Logistic Regression y calibración FICO
- `api/main.py`: Servicio RESTful en FastAPI (`/api/scorecard/predict`)
- `frontend/`: Aplicación SPA interactiva en React + Vite + TailwindCSS
- `models/`: Artefactos entrenados (`scorecard_model.joblib`, `scaler.joblib`, `metrics.json`)

## Instrucciones de Ejecución
```bash
# Entrenamiento de modelo ML:
python3 src/train_scorecard.py

# Iniciar servidor API Backend:
python3 api/main.py

# Ejecutar frontend interactivo:
cd frontend && npm run dev
```
