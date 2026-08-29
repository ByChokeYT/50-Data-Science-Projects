import xgboost as xgb
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import joblib
import os
from processing import load_and_preprocess_data

MODEL_DIR = os.path.join(os.path.dirname(__file__), '../models')

def train_model():
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    X_train, X_test, y_train, y_test, encoders = load_and_preprocess_data()
    
    print("Entrenando modelo XGBoost...")
    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )
    
    model.fit(X_train, y_train)
    
    # Evaluación
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    print("\nResultados del Modelo:")
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, y_proba):.4f}")
    
    # Guardar modelo y codificadores
    joblib.dump(model, os.path.join(MODEL_DIR, 'readmission_model.joblib'))
    joblib.dump(encoders, os.path.join(MODEL_DIR, 'encoders.joblib'))
    print(f"\nModelo guardado en {MODEL_DIR}")

if __name__ == "__main__":
    train_model()
