#!/usr/bin/env python3
"""
Entrenamiento de Modelo de Detección de Fraude Bancario y Outliers (Isolation Forest + XGBoost).
Calcula PR-AUC, ROC-AUC y tasa de falsos positivos (FPR) para ciberseguridad financiera.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.metrics import roc_auc_score, precision_recall_curve, auc, confusion_matrix

def train_fraud_model():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(base_dir, "data", "transactions_dataset.csv")

    if not os.path.exists(data_path):
        from generate_transactions import generate_fraud_dataset
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df_tx = generate_fraud_dataset()
        df_tx.to_csv(data_path, index=False)
    else:
        df_tx = pd.read_csv(data_path)

    features = [
        "amount_usd", "distance_from_home_km", "transaction_hour",
        "is_new_device", "velocity_txn_per_min", "failed_pin_attempts",
        "is_foreign_country"
    ]
    target = "is_fraud"

    X = df_tx[features]
    y = df_tx[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 1. Isolation Forest Unsupervised Anomaly Detection
    iso_forest = IsolationForest(contamination=0.02, random_state=42)
    iso_forest.fit(X_train_scaled)

    # 2. Supervised XGBoost / Gradient Boosting Classifier
    try:
        from xgboost import XGBClassifier
        model = XGBClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42, eval_metric="logloss")
    except ImportError:
        from sklearn.ensemble import GradientBoostingClassifier
        model = GradientBoostingClassifier(n_estimators=100, max_depth=4, learning_rate=0.05, random_state=42)

    model.fit(X_train_scaled, y_train)

    # Predicción y Evaluación
    y_prob = model.predict_proba(X_test_scaled)[:, 1]
    y_pred = (y_prob >= 0.50).astype(int)

    roc_auc = float(roc_auc_score(y_test, y_prob))
    precision, recall, _ = precision_recall_curve(y_test, y_prob)
    pr_auc = float(auc(recall, precision))

    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    fpr = float(fp / (fp + tn + 1e-7))

    metrics = {
        "roc_auc": round(roc_auc, 4),
        "pr_auc": round(pr_auc, 4),
        "false_positive_rate": round(fpr, 4),
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp)
        },
        "feature_names": features
    }

    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    joblib.dump(model, os.path.join(models_dir, "fraud_model.joblib"))
    joblib.dump(iso_forest, os.path.join(models_dir, "isolation_forest.joblib"))
    joblib.dump(scaler, os.path.join(models_dir, "scaler.joblib"))

    with open(os.path.join(models_dir, "metrics.json"), "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("=========================================================")
    print("      RESULTADOS DE ENTRENAMIENTO DETECCIÓN DE FRAUDE    ")
    print("=========================================================")
    print(f"ROC-AUC Score            : {roc_auc:.4f}")
    print(f"PR-AUC (Precision-Recall): {pr_auc:.4f}")
    print(f"Tasa Falsos Positivos    : {fpr * 100:.2f}%")
    print(f"Fraudes Detectados (TP)  : {tp} de {tp + fn}")
    print("=========================================================")
    print(f"Artefactos guardados en: {models_dir}")

if __name__ == "__main__":
    train_fraud_model()
