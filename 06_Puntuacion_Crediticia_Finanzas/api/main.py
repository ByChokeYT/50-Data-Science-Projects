#!/usr/bin/env python3
"""
Servidor RESTful FastAPI para Evaluación Crediticia y Puntuación de Clientes.
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
MODEL_PATH = os.path.join(BASE_DIR, "models", "scorecard_model.joblib")
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
        from train_scorecard import train_scorecard_model
        train_scorecard_model()

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
    title="API de Puntuación Crediticia & Evaluador de Riesgo",
    description="Servicio de evaluación de solvencia e Scoring de Préstamos Bancarios",
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

class CreditApplication(BaseModel):
    annual_income: float = Field(..., json_schema_extra={"example": 65000.0}, description="Ingreso anual en USD")
    loan_amount: float = Field(..., json_schema_extra={"example": 15000.0}, description="Monto solicitado de préstamo")
    loan_term_months: int = Field(36, json_schema_extra={"example": 36}, description="Plazo del préstamo en meses")
    dti_ratio: float = Field(..., json_schema_extra={"example": 25.5}, description="Ratio Deuda-Ingreso (%)")
    employment_years: float = Field(..., json_schema_extra={"example": 5.5}, description="Años de antigüedad laboral")
    past_defaults_count: int = Field(0, json_schema_extra={"example": 0}, description="Número de impagos previos")
    credit_lines_count: int = Field(4, json_schema_extra={"example": 4}, description="Número de líneas crediticias activas")
    repayment_history_score: float = Field(80.0, json_schema_extra={"example": 85.0}, description="Puntuación de historial de pagos (0 a 100)")

@app.get("/")
def root():
    return {"message": "API de Puntuación Crediticia Lista", "status": "active"}

@app.get("/api/scorecard/metrics")
def get_metrics():
    if not metrics_data:
        raise HTTPException(status_code=500, detail="Métricas no disponibles")
    return metrics_data

@app.post("/api/scorecard/predict")
def predict_credit_score(app_data: CreditApplication):
    if model is None or scaler is None:
        load_artifacts()

    input_array = np.array([[
        app_data.annual_income,
        app_data.loan_amount,
        app_data.loan_term_months,
        app_data.dti_ratio,
        app_data.employment_years,
        app_data.past_defaults_count,
        app_data.credit_lines_count,
        app_data.repayment_history_score
    ]])

    input_scaled = scaler.transform(input_array)
    pd_prob = float(model.predict_proba(input_scaled)[0, 1])

    target_score = 600
    target_odds = 50
    pdo = 20
    factor = pdo / np.log(2.0)
    offset = target_score - (factor * np.log(target_odds))
    odds = (1.0 - pd_prob) / (pd_prob + 1e-7)
    raw_score = offset + (factor * np.log(odds + 1e-7))
    credit_score = int(np.clip(np.round(raw_score), 300, 850))

    if credit_score >= 720:
        risk_category = "Riesgo Muy Bajo"
        decision = "Aprobado Instantáneo"
        color = "emerald"
    elif credit_score >= 650:
        risk_category = "Riesgo Moderado"
        decision = "Aprobado Sujeto a Verificación"
        color = "cyan"
    elif credit_score >= 580:
        risk_category = "Riesgo Elevado"
        decision = "Revisión Manual por Analista"
        color = "amber"
    else:
        risk_category = "Riesgo Crítico"
        decision = "Rechazado"
        color = "rose"

    max_recommended_loan = round(min(app_data.annual_income * 0.45, app_data.loan_amount * 1.2), 2)

    return {
        "credit_score": credit_score,
        "probability_of_default": round(pd_prob, 4),
        "risk_category": risk_category,
        "decision": decision,
        "decision_color": color,
        "max_recommended_loan": max_recommended_loan,
        "dti_status": "Saludable" if app_data.dti_ratio < 35 else "Elevado"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8007, reload=True)
