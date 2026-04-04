from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from sklearn.datasets import load_breast_cancer

app = FastAPI(title="OncoPredict API")

# Permitimos que la web (React) desde cualquier puerto consuma esta API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'modelo_cancer_rf.pkl')

# Cargar el cerebro de IA y las medias estadísticas
try:
    modelo = joblib.load(MODEL_PATH)
    datos_completos = load_breast_cancer()
    medias = datos_completos.data.mean(axis=0)
    print("✅ Modo Servidor: Cerebro IA Inteligente Conectado.")
except Exception as e:
    print("⚠️ Error cargando IA. Ejecuta prediccion_cancer.py primero. Error:", e)
    modelo = None

# Definimos exactamente qué valores nos enviará el Doctor desde la Web
class PacienteInput(BaseModel):
    radius_mean: float
    texture_mean: float
    perimeter_mean: float
    area_mean: float
    smoothness_mean: float

@app.post("/predecir")
def analizar_tumor(datos: PacienteInput):
    if modelo is None:
        return {"error": "Servidor sin cerebro. Entrenamiento no encontrado."}
    
    # Creamos un paciente 'promedio' de 30 variables para satisfacer el modelo
    paciente_vector = medias.copy()
    
    # Sobrescribimos el vector con los 5 valores vitales ingresados por el humano
    paciente_vector[0] = datos.radius_mean
    paciente_vector[1] = datos.texture_mean
    paciente_vector[2] = datos.perimeter_mean
    paciente_vector[3] = datos.area_mean
    paciente_vector[4] = datos.smoothness_mean
    
    # Predict requiere matriz 2D
    matriz_entrada = paciente_vector.reshape(1, -1)
    
    prediccion = modelo.predict(matriz_entrada)[0]
    probabilidades = modelo.predict_proba(matriz_entrada)[0]
    
    # 0 = Maligno (Cancer), 1 = Benigno (Seguro)
    es_benigno = bool(prediccion == 1)
    resultado_texto = "Benigno" if es_benigno else "Maligno"
    nivel_confianza = float(probabilidades[1] if es_benigno else probabilidades[0])
    
    return {
        "diagnosis": resultado_texto,
        "confidence": round(nivel_confianza * 100, 2),
        "status": "safe" if es_benigno else "danger"
    }

@app.get("/")
def health_check():
    return {"status": "OncoPredict Web Core funcionando a tope."}
