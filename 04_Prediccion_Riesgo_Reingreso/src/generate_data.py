import pandas as pd
import numpy as np
import sqlite3
import os
from datetime import datetime, timedelta

# Configuración
np.random.seed(42)
NUM_PATIENTS = 1000
NUM_ADMISSIONS = 2500
DB_PATH = os.path.join(os.path.dirname(__file__), '../data/hospital.db')

def generate_patients():
    patient_ids = np.arange(1, NUM_PATIENTS + 1)
    ages = np.random.randint(18, 95, size=NUM_PATIENTS)
    genders = np.random.choice(['Masculino', 'Femenino', 'Otro'], size=NUM_PATIENTS)
    ethnicities = np.random.choice(['Hispano', 'Caucásico', 'Afroamericano', 'Asiático'], size=NUM_PATIENTS)
    insurance = np.random.choice(['Privado', 'Público', 'Sin Seguro'], size=NUM_PATIENTS, p=[0.4, 0.4, 0.2])
    
    return pd.DataFrame({
        'patient_id': patient_ids,
        'age': ages,
        'gender': genders,
        'ethnicity': ethnicities,
        'insurance_type': insurance
    })

def generate_admissions(patients_df):
    admission_ids = np.arange(1, NUM_ADMISSIONS + 1)
    patient_ids = np.random.choice(patients_df['patient_id'], size=NUM_ADMISSIONS)
    
    start_date = datetime(2023, 1, 1)
    admission_dates = [start_date + timedelta(days=np.random.randint(0, 365)) for _ in range(NUM_ADMISSIONS)]
    lengths_of_stay = np.random.poisson(lam=5, size=NUM_ADMISSIONS) + 1
    discharge_dates = [admission_dates[i] + timedelta(days=int(lengths_of_stay[i])) for i in range(NUM_ADMISSIONS)]
    
    admission_types = np.random.choice(['Emergencia', 'Urgente', 'Electiva'], size=NUM_ADMISSIONS, p=[0.5, 0.3, 0.2])
    diagnoses = np.random.choice(['Diabetes', 'Cardiopatía', 'Respiratorio', 'Infección', 'Trauma', 'Digestivo'], size=NUM_ADMISSIONS)
    severity = np.random.randint(1, 6, size=NUM_ADMISSIONS)
    
    num_labs = np.random.randint(1, 50, size=NUM_ADMISSIONS)
    num_meds = np.random.randint(1, 20, size=NUM_ADMISSIONS)
    
    # Simular una lógica para el riesgo de reingreso (para que el modelo aprenda algo)
    # Mayor edad, mayor severidad y más procedimientos aumentan el riesgo
    risk_score = (
        (np.array([p.age for p in patients_df.iloc[patient_ids-1].itertuples()]) / 100) * 0.3 +
        (severity / 5) * 0.4 +
        (num_meds / 20) * 0.2 +
        (np.random.random(NUM_ADMISSIONS) * 0.1)
    )
    readmitted = (risk_score > 0.6).astype(int)
    
    admissions_df = pd.DataFrame({
        'admission_id': admission_ids,
        'patient_id': patient_ids,
        'admission_date': [d.strftime('%Y-%m-%d') for d in admission_dates],
        'discharge_date': [d.strftime('%Y-%m-%d') for d in discharge_dates],
        'admission_type': admission_types,
        'primary_diagnosis': diagnoses,
        'severity_index': severity,
        'num_lab_procedures': num_labs,
        'num_medications': num_meds,
        'readmitted_30d': readmitted
    })
    
    return admissions_df

def save_to_sql(patients_df, admissions_df):
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    
    patients_df.to_sql('patients', conn, if_exists='replace', index=False)
    admissions_df.to_sql('admissions', conn, if_exists='replace', index=False)
    
    conn.close()
    print(f"Datos guardados exitosamente en {DB_PATH}")

if __name__ == "__main__":
    print("Generando datos sintéticos...")
    p_df = generate_patients()
    a_df = generate_admissions(p_df)
    save_to_sql(p_df, a_df)
