import pandas as pd
import joblib
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

print("==================================================")
print("🩺 PROYECTO 1: PREDICCIÓN DE ENFERMEDADES (CÁNCER)")
print("==================================================\n")

# 1. Cargar el dataset (Cáncer de mama - dataset de prueba clásico de sklearn)
print("[+] 1. Cargando datos médicos...")
data = load_breast_cancer()
df = pd.DataFrame(data.data, columns=data.feature_names)
df['target'] = data.target

print(f"    - Total de pacientes: {df.shape[0]}")
print(f"    - Características médicas medidas: {df.shape[1] - 1}\n")

# 2. Dividir en variables independientes (X) y dependiente (y)
print("[+] 2. Procesando variables (X=Características, y=Diagnóstico)...")
X = df.drop('target', axis=1)
y = df['target'] # 0 = Maligno, 1 = Benigno

# 3. Separar en conjunto de entrenamiento y prueba (80% / 20%)
print("[+] 3. Separando datos en Entrenamiento (80%) y Prueba (20%)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Crear el modelo de Machine Learning (Random Forest)
print("[+] 4. Creando algoritmo predictivo (Random Forest)...")
modelo = RandomForestClassifier(random_state=42)

# 5. Entrenar el modelo
print("[+] 5. Entrenando el modelo médico con los datos de entrenamiento...")
modelo.fit(X_train, y_train)

# 6. Hacer predicciones
print("[+] 6. Realizando predicciones en los pacientes de prueba...\n")
predicciones = modelo.predict(X_test)

# 7. Evaluar el modelo
precision = accuracy_score(y_test, predicciones)
print("================ RESULTADOS ======================")
print(f"✅ Precisión del modelo: {precision * 100:.2f}%")
print("==================================================")
print("\nReporte Detallado:")
print(classification_report(y_test, predicciones, target_names=["Maligno", "Benigno"]))

import os

# 8. Exportar modelo entrenado para que FastAPI lo utilice
print("\n[+] 8. Exportando el modelo de IA entrenado...")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(BASE_DIR, 'models', 'modelo_cancer_rf.pkl')
joblib.dump(modelo, model_path)
print(f"    ✅ Modelo guardado en: {model_path}")
