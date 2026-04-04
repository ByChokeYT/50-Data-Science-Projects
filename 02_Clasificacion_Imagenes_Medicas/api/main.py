from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io
import torch
import open_clip
from PIL import Image
import warnings

warnings.filterwarnings('ignore')

app = FastAPI(title="Tricell Universal Medical API (BiomedCLIP V2.1)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TRICELL UNIVERSAL BRAIN (V2.1 - Optimizada) ---
try:
    print("⏳ Sincronizando con Núcleo BiomedCLIP (Microsoft)...")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    # Usar el nombre de repo exacto corregido
    model_name = 'hf-hub:microsoft/BiomedCLIP-PubMedBERT_256-vit_base_patch16_224'
    
    model, _, preprocess_val = open_clip.create_model_and_transforms(model_name)
    tokenizer = open_clip.get_tokenizer(model_name)
    
    model.to(device)
    model.eval()
    
    print(f"✅ Núcleo TRICELL V2.1 Cargado en {device.upper()}.")
except Exception as e:
    model = None
    print(f"⚠️ Error Crítico en Núcleo: {e}")

# Definición de categorías independientes para Zero-Shot mejorado
MODALITIES = ["X-ray image", "MRI scan", "CT scan", "Ultrasound", "Histopathology slide"]
ANATOMIES = ["Chest and Lungs", "Head and Brain", "Abdominal region", "Spine and Back", "Hand and Bones", "Pelvic area"]
DIAGNOSIS_LABELS = ["Normal and healthy medical image", "Abnormal medical image with pathology or disease"]

@app.post("/analizar_placa")
async def analyze_medical_image(file: UploadFile = File(...)):
    if model is None:
        return {"error": "Mainframe fuera de línea. Error en carga del modelo BiomedCLIP."}
        
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocesamiento
        image_input = preprocess_val(image).unsqueeze(0).to(device)
        
        # Inferencia por categorías (Evitar interferencia entre labels)
        results = {}
        
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            image_features /= image_features.norm(dim=-1, keepdim=True)
            
            for cat_name, labels in [("modality", MODALITIES), ("anatomy", ANATOMIES), ("diagnosis", DIAGNOSIS_LABELS)]:
                text_inputs = tokenizer(labels).to(device)
                text_features = model.encode_text(text_inputs)
                text_features /= text_features.norm(dim=-1, keepdim=True)
                
                # Similitud Coseno
                similarity = (100.0 * image_features @ text_features.t()).softmax(dim=-1).cpu().numpy()[0]
                
                best_idx = similarity.argmax()
                results[cat_name] = {
                    "label": labels[best_idx],
                    "confidence": round(float(similarity[best_idx]) * 100, 2)
                }

        is_abnormal = results["diagnosis"]["label"] == DIAGNOSIS_LABELS[1]
        
        return {
            "modality": results["modality"]["label"].replace(" image", "").replace(" scan", ""),
            "anatomy": results["anatomy"]["label"].replace(" and Lungs", "").replace(" and Brain", "").replace(" region", ""),
            "diagnosis": "Hallazgo Anómalo Detectado" if is_abnormal else "Tejido Normal / Sano",
            "confidence": results["diagnosis"]["confidence"],
            "status": "danger" if is_abnormal else "safe",
            "raw_analysis": f"Sincronización: {results['modality']['label']} de {results['anatomy']['label']}"
        }
        
    except Exception as e:
        return {"error": f"Fallo en Núcleo: {str(e)}"}

@app.get("/")
def health():
    return {"status": "TRICELL Universal Hub V2.1 [ONLINE]"}
