#!/usr/bin/env python3
"""
Generador de Dataset Sintético de Riesgo Crediticio y Evaluación Financiera.
Simula historiales de préstamos bancarios, ingresos, ratios de deuda y comportamientos de impago.
"""

import os
import numpy as np
import pandas as pd

def generate_credit_dataset(num_records=5000, random_seed=42):
    np.random.seed(random_seed)

    # Variables Demográficas y Financieras
    age = np.random.randint(18, 70, size=num_records)
    annual_income = np.random.lognormal(mean=10.5, sigma=0.6, size=num_records)  # Ingreso anual ~ $35,000 - $120,000
    monthly_income = annual_income / 12.0

    loan_amount = np.random.lognormal(mean=9.5, sigma=0.7, size=num_records)    # Monto del préstamo ~ $5,000 - $50,000
    loan_term_months = np.random.choice([12, 24, 36, 48, 60], size=num_records, p=[0.1, 0.2, 0.4, 0.2, 0.1])
    
    monthly_debt_obligations = monthly_income * np.random.uniform(0.1, 0.65, size=num_records)
    dti = (monthly_debt_obligations / monthly_income) * 100.0                   # Debt-To-Income (%)

    employment_years = np.clip(np.random.exponential(scale=5.0, size=num_records), 0, 35)
    past_defaults_count = np.random.choice([0, 1, 2, 3], size=num_records, p=[0.75, 0.15, 0.07, 0.03])
    credit_lines_count = np.random.randint(1, 12, size=num_records)
    repayment_history_score = np.random.normal(loc=70, scale=15, size=num_records).clip(20, 100)

    # Logit de Probabilidad de Impago (Default)
    logit = (
        - 2.5
        + 0.035 * (dti - 35)
        + 1.1 * past_defaults_count
        - 0.04 * (repayment_history_score - 70)
        - 0.06 * employment_years
        + 0.000025 * (loan_amount - 15000)
        - 0.000015 * (annual_income - 45000)
    )

    probability_default = 1.0 / (1.0 + np.exp(-logit))
    is_default = (np.random.rand(num_records) < probability_default).astype(int)

    df = pd.DataFrame({
        "applicant_id": [f"CLIENT-{10000 + i}" for i in range(num_records)],
        "age": age,
        "annual_income": np.round(annual_income, 2),
        "loan_amount": np.round(loan_amount, 2),
        "loan_term_months": loan_term_months,
        "dti_ratio": np.round(dti, 2),
        "employment_years": np.round(employment_years, 1),
        "past_defaults_count": past_defaults_count,
        "credit_lines_count": credit_lines_count,
        "repayment_history_score": np.round(repayment_history_score, 1),
        "is_default": is_default
    })

    return df

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    
    output_csv = os.path.join(data_dir, "credit_dataset.csv")
    df_credit = generate_credit_dataset()
    df_credit.to_csv(output_csv, index=False)

    print(f"Dataset sintético generado con éxito ({len(df_credit)} registros) en: {output_csv}")
    print(f"Tasa de Impago (Default Rate): {df_credit['is_default'].mean() * 100:.2f}%")
