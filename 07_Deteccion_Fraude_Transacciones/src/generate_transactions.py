#!/usr/bin/env python3
"""
Generador de Dataset Sintético de Transacciones Bancarias y Detección de Fraude.
Simula montos de transacciones, coordenadas GPS atípicas, cambios de dispositivo e indicadores de velocidad.
"""

import os
import numpy as np
import pandas as pd

def generate_fraud_dataset(num_records=8000, fraud_ratio=0.02, random_seed=42):
    np.random.seed(random_seed)

    num_frauds = int(num_records * fraud_ratio)
    num_legit = num_records - num_frauds

    # Transacciones Legítimas
    legit_amounts = np.random.lognormal(mean=3.8, sigma=0.8, size=num_legit)  # ~ $10 - $150
    legit_distance_km = np.random.exponential(scale=5.0, size=num_legit)       # Distancia habitual ~ 0-15 km
    legit_hour = np.random.choice(range(6, 23), size=num_legit)                 # Horario diurno 6am-11pm
    legit_is_new_device = np.random.choice([0, 1], size=num_legit, p=[0.92, 0.08])
    legit_velocity_per_min = np.random.choice([1, 2], size=num_legit, p=[0.85, 0.15])
    legit_failed_pin_attempts = np.random.choice([0, 1], size=num_legit, p=[0.95, 0.05])
    legit_is_foreign_country = np.random.choice([0, 1], size=num_legit, p=[0.97, 0.03])

    # Transacciones Fraudulentas (Anómalas)
    fraud_amounts = np.random.lognormal(mean=6.5, sigma=1.1, size=num_frauds)  # ~ $300 - $3,000
    fraud_distance_km = np.random.exponential(scale=150.0, size=num_frauds) + 50.0 # Distancia anómala > 50 km
    fraud_hour = np.random.choice(list(range(0, 6)) + [23], size=num_frauds)     # Horario nocturno 11pm-5am
    fraud_is_new_device = np.random.choice([0, 1], size=num_frauds, p=[0.25, 0.75])
    fraud_velocity_per_min = np.random.choice([3, 4, 5, 6], size=num_frauds)
    fraud_failed_pin_attempts = np.random.choice([0, 1, 2, 3], size=num_frauds, p=[0.2, 0.3, 0.3, 0.2])
    fraud_is_foreign_country = np.random.choice([0, 1], size=num_frauds, p=[0.35, 0.65])

    # Ensamblaje
    amounts = np.concatenate([legit_amounts, fraud_amounts])
    distance = np.concatenate([legit_distance_km, fraud_distance_km])
    hours = np.concatenate([legit_hour, fraud_hour])
    new_device = np.concatenate([legit_is_new_device, fraud_is_new_device])
    velocity = np.concatenate([legit_velocity_per_min, fraud_velocity_per_min])
    pin_fails = np.concatenate([legit_failed_pin_attempts, fraud_failed_pin_attempts])
    foreign = np.concatenate([legit_is_foreign_country, fraud_is_foreign_country])
    is_fraud = np.concatenate([np.zeros(num_legit), np.ones(num_frauds)]).astype(int)

    # Shuffling
    indices = np.arange(num_records)
    np.random.shuffle(indices)

    df = pd.DataFrame({
        "transaction_id": [f"TXN-{100000 + i}" for i in range(num_records)],
        "amount_usd": np.round(amounts[indices], 2),
        "distance_from_home_km": np.round(distance[indices], 1),
        "transaction_hour": hours[indices],
        "is_new_device": new_device[indices],
        "velocity_txn_per_min": velocity[indices],
        "failed_pin_attempts": pin_fails[indices],
        "is_foreign_country": foreign[indices],
        "is_fraud": is_fraud[indices]
    })

    return df

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)

    output_csv = os.path.join(data_dir, "transactions_dataset.csv")
    df_tx = generate_fraud_dataset()
    df_tx.to_csv(output_csv, index=False)

    print(f"Dataset de transacciones bancarias generado ({len(df_tx)} registros) en: {output_csv}")
    print(f"Tasa de Transacciones Anómalas (Fraude): {df_tx['is_fraud'].mean() * 100:.2f}%")
