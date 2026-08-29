from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import sqlite3
import os

app = FastAPI(title="Patient Readmission Risk API")

# Rutas de archivos
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/readmission_model.joblib')
ENCODERS_PATH = os.path.join(os.path.dirname(__file__), '../models/encoders.joblib')
DB_PATH = os.path.join(os.path.dirname(__file__), '../data/hospital.db')

# Cargar modelo y codificadores
try:
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
except Exception as e:
    model = None
    encoders = None
    print(f"Error al cargar el modelo: {e}")

class PatientAdmission(BaseModel):
    age: int
    gender: str
    ethnicity: str
    insurance_type: str
    admission_type: str
    primary_diagnosis: str
    severity_index: int
    num_lab_procedures: int
    num_medications: int

@app.get("/")
def read_root():
    return {"message": "API de Predicción de Riesgo de Reingreso activa"}

@app.post("/predict")
def predict_risk(data: PatientAdmission):
    if model is None:
        raise HTTPException(status_code=500, detail="Modelo no cargado")
    
    # Preprocesar datos de entrada
    input_data = data.dict()
    df = pd.DataFrame([input_data])
    
    try:
        for col, encoder in encoders.items():
            df[col] = encoder.transform(df[col])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Valor categórico inválido: {e}")
    
    # Predicción
    risk_score = model.predict_proba(df)[0][1]
    prediction = int(model.predict(df)[0])
    
    # Simular importancia de características para la explicación
    # En un caso real usaríamos SHAP, aquí lo simulamos para claridad del usuario
    factors = []
    if data.age > 70: factors.append({"factor": "Edad Avanzada", "impact": "Alto"})
    if data.severity_index > 3: factors.append({"factor": "Gravedad del Ingreso", "impact": "Crítico"})
    if data.num_medications > 10: factors.append({"factor": "Polifarmacia (>10 meds)", "impact": "Medio"})
    if data.primary_diagnosis in ['Diabetes', 'Cardiopatía']: factors.append({"factor": "Condición Crónica", "impact": "Medio"})
    
    if not factors:
        factors.append({"factor": "Estabilidad General", "impact": "Positivo"})

    return {
        "risk_score": float(risk_score),
        "will_readmit": bool(prediction),
        "risk_level": "Alto" if risk_score > 0.7 else "Medio" if risk_score > 0.3 else "Bajo",
        "factors": factors,
        "recommendation": "Requiere vigilancia intensiva y plan de alta coordinado." if risk_score > 0.7 else "Seguimiento estándar recomendado."
    }

@app.get("/stats")
def get_stats():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query("SELECT * FROM admissions", conn)
    conn.close()
    
    total_admissions = len(df)
    readmission_rate = df['readmitted_30d'].mean()
    avg_severity = df['severity_index'].mean()
    
    return {
        "total_admissions": total_admissions,
        "readmission_rate": float(readmission_rate),
        "avg_severity": float(avg_severity)
    }
