<div align="center">
  <img src="./assets/tricell_logo.svg" width="130" alt="Tricell Logo" />
  <h1>TRICELL.INC</h1>
  <h3>Proyecto de Ciencia de Datos: Diagnóstico Oncológico</h3>
</div>

Este es el **Proyecto N°1** de la macro-lista de **50 Proyectos de Ciencia de Datos**. En esta entrega, la clásica libreta de análisis de datos evoluciona hacia un caso de uso real que integra **Ciencia de Datos, Machine Learning y Desarrollo Web**. Su propósito fundamental es aplicar modelos de entrenamiento predictivo (Random Forest) sobre características morfológicas celulares para predecir si un tejido presenta probabilidades clínicas de malignidad.

## 🏗️ Arquitectura del Sistema
Este microservicio está dividido en un Backend Médico (IA) y un Frontend de Visualización (Hospital/Laboratorio).

1. **Machine Learning (`prediccion_cancer.py`)**: 
   Entrena un `RandomForestClassifier` de *Scikit-Learn* utilizando un dataset histórico médico. Demuestra un **96.5% de precisión** con la separación 80/20. Finalmente, serializa su estado con `joblib` (`modelo_cancer_rf.pkl`).
   
2. **Backend API (`api.py`)**: 
   Servidor de ingesta de datos hiperrápido construido con **FastAPI**. Realiza la inferencia del modelo en memoria sobre el endpoint local `/predecir`, rellenando dinámicamente las variables estadísticas sobrantes (pivotea las 25 variables no ingresadas contra la media del dataset) para hacer más intuitiva la UI clínica sin sacrificar estabilidad en la IA.

3. **Frontend Visual (`/frontend`)**: 
   Aplicación del lado del cliente, construida de cero con **React 19 (Vite)** y **Tailwind CSS V4**. Replicando la estética profunda o "Dark Mode" de un sistema de diagnóstico privativo y confidencial de uso corporativo, conecta el análisis HTTP en vivo hacia el Backend.

---

## 🚀 Cómo Levantar el Entorno de Prueba

Se necesitan ejecutar dos instancias para simular el servidor en producción. Usa dos consolas diferentes:

### 1. Iniciar el Motor de Inteligencia Artificial (Backend)
Desde tu ruta actual `01_Prediccion_Enfermedades/` con tu ambiente virtual activado:
```bash
# 1. Ejecutar para forjar el modelo ML (solo la primera vez):
python src/train_model.py

# 2. Levantar servidor Web Socket de la IA
uvicorn api.main:app --reload
```
📡 *La API quedará escuchando eternamente en: `http://localhost:8000`*

### 2. Iniciar el Panel Médico (Frontend)
En una nueva terminal, dirígete dentro de la subcarpeta frontend e inicia React:
```bash
cd frontend
npm install  # Opcional si faltan dependencias
npm run dev
```
🖥️ *La interfaz se renderizará instantáneamente en: `http://localhost:5173`*

---

## 🧪 Casos de Estudio a Someter
Puedes validar la IA rellenando la consola de React con estos valores reales de investigación para ver el poder del Random Forest diagnosticando "TUMOR BENIGNO" vs "TUMOR MALIGNO".

| Parámetro (Input) | Caso Sano (No-Maligno) | Caso Nivel 4 (Maligno) |
|:---|:---:|:---:|
| **R-Mean** | `11.5` | `19.8` |
| **T-Mean** | `14.2` | `22.4` |
| **P-Mean** | `74.5` | `132.0` |
| **A-Mean** | `410.0` | `1200.0` |
| **S-Mean** | `0.08` | `0.12` |

> *Anotación técnica: La validación CORS e inyección `@import` de TailwindV4 han sido reforzadas tras una modernización al Stack base para mejorar la latencia del aplicativo web.*

---

<div align="center">
  <p><b>🩺 Proyecto 1 / 50</b> del reto de Ciencia de Datos</p>
  <p>Desarrollado con ❤️ usando React, FastAPI y Scikit-Learn.</p>
</div>
