#!/usr/bin/env python3
"""
Servidor RESTful FastAPI para Evaluación de Fraude Financiero en Tiempo Real.
"""

import os
import json
import joblib
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "fraud_model.joblib")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "models", "metrics.json")

model = None
scaler = None
metrics_data = {}

def load_artifacts():
    global model, scaler, metrics_data
    if not os.path.exists(MODEL_PATH) or not os.path.exists(SCALER_PATH):
        import sys
        sys.path.append(os.path.join(BASE_DIR, "src"))
        from train_fraud_detector import train_fraud_model
        train_fraud_model()

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH, "r", encoding="utf-8") as f:
            metrics_data = json.load(f)

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_artifacts()
    yield

app = FastAPI(
    title="API de Detección de Fraude Bancario & Ciberseguridad",
    description="Servicio de evaluación de riesgo de transacciones anómalas en tiempo real",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TransactionPayload(BaseModel):
    amount_usd: float = Field(..., json_schema_extra={"example": 450.0}, description="Monto de la transacción")
    distance_from_home_km: float = Field(..., json_schema_extra={"example": 120.5}, description="Distancia desde ubicación habitual (km)")
    transaction_hour: int = Field(..., json_schema_extra={"example": 3}, description="Hora de la transacción (0-23)")
    is_new_device: int = Field(0, json_schema_extra={"example": 1}, description="¿Es dispositivo nuevo? (0=No, 1=Sí)")
    velocity_txn_per_min: int = Field(1, json_schema_extra={"example": 4}, description="Frecuencia de compra (transacciones/minuto)")
    failed_pin_attempts: int = Field(0, json_schema_extra={"example": 2}, description="Intentos de PIN/CVV fallidos")
    is_foreign_country: int = Field(0, json_schema_extra={"example": 1}, description="¿País extranjero? (0=No, 1=Sí)")

@app.get("/")
def root():
    return {"message": "API de Detección de Fraude Financiero Lista", "status": "active"}

@app.get("/api/fraud/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=500, detail="Métricas no disponibles")
    return metrics_data

@app.post("/api/fraud/eval")
def evaluate_transaction(tx: TransactionPayload):
    if model is None or scaler is None:
        load_artifacts()

    input_array = np.array([[
        tx.amount_usd,
        tx.distance_from_home_km,
        tx.transaction_hour,
        tx.is_new_device,
        tx.velocity_txn_per_min,
        tx.failed_pin_attempts,
        tx.is_foreign_country
    ]])

    input_scaled = scaler.transform(input_array)
    prob_fraud = float(model.predict_proba(input_scaled)[0, 1])
    risk_score = round(prob_fraud * 100, 2)

    risk_factors = []
    if tx.amount_usd > 1000:
        risk_factors.append("Monto inusualmente elevado")
    if tx.distance_from_home_km > 100:
        risk_factors.append("Ubicación geográfica atípica (>100 km)")
    if tx.transaction_hour in [0, 1, 2, 3, 4, 5]:
        risk_factors.append("Horario nocturno de alto riesgo (00:00 - 05:00)")
    if tx.is_new_device == 1:
        risk_factors.append("Dispositivo móvil/web no reconocido")
    if tx.velocity_txn_per_min >= 3:
        risk_factors.append("Alta frecuencia de compras por minuto (Velocidad inusual)")
    if tx.failed_pin_attempts >= 2:
        risk_factors.append("Múltiples intentos fallidos de PIN / CVV")
    if tx.is_foreign_country == 1:
        risk_factors.append("Transacción procesada en el extranjero")

    if risk_score >= 70.0:
        threat_level = "TRANSACCIÓN BLOQUEADA Y ALERTA EMITIDA"
        asfi_status = "Bloqueo Preventivo Automático"
        action_color = "rose"
    elif risk_score >= 35.0:
        threat_level = "REQUIERE AUTENTICACIÓN 2FA / OTP"
        asfi_status = "Verificación Secundaria Requerida"
        action_color = "amber"
    else:
        threat_level = "TRANSACCIÓN LEGÍTIMA APROBADA"
        asfi_status = "Conforme"
        action_color = "emerald"

    return {
        "risk_score_pct": risk_score,
        "probability_of_fraud": round(prob_fraud, 4),
        "threat_level": threat_level,
        "asfi_status": asfi_status,
        "action_color": action_color,
        "risk_factors": risk_factors if risk_factors else ["Ninguna anomalía detectada"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8008, reload=True)
