#!/usr/bin/env python3
"""
Entrenamiento y Calibración del Modelo de Scorecard Crediticio (300 - 850 puntos).
Calcula métricas de solvencia, ROC-AUC, Coeficiente de Gini y Estadística KS.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score, confusion_matrix, classification_report

def calculate_ks_statistic(y_true, y_prob):
    df = pd.DataFrame({"y_true": y_true, "y_prob": y_prob})
    df = df.sort_values(by="y_prob", ascending=False)
    df["cum_good"] = (df["y_true"] == 0).cumsum() / (df["y_true"] == 0).sum()
    df["cum_bad"] = (df["y_true"] == 1).cumsum() / (df["y_true"] == 1).sum()
    df["ks"] = np.abs(df["cum_bad"] - df["cum_good"])
    return float(df["ks"].max())

def probability_to_credit_score(pd_prob, target_score=600, target_odds=50, pdo=20):
    factor = pdo / np.log(2.0)
    offset = target_score - (factor * np.log(target_odds))
    odds = (1.0 - pd_prob) / (pd_prob + 1e-7)
    scores = offset + (factor * np.log(odds + 1e-7))
    return np.clip(np.round(scores), 300, 850)

def train_scorecard_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "credit_dataset.csv")

    if not os.path.exists(data_path):
        from generate_data import generate_credit_dataset
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df_credit = generate_credit_dataset()
        df_credit.to_csv(data_path, index=False)
    else:
        df_credit = pd.read_csv(data_path)

    features = [
        "annual_income", "loan_amount", "loan_term_months", 
        "dti_ratio", "employment_years", "past_defaults_count", 
        "credit_lines_count", "repayment_history_score"
    ]
    target = "is_default"

    X = df_credit[features]
    y = df_credit[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = LogisticRegression(C=1.0, penalty="l2", solver="lbfgs", max_iter=1000)
    model.fit(X_train_scaled, y_train)

    y_pred_prob = model.predict_proba(X_test_scaled)[:, 1]

    auc = float(roc_auc_score(y_test, y_pred_prob))
    gini = 2.0 * auc - 1.0
    ks_stat = calculate_ks_statistic(y_test.values, y_pred_prob)

    scores = probability_to_credit_score(y_pred_prob)

    metrics = {
        "roc_auc": round(auc, 4),
        "gini_coefficient": round(gini, 4),
        "ks_statistic": round(ks_stat, 4),
        "mean_credit_score": float(np.mean(scores)),
        "min_credit_score": float(np.min(scores)),
        "max_credit_score": float(np.max(scores)),
        "feature_names": features,
        "feature_coefficients": dict(zip(features, [round(float(c), 4) for c in model.coef_[0]]))
    }

    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(model, os.path.join(models_dir, "scorecard_model.joblib"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))

    with open(os.path.join(models_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("=========================================================")
    print("      RESULTADOS DE ENTRENAMIENTO CREDIT SCORECARD       ")
    print("=========================================================")
    print(f"ROC-AUC Score      : {auc:.4f}")
    print(f"Coeficiente Gini   : {gini:.4f}")
    print(f"Estadística KS     : {ks_stat:.4f}")
    print(f"Rango de Scores    : {np.min(scores):.0f} - {np.max(scores):.0f} puntos")
    print("=========================================================")
    print(f"Artefactos guardados en: {models_dir}")

if __name__ == "__main__":
    train_scorecard_model()
