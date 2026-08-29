import pandas as pd
import numpy as np
import sqlite3
import os
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

DB_PATH = os.path.join(os.path.dirname(__file__), '../data/hospital.db')

def load_and_preprocess_data():
    conn = sqlite3.connect(DB_PATH)
    
    # Query SQL para unir las tablas
    query = """
    SELECT 
        p.age, p.gender, p.ethnicity, p.insurance_type,
        a.admission_type, a.primary_diagnosis, a.severity_index,
        a.num_lab_procedures, a.num_medications, a.readmitted_30d
    FROM admissions a
    JOIN patients p ON a.patient_id = p.patient_id
    """
    
    df = pd.read_sql_query(query, conn)
    conn.close()
    
    # Codificación de variables categóricas
    le_dict = {}
    categorical_cols = ['gender', 'ethnicity', 'insurance_type', 'admission_type', 'primary_diagnosis']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        le_dict[col] = le
        
    X = df.drop('readmitted_30d', axis=1)
    y = df['readmitted_30d']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    return X_train, X_test, y_train, y_test, le_dict

if __name__ == "__main__":
    X_train, X_test, y_train, y_test, encoders = load_and_preprocess_data()
    print(f"Dataset cargado. Forma de X_train: {X_train.shape}")
    print(f"Distribución de clases en y_train:\n{y_train.value_counts(normalize=True)}")
