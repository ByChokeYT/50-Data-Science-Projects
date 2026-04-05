from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Añadimos el directorio `src` al path para poder importar el motor.
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from recommendation_engine import RecommendationEngine

app = FastAPI(title="Drug Recommendation System API")

# Configuración de CORS para el frontend en React.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = RecommendationEngine(data_path='src/drugs_data.csv')

class RecommendationRequest(BaseModel):
    user_input: str
    top_n: Optional[int] = 5

class DrugRecommendation(BaseModel):
    drugName: str
    condition: str
    rating: float
    review: str

@app.get("/")
def read_root():
    return {"message": "Drug Recommendation API is running!"}

@app.get("/conditions")
def get_conditions():
    """
    Retorna la lista de condiciones disponibles en el dataset.
    """
    return sorted(engine.df['condition'].unique().tolist())

@app.post("/recommend", response_model=List[DrugRecommendation])
def recommend_drugs(request: RecommendationRequest):
    """
    Retorna las mejores recomendaciones basadas en la entrada del usuario.
    """
    try:
        recommendations = engine.recommend(request.user_input, top_n=request.top_n)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
