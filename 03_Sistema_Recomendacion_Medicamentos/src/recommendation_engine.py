import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os
import sys

# Asegurar que se puede importar data_handler desde el mismo directorio
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from data_handler import load_data

class RecommendationEngine:
    def __init__(self, data_path=None):
        if data_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            data_path = os.path.join(base_dir, 'drugs_data.csv')
            
        self.data_path = data_path
        self.df = None
        # Usamos analyzer='char_wb' y ngrams para tolerar errores ortográficos (typos)
        self.vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(3, 5))
        self.tfidf_matrix = None
        self.load_and_train()

    def load_and_train(self):
        """
        Carga el dataset y entrena el vectorizador sobre las condiciones y reseñas.
        """
        self.df = load_data(self.data_path)
        if self.df is None:
            print("Error: No se pudo cargar el dataset.")
            return

        # Limpieza básica y combinación de características
        self.df['condition_clean'] = self.df['condition'].fillna('').str.lower()
        self.df['review_clean'] = self.df['review'].fillna('').str.lower()
        self.df['combined_features'] = self.df['condition_clean'] + " " + self.df['review_clean']
        
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined_features'])

    def recommend(self, user_input, top_n=5):
        """
        Recomienda medicamentos basados en la entrada del usuario (tolerante a typos).
        """
        if self.df is None or self.tfidf_matrix is None:
            return []
            
        user_input_clean = user_input.lower().strip()
        user_tfidf = self.vectorizer.transform([user_input_clean])
        cosine_sim = cosine_similarity(user_tfidf, self.tfidf_matrix)
        
        # Obtenemos los índices de las mejores coincidencias.
        sim_scores = list(enumerate(cosine_sim[0]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Obtenemos los índices de los medicamentos recomendados.
        drug_indices = [i[0] for i in sim_scores[:top_n]]
        
        # Retornamos los detalles de los medicamentos.
        return self.df.iloc[drug_indices][['drugName', 'condition', 'rating', 'review']].to_dict('records')

if __name__ == "__main__":
    # Prueba rápida del motor con un error ortográfico.
    engine = RecommendationEngine()
    print("Prueba con 'astritirs' (typo de gastritis):")
    recs = engine.recommend("astritirs")
    for r in recs:
        print(f"- {r['drugName']} (Condición: {r['condition']}, Score: {r['rating']})")
