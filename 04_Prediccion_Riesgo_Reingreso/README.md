# 🏥 Predicción de Riesgo de Reingreso de Pacientes

Este proyecto forma parte de la serie **50 Proyectos de Ciencia de Datos**. Utiliza un modelo de Machine Learning avanzado (XGBoost) para predecir la probabilidad de que un paciente sea reingresado en un hospital en un plazo de 30 días basándose en su historial médico y datos de la admisión actual.

## 🚀 Características

- **Generación de Datos Sintéticos**: Motor de datos que simula pacientes y admisiones realistas.
- **Base de Datos SQL**: Integración con SQLite para el manejo estructurado de la información.
- **Pipeline de ML**: Procesamiento de datos y entrenamiento de un modelo XGBoost con alta precisión.
- **API REST**: Backend desarrollado con FastAPI para servir predicciones en tiempo real.
- **Dashboard Premium**: Interfaz moderna y dinámica construida con React, Vite y Recharts.

## 🛠️ Tecnologías

- **Lenguaje**: Python 3.8+
- **Data Science**: `pandas`, `numpy`, `scikit-learn`, `xgboost`
- **Backend**: `FastAPI`, `uvicorn`
- **Frontend**: `React`, `Vite`, `Lucide React`, `Recharts`
- **Base de Datos**: `SQLite3`

## 📦 Instalación

1. **Backend**:
   ```bash
   pip install -r requirements.txt
   python src/generate_data.py
   python src/train.py
   python -m uvicorn api.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📊 Resultados del Modelo

- **Precisión (Accuracy)**: ~92%
- **ROC-AUC**: ~0.98
- **F1-Score**: ~0.90 (Clase Reingreso)

---
Desarrollado como parte del portafolio de Ciencia de Datos.
