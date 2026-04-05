import pandas as pd
import numpy as np
import os

def generate_synthetic_data(file_path):
    """
    Genera un dataset sintético de medicamentos en ESPAÑOL para propósitos de demostración.
    """
    data = {
        'drugName': [
            'Adalimumab', 'Infliximab', 'Etanercept', 'Metformina', 'Glipizida', 
            'Insulina Gargina', 'Lisinopril', 'Amlodipino', 'Losartán', 'Atorvastatina',
            'Simvastatina', 'Rosuvastatina', 'Sertralina', 'Escitalopram', 'Fluoxetina',
            'Albuterol', 'Fluticasona', 'Montelukast', 'Omeprazol', 'Esomeprazol',
            'Pantoprazol', 'Amoxicilina', 'Azitromicina', 'Levofloxacino', 'Ibuprofeno',
            'Naproxeno', 'Celecoxib'
        ],
        'condition': [
            'Artritis Reumatoide', 'Enfermedad de Crohn', 'Psoriasis', 'Diabetes Tipo 2', 'Diabetes Tipo 2',
            'Diabetes Tipo 1', 'Hipertensión', 'Hipertensión', 'Hipertensión', 'Colesterol Alto',
            'Colesterol Alto', 'Colesterol Alto', 'Depresión', 'Ansiedad', 'Depresión',
            'Asma', 'Asma', 'Alergias', 'Reflujo Gástrico', 'Reflujo Gástrico', 
            'Gastritis', 'Infección Bacteriana', 'Infección Bacteriana', 'Infección Bacteriana', 'Alivio del Dolor',
            'Alivio del Dolor', 'Inflamación'
        ],
        'review': [
            'Ayuda a manejar el dolor y la rigidez articular de manera muy efectiva.',
            'Inmunosupresor potente para condiciones crónicas severas.',
            'Mejora significativa en la claridad de la piel y el dolor articular.',
            'Tratamiento estándar para manejar los niveles de azúcar en sangre.',
            'Efectivo para estimular la producción natural de insulina.',
            'Insulina de acción prolongada para el control diario de glucosa.',
            'Controla la presión arterial con mínimos efectos secundarios.',
            'Bloqueador de canales de calcio efectivo para la hipertensión crónica.',
            'Excelente para la presión arterial y la protección renal.',
            'Estataline potente para reducir los niveles altos de colesterol LDL.',
            'Ampliamente utilizado y efectivo para el manejo del colesterol.',
            'Estatina muy potente para una reducción significativa de lípidos.',
            'Ayuda a estabilizar el estado de ánimo y los niveles de energía con el tiempo.',
            'Perfil limpio para el manejo del trastorno de ansiedad generalizada.',
            'Antidepresivo clásico que funciona bien para muchos pacientes.',
            'Inhalador de alivio rápido para síntomas repentinos de asma.',
            'Inhalador de esteroides diario para prevenir ataques de asma.',
            'Excelente para alergias estacionales y bloqueo de leucotrienos.',
            'Reduce el ácido estomacal y previene episodios de reflujo.',
            'Reductor de ácido más fuerte para problemas crónicos de reflujo.',
            'Protege el revestimiento del estómago de la producción excesiva de ácido.',
            'Antibiótico de amplio espectro para infecciones bacterianas comunes.',
            'Antibiótico de acción rápida para infecciones respiratorias.',
            'Antibiótico más fuerte para casos bacterianos más resistentes.',
            'Alivio confiable para el dolor y la fiebre de venta libre.',
            'Alivio del dolor más duradero para dolores persistentes.',
            'AINE selectivo para la inflamación y el malestar articular.'
        ],
        'rating': [9.5, 8.8, 9.2, 8.5, 7.8, 9.0, 8.2, 7.5, 8.4, 9.1, 8.2, 9.3, 8.6, 8.1, 8.4, 9.6, 8.9, 8.2, 8.8, 8.4, 7.9, 8.7, 8.3, 7.5, 9.2, 8.7, 8.5]
    }
    
    df = pd.DataFrame(data)
    # Crear carpeta si no existe (usando ruta absoluta o relativa basada en este script)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
    print(f"Dataset sintético (Español) creado en: {file_path}")
    return df

def load_data(file_path=None):
    """
    Carga el dataset de medicamentos. Si no existe, genera uno sintético.
    """
    if file_path is None:
        # Por defecto, misma carpeta que el script
        base_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(base_dir, 'drugs_data.csv')
    
    if not os.path.exists(file_path):
        return generate_synthetic_data(file_path)
    return pd.read_csv(file_path)

if __name__ == "__main__":
    # Generar en la carpeta actual del script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    generate_synthetic_data(os.path.join(base_dir, 'drugs_data.csv'))
