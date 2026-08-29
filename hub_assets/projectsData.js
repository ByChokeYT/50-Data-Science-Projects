/**
 * Hub de 50 Proyectos de Ciencia de Datos
 * Base de Datos Centralizada con URLs de Aplicaciones Desplegadas
 */

const SECTORS = [
  { id: 'all', name: 'Todos los Sectores', icon: 'grid', color: 'cyan' },
  { id: 'Salud', name: 'Salud & Medicina', icon: 'activity', color: 'rose' },
  { id: 'Finanzas', name: 'Finanzas & Banca', icon: 'dollar-sign', color: 'emerald' },
  { id: 'E-Commerce', name: 'E-Commerce & Retail', icon: 'shopping-cart', color: 'amber' },
  { id: 'Marketing', name: 'Marketing & Ventas', icon: 'trending-up', color: 'purple' },
  { id: 'Deportes', name: 'Deportes & Gaming', icon: 'award', color: 'blue' },
  { id: 'Logística', name: 'Logística & Transporte', icon: 'truck', color: 'orange' },
  { id: 'Energía', name: 'Energía & Clima', icon: 'zap', color: 'yellow' },
  { id: 'Educación', name: 'Educación & EdTech', icon: 'book-open', color: 'indigo' },
  { id: 'Social Media', name: 'Redes Sociales & Medios', icon: 'share-2', color: 'pink' },
  { id: 'Gobierno', name: 'Gobierno & Smart Cities', icon: 'globe', color: 'teal' }
];

const PROJECTS = [
  // ---------------- SALUD ----------------
  {
    id: 1,
    number: '01',
    sector: 'Salud',
    title: 'Diagnóstico Predictivo Oncológico (Full-Stack)',
    status: 'completed',
    appUrl: '01_Prediccion_Enfermedades/frontend/dist/index.html',
    description: 'Sistema completo con API en FastAPI, Frontend interactivo en React y modelo Scikit-Learn para la detección precoz del cáncer de mama mediante muestras tumorales.',
    folder: '01_Prediccion_Enfermedades',
    tags: ['Python', 'scikit-learn', 'FastAPI', 'React', 'TailwindV4'],
    features: [
      'Entrenamiento de clasificador de Random Forest / SVM en Breast Cancer Dataset',
      'Servicio RESTful con FastAPI y validación con Pydantic',
      'Dashboard Web interactivo con formulario dinámico y medidor visual de probabilidad',
      'Pruebas unitarias de API e integración de modelo'
    ],
    architecture: 'React (Vite) <---> FastAPI Backend <---> Modelo Scikit-Learn (Joblib)',
    setup: 'cd 01_Prediccion_Enfermedades/api && uvicorn main:app --reload'
  },
  {
    id: 2,
    number: '02',
    sector: 'Salud',
    title: 'Clasificación de Imágenes Médicas (Rayos X, Resonancias)',
    status: 'in_progress',
    appUrl: '02_Clasificacion_Imagenes_Medicas/frontend/dist/index.html',
    description: 'Red Neuronal Convolucional (CNN) en PyTorch/TensorFlow para clasificar patologías respiratorias y neumonía a partir de radiografías de tórax.',
    folder: '02_Clasificacion_Imagenes_Medicas',
    tags: ['Python', 'TensorFlow', 'Keras', 'PyTorch', 'OpenCV'],
    features: [
      'Preprocesamiento de imágenes médicas con OpenCV (Ecualización CLAHE, data augmentation)',
      'Transfer Learning con ResNet50 / EfficientNet',
      'Mapa de calor Grad-CAM para interpretabilidad del diagnóstico clínico',
      'Exportación de modelos a ONNX y TensorRT'
    ],
    architecture: 'Dataset Rayos X ---> Augmentation OpenCV ---> PyTorch CNN ---> Grad-CAM Visualizer',
    setup: 'python 02_Clasificacion_Imagenes_Medicas/src/train.py'
  },
  {
    id: 3,
    number: '03',
    sector: 'Salud',
    title: 'Sistema de Recomendación de Medicamentos',
    status: 'completed',
    appUrl: '03_Sistema_Recomendacion_Medicamentos/frontend/dist/index.html',
    description: 'Sistema interactivo basado en Procesamiento de Lenguaje Natural (NLP) que recomienda alternativas terapéuticas analizando condiciones médicas y reseñas de pacientes.',
    folder: '03_Sistema_Recomendacion_Medicamentos',
    tags: ['Python', 'pandas', 'scikit-learn', 'NLP', 'TF-IDF'],
    features: [
      'Procesamiento de texto clínico con TF-IDF y Similitud del Coseno',
      'Filtro de interacciones medicamentosas y contraindicaciones',
      'Puntuación de eficacia basada en opiniones de usuarios (Sentiment Analysis)',
      'Interfaz modular para consultas de médicos y farmacéuticos'
    ],
    architecture: 'Reviews Dataset ---> TF-IDF Vectorizer ---> Cosine Similarity ---> API Recomender',
    setup: 'python 03_Sistema_Recomendacion_Medicamentos/src/recommend.py'
  },
  {
    id: 4,
    number: '04',
    sector: 'Salud',
    title: 'Predicción de Riesgo de Reingreso de Pacientes',
    status: 'completed',
    appUrl: '04_Prediccion_Riesgo_Reingreso/frontend/dist/index.html',
    description: 'Modelo predictivo con XGBoost para estimar la probabilidad de que un paciente hospitalizado vuelva a ingresar en menos de 30 días.',
    folder: '04_Prediccion_Riesgo_Reingreso',
    tags: ['Python', 'scikit-learn', 'XGBoost', 'SQL', 'SHAP'],
    features: [
      'Integración con datos hospitalarios en SQL (historial clínico y diagnósticos ICD-10)',
      'Manejo de desbalance de clases con SMOTE y focal loss',
      'Explicabilidad clínica del modelo usando valores SHAP',
      'Dashboard para el equipo de enfermería y gestión hospitalaria'
    ],
    architecture: 'SQL DB ---> Preprocesamiento Pandas ---> XGBoost Model ---> SHAP Dashboard',
    setup: 'python 04_Prediccion_Riesgo_Reingreso/src/predict.py'
  },
  {
    id: 5,
    number: '05',
    sector: 'Salud',
    title: 'Análisis de Supervivencia al Cáncer',
    status: 'completed',
    appUrl: '05_Analisis_Supervivencia_Cancer/README.md',
    description: 'Modelado estadístico avanzado de tiempos hasta un evento usando estimadores Kaplan-Meier y modelos de riesgos proporcionales de Cox.',
    folder: '05_Analisis_Supervivencia_Cancer',
    tags: ['Python', 'Lifelines', 'scikit-learn', 'Matplotlib', 'Seaborn'],
    features: [
      'Curvas de supervivencia Kaplan-Meier según subgrupos de pacientes',
      'Regresión de Cox para identificar factores de riesgo significativos',
      'Validación cruzada concordante (C-index)',
      'Visualización interactiva de curvas epidemiológicas'
    ],
    architecture: 'Clinical Cohort Data ---> Lifelines CoxPHModel ---> Survival Curve Generator',
    setup: 'python 05_Analisis_Supervivencia_Cancer/src/survival_analysis.py'
  },

  // ---------------- FINANZAS ----------------
  {
    id: 6,
    number: '06',
    sector: 'Finanzas',
    title: 'Modelo de Puntuación Crediticia (Credit Scoring)',
    status: 'completed',
    appUrl: '06_Puntuacion_Crediticia_Finanzas/frontend/dist/index.html',
    description: 'Evaluación automática de solvencia financiera para otorgamiento de créditos mediante modelos ensamble auditables (Scorecard 300 - 850 puntos).',
    folder: '06_Puntuacion_Crediticia_Finanzas',
    tags: ['Python', 'scikit-learn', 'XGBoost', 'SQL', 'FastAPI', 'React'],
    features: [
      'Generación e ingesta de datos crediticios sintéticos y ratios de endeudamiento (DTI)',
      'Transformación WoE (Weight of Evidence) e información mutua (IV)',
      'Calibración de probabilidades a escala FICO/Scorecard (300 a 850 puntos)',
      'Cálculo de ROC-AUC (0.824), Coeficiente de Gini (0.648) y estadística KS (0.501)',
      'Dashboard Web interactivo para simulación de préstamos y veredicto crediticio instantáneo'
    ],
    architecture: 'React (Vite) <---> FastAPI REST Service <---> Logistic Regression Scorecard Model',
    setup: 'python 06_Puntuacion_Crediticia_Finanzas/src/train_scorecard.py'
  },
  {
    id: 7,
    number: '07',
    sector: 'Finanzas',
    title: 'Detección de Fraude en Transacciones Bancarias',
    status: 'completed',
    appUrl: '07_Deteccion_Fraude_Transacciones/frontend/dist/index.html',
    description: 'Identificación de anomalías bancarias en tiempo real utilizando algoritmos de aprendizaje no supervisado (Isolation Forest) y clasificadores ensamble.',
    folder: '07_Deteccion_Fraude_Transacciones',
    tags: ['Python', 'Isolation Forest', 'XGBoost', 'FastAPI', 'React', 'PCI-DSS'],
    features: [
      'Detección de outliers en tiempo real con Isolation Forest y XGBoost con SMOTE',
      'Evaluación de anomalías de geolocalización, cambio de dispositivo e intentos fallidos de PIN',
      'Protocolos automáticos de acción (Aprobada, Autenticación OTP 2FA, Bloqueo de Tarjeta)',
      'Cumplimiento con reglamentaciones ASFI Bolivia y normativa internacional PCI-DSS 4.0'
    ],
    architecture: 'React (Vite) <---> FastAPI REST Service <---> Isolation Forest + XGBoost Model',
    setup: 'python 07_Deteccion_Fraude_Transacciones/src/train_fraud_detector.py'
  },
  {
    id: 8,
    number: '08',
    sector: 'Finanzas',
    title: 'Pronóstico de Precios del Mercado de Valores',
    status: 'completed',
    appUrl: '08_Pronostico_Mercado_Valores/frontend/dist/index.html',
    description: 'Terminal de trading cuantitativo para predicción de series temporales bursátiles combinando redes LSTM, Prophet e indicadores técnicos (RSI, MACD, Bollinger).',
    folder: '08_Pronostico_Mercado_Valores',
    tags: ['Python', 'LSTM', 'Prophet', 'FastAPI', 'React', 'BBV'],
    features: [
      'Ingesta de datos de precios bursátiles e indicadores cuantitativos (RSI, MACD, Bollinger)',
      'Proyección de tendencias a 7, 14, 30 y 90 días con bandas de confianza del 95%',
      'Backtesting de estrategias con métricas de Ratio Sharpe y Máximo Drawdown %',
      'Cumplimiento con normativas de la Bolsa Boliviana de Valores (BBV) y ASFI'
    ],
    architecture: 'React (Vite) <---> FastAPI REST Service <---> LSTM & Prophet TimeSeries Model',
    setup: 'python 08_Pronostico_Mercado_Valores/src/train_stock_forecaster.py'
  },
  {
    id: 9,
    number: '09',
    sector: 'Finanzas',
    title: 'Segmentación de Clientes (Datos de Préstamos)',
    status: 'planned',
    description: 'Agrupamiento de clientes bancarios basado en comportamiento crediticio usando K-Means, DBSCAN y Reducción de Dimensionalidad (PCA).',
    folder: '09_Segmentacion_Clientes_Prestamos',
    tags: ['Python', 'K-Means', 'DBSCAN', 'PCA', 'Plotly'],
    features: [
      'Análisis RFM (Recencia, Frecuencia, Valor Monetario) sobre cuentas de préstamo',
      'Selección del número óptimo de clusters (Método del Codo y Silueta)',
      'Visualizaciones en 3D interactivas con Plotly',
      'Generación de perfiles de clientes para campañas personalizadas'
    ],
    architecture: 'Loan Data ---> PCA Dim Reduction ---> K-Means Clustering ---> Plotly 3D Dashboard',
    setup: 'python 09_Segmentacion_Clientes_Prestamos/src/cluster.py'
  },
  {
    id: 10,
    number: '10',
    sector: 'Finanzas',
    title: 'Optimización de Riesgo y Portafolio',
    status: 'planned',
    description: 'Construcción de carteras de inversión eficientes según la teoría de Markowitz (Frontera Eficiente) y maximización del Ratio Sharpe.',
    folder: '10_Optimizacion_Riesgo_Portafolio',
    tags: ['Python', 'PyPortfolioOpt', 'NumPy', 'SciPy', 'CVXPY'],
    features: [
      'Cálculo de matrices de covarianza encogida (Ledoit-Wolf)',
      'Optimización cuadrática con restricciones de ponderación de activos',
      'Simulación de Montecarlo para medir el Value at Risk (VaR)',
      'Rebalanceo automatizado de cartera'
    ],
    architecture: 'Asset Prices ---> Covariance Shrinkage ---> Efficient Frontier Solver ---> Allocation Output',
    setup: 'python 10_Optimizacion_Riesgo_Portafolio/src/portfolio_opt.py'
  },

  // ---------------- E-COMMERCE ----------------
  {
    id: 11,
    number: '11',
    sector: 'E-Commerce',
    title: 'Sistema de Recomendación (Estilo Amazon)',
    status: 'planned',
    description: 'Motor híbrido de recomendación de productos que combina filtrado colaborativo basado en el usuario y filtrado basado en contenido.',
    folder: '11_Recomendador_Ecommerce_Amazon',
    tags: ['Python', 'Surprise', 'scikit-learn', 'TensorFlow', 'FastAPI'],
    features: [
      'Factorización de matrices con SVD (Singular Value Decomposition)',
      'Filtro de productos similares mediante Embeddings de texto y categorías',
      'Gestión de cold-start para nuevos usuarios y productos',
      'API REST para sugerencias personalizadas en checkout'
    ],
    architecture: 'User Interactions ---> SVD Matrix Factorization ---> Hybrid Ranker ---> REST API',
    setup: 'python 11_Recomendador_Ecommerce_Amazon/src/recommend_engine.py'
  },
  {
    id: 12,
    number: '12',
    sector: 'E-Commerce',
    title: 'Predicción de Abandono de Clientes (Churn)',
    status: 'planned',
    description: 'Identificación temprana de usuarios en riesgo de dejar de comprar en la plataforma usando modelos predictivos y análisis de retención.',
    folder: '12_Prediccion_Churn_Ecommerce',
    tags: ['Python', 'XGBoost', 'scikit-learn', 'SQL', 'Featuretools'],
    features: [
      'Ingeniería de características automatizada con Featuretools',
      'Construcción de métricas de recencia y frecuencia de compra',
      'Evaluación de curva Precision-Recall para priorizar intervención',
      'Integración con herramientas de email marketing'
    ],
    architecture: 'Events DB ---> Feature Engineering ---> XGBoost Classifier ---> Churn Risk Roster',
    setup: 'python 12_Prediccion_Churn_Ecommerce/src/churn_pipeline.py'
  },
  {
    id: 13,
    number: '13',
    sector: 'E-Commerce',
    title: 'Análisis de Sentimiento en Reseñas de Productos',
    status: 'planned',
    description: 'Extracción de opiniones y nivel de satisfacción de comentarios mediante modelos Transformer (BERT / RoBERTa) multilingües.',
    folder: '13_Analisis_Sentimiento_Resenas',
    tags: ['Python', 'NLTK', 'spaCy', 'HuggingFace', 'Transformers'],
    features: [
      'Finetuning de distilBERT para clasificación tri-clase (Positivo, Neutro, Negativo)',
      'Extracción de aspectos clave (Aspect-Based Sentiment Analysis)',
      'Generación de resumen automático de quejas frecuentes',
      'Visualización de nube de palabras interactiva'
    ],
    architecture: 'Raw Reviews ---> HuggingFace Pipeline ---> Aspect Extractor ---> Sentiment Gauge',
    setup: 'python 13_Analisis_Sentimiento_Resenas/src/sentiment_analyzer.py'
  },
  {
    id: 14,
    number: '14',
    sector: 'E-Commerce',
    title: 'Modelo de Precios Dinámicos',
    status: 'planned',
    description: 'Optimización de margen de ganancias ajustando el precio de catálogo en función de demanda, stock disponible y precios de competidores.',
    folder: '14_Modelo_Precios_Dinamicos',
    tags: ['Python', 'Reinforcement Learning', 'scikit-learn', 'SciPy'],
    features: [
      'Estimación de la elasticidad precio de la demanda por categoría',
      'Agente de Q-Learning / QRDQN para ajuste de tarifas en tiempo real',
      'Limitadores de seguridad para evitar caídas bruscas de precios',
      'Simulador de entorno competitivo'
    ],
    architecture: 'Scraped Competitor Prices + Inventory ---> Demand Elasticity ---> RL Agent ---> Pricing Engine',
    setup: 'python 14_Modelo_Precios_Dinamicos/src/dynamic_pricing.py'
  },
  {
    id: 15,
    number: '15',
    sector: 'E-Commerce',
    title: 'Pronóstico de Demanda de Inventario',
    status: 'planned',
    description: 'Modelado predictivo de volumen de ventas para evitar desabastecimiento o exceso de inventario en almacén.',
    folder: '15_Pronostico_Demanda_Inventario',
    tags: ['Python', 'ARIMA', 'Prophet', 'LightGBM', 'SQL'],
    features: [
      'Descomposición de estacionalidad, tendencias e impacto de días festivos',
      'Inclusión de variables exógenas (promociones, clima)',
      'Cálculo de stock de seguridad óptimo por SKU',
      'Alertas de reabastecimiento crítico'
    ],
    architecture: 'Sales History SQL ---> LightGBM TimeSeries ---> Reorder Point Engine ---> Alert Dashboard',
    setup: 'python 15_Pronostico_Demanda_Inventario/src/demand_forecast.py'
  },

  // ---------------- MARKETING ----------------
  {
    id: 16,
    number: '16',
    sector: 'Marketing',
    title: 'Análisis de Efectividad de Campañas',
    status: 'planned',
    description: 'Evaluación del retorno de inversión (ROI) y atribución multicanal de esfuerzos de marketing digital mediante modelos econométricos.',
    folder: '16_Efectividad_Campanas_Marketing',
    tags: ['Python', 'pandas', 'Matplotlib', 'Seaborn', 'SQL'],
    features: [
      'Modelos de atribución: Primer Clic, Último Clic y Markov Chains',
      'Cálculo de CPA (Costo por Adquisición) y ROAS por canal',
      'Pruebas A/B Testing y cálculo de significancia estadística (p-value)',
      'Informe dinámico interactivo'
    ],
    architecture: 'Ad Impression Logs ---> Markov Chain Attribution ---> ROI Analytics Generator',
    setup: 'python 16_Efectividad_Campanas_Marketing/src/campaign_attribution.py'
  },
  {
    id: 17,
    number: '17',
    sector: 'Marketing',
    title: 'Puntuación de Leads (Predicción de Conversión)',
    status: 'planned',
    description: 'Priorización de clientes potenciales para el equipo comercial ordenando leads según su probabilidad estimada de compra.',
    folder: '17_Puntuacion_Leads_Conversion',
    tags: ['Python', 'Regresión Logística', 'XGBoost', 'scikit-learn'],
    features: [
      'Extracción de interacciones web, descargas de recursos y actividad de email',
      'Algoritmo de scoring graduado (de 0 a 100 puntos)',
      'Clasificación por temperatura de lead (Frío, Tibio, Caliente)',
      'Webhooks de integración con CRM (HubSpot / Salesforce)'
    ],
    architecture: 'CRM Webhooks ---> Predictive Pipeline ---> Lead Score Ranker ---> CRM Sync',
    setup: 'python 17_Puntuacion_Leads_Conversion/src/lead_scoring.py'
  },
  {
    id: 18,
    number: '18',
    sector: 'Marketing',
    title: 'Predicción del Valor de Vida del Cliente (CLV)',
    status: 'planned',
    description: 'Modelado probabilístico del valor económico futuro que aportará cada usuario a lo largo de su relación con la empresa.',
    folder: '18_Valor_Vida_Cliente_CLV',
    tags: ['Python', 'Lifetimes', 'scikit-learn', 'BG/NBD Model'],
    features: [
      'Implementación del modelo BG/NBD (Beta-Geometric/Negative Binomial)',
      'Modelo Gamma-Gamma para estimar el valor medio de transacción',
      'Segmentación de clientes según su valor proyectado a 1, 3 y 5 años',
      'Simulación de presupuestos de adquisición sostenible'
    ],
    architecture: 'Transaction History ---> BG/NBD + Gamma-Gamma ---> CLV Projection Matrix',
    setup: 'python 18_Valor_Vida_Cliente_CLV/src/clv_prediction.py'
  },
  {
    id: 19,
    number: '19',
    sector: 'Marketing',
    title: 'Análisis de la Cesta de la Compra (Market Basket)',
    status: 'planned',
    description: 'Descubrimiento de asociaciones de productos comprados juntos frecuentemente para optimizar ventas cruzadas y empaquetados.',
    folder: '19_Market_Basket_Analysis',
    tags: ['Python', 'Apriori', 'FP-Growth', 'mlxtend', 'SQL'],
    features: [
      'Algoritmos FP-Growth y Apriori sobre millones de tickets de compra',
      'Cálculo de métricas clave: Soporte, Confianza y Lift',
      'Motor de sugerencias para empaquetado de productos (Bundling)',
      'Visualización en grafo de conexiones entre artículos'
    ],
    architecture: 'POS Receipts SQL ---> FP-Growth Algorithm ---> Association Rules ---> Bundle Recommendations',
    setup: 'python 19_Market_Basket_Analysis/src/market_basket.py'
  },
  {
    id: 20,
    number: '20',
    sector: 'Marketing',
    title: 'Seguimiento de Sentimiento en Redes Sociales',
    status: 'planned',
    description: 'Monitorización de reputación de marca capturando menciones en vivo en redes sociales y analizando la polaridad de la conversación.',
    folder: '20_Sentimiento_Redes_Sociales',
    tags: ['Python', 'Tweepy', 'NLTK', 'HuggingFace', 'Streamlit'],
    features: [
      'Streaming de datos de redes sociales en tiempo real',
      'Filtrado de spam y detección de idioma',
      'Alertas instantáneas ante picos de sentimiento negativo (Crisis de reputación)',
      'Dashboard en Streamlit con métricas de presencia de marca'
    ],
    architecture: 'Social Media API ---> Text Cleaner ---> Sentiment Transformer ---> Streamlit Dashboard',
    setup: 'python 20_Sentimiento_Redes_Sociales/src/social_monitor.py'
  },

  // ---------------- DEPORTES ----------------
  {
    id: 21,
    number: '21',
    sector: 'Deportes',
    title: 'Predicción de Rendimiento de Jugadores',
    status: 'planned',
    description: 'Evaluación cuantitativa y proyección de estadísticas individuales de atletas basada en métricas biométricas y de partidos anteriores.',
    folder: '21_Prediccion_Rendimiento_Jugadores',
    tags: ['Python', 'XGBoost', 'scikit-learn', 'SQL', 'Statsbomb'],
    features: [
      'Procesamiento de eventos de juego de plataformas como StatsBomb / WyScout',
      'Modelado de goles esperados (xG) y asistencias esperadas (xA)',
      'Proyección de rendimiento estacional',
      'Reporte de Scouting automatizado para directores técnicos'
    ],
    architecture: 'Match Event Data ---> Feature Engine (xG/xA) ---> Regressor ---> Scouting Report',
    setup: 'python 21_Prediccion_Rendimiento_Jugadores/src/player_performance.py'
  },
  {
    id: 22,
    number: '22',
    sector: 'Deportes',
    title: 'Pronóstico de Riesgo de Lesiones',
    status: 'planned',
    description: 'Prevención de lesiones musculares monitoreando cargas de entrenamiento (ACWR) y estado físico de los deportistas.',
    folder: '22_Pronostico_Riesgo_Lesiones',
    tags: ['Python', 'Lifelines', 'scikit-learn', 'Pandas', 'GPS Data'],
    features: [
      'Cálculo de la razón de carga de trabajo aguda:crónica (ACWR) con datos de chalecos GPS',
      'Clasificación de riesgo diario por jugador',
      'Identificación de factores gatillo de fatiga muscular',
      'Matriz de recomendación de minutos de juego'
    ],
    architecture: 'GPS Wearables Data ---> ACWR Calculator ---> Risk Predictor ---> Medical Staff Dashboard',
    setup: 'python 22_Pronostico_Riesgo_Lesiones/src/injury_risk.py'
  },
  {
    id: 23,
    number: '23',
    sector: 'Deportes',
    title: 'Predicción de Resultados de Partidos',
    status: 'planned',
    description: 'Simulador probabilístico del resultado de enfrentamientos deportivos considerando rendimiento reciente, ausencias y ventaja de localía.',
    folder: '23_Prediccion_Resultados_Partidos',
    tags: ['Python', 'Clasificación', 'XGBoost', 'Poisson', 'Elo Rating'],
    features: [
      'Cálculo dinámico de puntuaciones Elo para cada equipo',
      'Modelado de distribución de goles/puntos mediante Regresión de Poisson',
      'Simulaciones de Montecarlo del torneo completo (10,000 iteraciones)',
      'Probabilidades de mercado comparadas con casas de apuestas'
    ],
    architecture: 'Historical Fixtures ---> Elo Generator + Poisson Model ---> Montecarlo Engine ---> Match Odds',
    setup: 'python 23_Prediccion_Resultados_Partidos/src/match_predictor.py'
  },
  {
    id: 24,
    number: '24',
    sector: 'Deportes',
    title: 'Sistema de Recomendación para Ligas Fantasy',
    status: 'planned',
    description: 'Asistente inteligente que optimiza la alineación semanal y propone fichajes clave para participantes de ligas Fantasy Sports.',
    folder: '24_Recomendador_Ligas_Fantasy',
    tags: ['Python', 'Filtrado Colaborativo', 'PuLP', 'Pandas'],
    features: [
      'Optimización lineal entera (ILP) con PuLP para maximizar puntos con límite presupuestario',
      'Análisis de dificultad del calendario (Difficulty Rating)',
      'Sugerencia de cambios y transferencias más rentables',
      'Alertas de última hora por bajas de jugadores'
    ],
    architecture: 'Fantasy Stats ---> PuLP Linear Optimizer ---> Captain & XI Selector ---> Lineup Recommendation',
    setup: 'python 24_Recomendador_Ligas_Fantasy/src/fantasy_assistant.py'
  },
  {
    id: 25,
    number: '25',
    sector: 'Deportes',
    title: 'Análisis de Comportamiento de Bots en Juegos',
    status: 'planned',
    description: 'Detección de patrones de comportamiento no humano o uso de trampas (aimbots/macros) en videojuegos multijugador.',
    folder: '25_Comportamiento_Bots_Juegos',
    tags: ['Python', 'scikit-learn', 'Reinforcement Learning', 'PyTorch'],
    features: [
      'Extracción de métricas de precisión de movimiento de ratón y tiempos de reacción',
      'Detección de anomalías en telemetría de juego',
      'Clasificador de cuentas sospechosas con alta precisión',
      'Módulo anticheat preventivo'
    ],
    architecture: 'Player Telemetry ---> Feature Extractor ---> Classifier ML ---> Anti-Cheat Ban Trigger',
    setup: 'python 25_Comportamiento_Bots_Juegos/src/bot_detection.py'
  },

  // ---------------- LOGÍSTICA ----------------
  {
    id: 26,
    number: '26',
    sector: 'Logística',
    title: 'Predicción de Retraso de Vuelos',
    status: 'planned',
    description: 'Estimación de demoras en operaciones aéreas integrando datos meteorológicos, tráfico del aeropuerto y conexiones de flota.',
    folder: '26_Prediccion_Retraso_Vuelos',
    tags: ['Python', 'Random Forest', 'XGBoost', 'SQL', 'Weather API'],
    features: [
      'Cruce de datos de planes de vuelo con predicciones meteorológicas en tiempo real',
      'Predicción de minutos exactos de retraso y probabilidad de cancelación',
      'Análisis de efecto dominó en escalas aéreas',
      'Panel de control de operaciones aeroportuarias'
    ],
    architecture: 'Flight Radar API + METAR Weather ---> XGBoost Regressor ---> Flight Delay Risk Panel',
    setup: 'python 26_Prediccion_Retraso_Vuelos/src/flight_delay.py'
  },
  {
    id: 27,
    number: '27',
    sector: 'Logística',
    title: 'Predicción de Tarifas de Taxi (Uber/Lyft)',
    status: 'planned',
    description: 'Cálculo dinámico de costo estimado de trayectos urbanos teniendo en cuenta distancia, congestión vehicular y zonas de alta demanda.',
    folder: '27_Prediccion_Tarifas_Taxi',
    tags: ['Python', 'Regresión', 'XGBoost', 'Geopandas', 'OSMnx'],
    features: [
      'Cálculo de rutas óptimas con grafos viales de OpenStreetMap (OSMnx)',
      'Ingeniería de variables espaciales (coordenadas de recolección y destino)',
      'Estimación de factor de tarifa dinámica (Surge Multiplier)',
      'API REST de cotización instantánea'
    ],
    architecture: 'Trip Request Coordinates ---> Geo Distance Engine ---> XGBoost Price Estimator ---> Fare API',
    setup: 'python 27_Prediccion_Tarifas_Taxi/src/fare_estimator.py'
  },
  {
    id: 28,
    number: '28',
    sector: 'Logística',
    title: 'Optimización de Rutas de Transporte',
    status: 'planned',
    description: 'Resolución del problema de enrutamiento de vehículos con capacidad limitada (CVRP) para flotas de reparto de última milla.',
    folder: '28_Optimizacion_Rutas_Transporte',
    tags: ['Python', 'NetworkX', 'OR-Tools', 'Folium', 'Google Maps API'],
    features: [
      'Generación de matriz de distancias y tiempos entre puntos de entrega',
      'Uso de Google OR-Tools para optimización combinatorial de flotas',
      'Visualización de rutas sobre mapa interactivo con Folium',
      'Reducción calculada de huella de carbono y consumo de combustible'
    ],
    architecture: 'Delivery List ---> OR-Tools VRP Solver ---> Folium Route Map ---> Fleet Dispatch List',
    setup: 'python 28_Optimizacion_Rutas_Transporte/src/route_optimizer.py'
  },
  {
    id: 29,
    number: '29',
    sector: 'Logística',
    title: 'Demanda de Cadena de Suministro',
    status: 'planned',
    description: 'Planificación de materias primas y distribución en centros de almacenamiento para mitigar el efecto látigo (Bullwhip effect).',
    folder: '29_Demanda_Cadena_Suministro',
    tags: ['Python', 'ARIMA', 'Prophet', 'SQL', 'Statsmodels'],
    features: [
      'Modelado jerárquico de demandas por región, almacén y canal',
      'Simulación de escenarios de disrupción en proveedores',
      'Cálculo de niveles de inventario de seguridad multinivel',
      'Reporte para gerencia de operaciones'
    ],
    architecture: 'ERP Multi-Node SQL ---> Hierarchical Forecast ---> Safety Stock Allocator',
    setup: 'python 29_Demanda_Cadena_Suministro/src/supply_chain.py'
  },
  {
    id: 30,
    number: '30',
    sector: 'Logística',
    title: 'Predicción de Mantenimiento de Vehículos (IoT)',
    status: 'planned',
    description: 'Monitoreo de la salud de componentes mecánicos a partir de datos de sensores de telemetría para programar revisiones preventivas.',
    folder: '30_Mantenimiento_Predictivo_IoT',
    tags: ['Python', 'Series Temporales', 'AutoML', 'SQL', 'MQTT'],
    features: [
      'Ingesta de datos de sensores IoT (Vibración, Temperatura, Presión de aceite)',
      'Estimación de vida útil restante (RUL - Remaining Useful Life)',
      'Clasificación de fallas inminentes antes de que ocurra la avería',
      'Integración con orden de trabajo del taller de reparación'
    ],
    architecture: 'IoT Telemetry MQTT ---> TimeSeries Feature Extractor ---> RUL Predictor ---> Maintenance Order',
    setup: 'python 30_Mantenimiento_Predictivo_IoT/src/predictive_maintenance.py'
  },

  // ---------------- ENERGÍA ----------------
  {
    id: 31,
    number: '31',
    sector: 'Energía',
    title: 'Predicción de Consumo de Electricidad',
    status: 'planned',
    description: 'Pronóstico de la demanda de carga en la red eléctrica comunitaria para optimizar la generación y evitar apagones.',
    folder: '31_Prediccion_Consumo_Electricidad',
    tags: ['Python', 'Series Temporales', 'XGBoost', 'SQL', 'InfluxDB'],
    features: [
      'Modelado de consumo horario por sectores industriales y residenciales',
      'Incorporación de pronóstico de temperatura y estacionalidad climática',
      'Detección de patrones de consumo anómalo o pérdidas no técnicas',
      'Panel de control del operador del sistema eléctrico'
    ],
    architecture: 'Smart Meter Data ---> XGBoost TimeSeries ---> Load Forecast Engine ---> Grid Controller',
    setup: 'python 31_Prediccion_Consumo_Electricidad/src/grid_load_forecast.py'
  },
  {
    id: 32,
    number: '32',
    sector: 'Energía',
    title: 'Pronóstico de Producción de Energía Solar',
    status: 'planned',
    description: 'Estimación del rendimiento de parques fotovoltaicos basándose en niveles de radiación, cobertura nubosa y ángulo solar.',
    folder: '32_Pronostico_Energia_Solar',
    tags: ['Python', 'Prophet', 'LSTM', 'Pvlib', 'Open-Meteo'],
    features: [
      'Modelado físico de paneles con la librería `pvlib`',
      'Redes LSTM para estimación de generación eléctrica a 24-48 horas',
      'Evaluación del impacto del ensuciamiento o degradación de paneles',
      'Optimización de vertido a la red eléctrica'
    ],
    architecture: 'Solar Radiation Forecast + Panel Physics ---> LSTM Model ---> MW Generation Estimate',
    setup: 'python 32_Pronostico_Energia_Solar/src/solar_forecast.py'
  },
  {
    id: 33,
    number: '33',
    sector: 'Energía',
    title: 'Equilibrio de Carga en Redes Inteligentes (Smart Grids)',
    status: 'planned',
    description: 'Gestión automatizada de microredes eléctricas con baterías de almacenamiento utilizando aprendizaje por refuerzo profundo.',
    folder: '33_Smart_Grids_Equilibrio_Carga',
    tags: ['Python', 'Reinforcement Learning', 'TensorFlow', 'Gymnasium'],
    features: [
      'Creación de un entorno Gymnasium para la microred con generación renovable',
      'Agente PPO (Proximal Policy Optimization) para decisiones de carga/descarga de baterías',
      'Minimización de costos de energía y desgaste de baterías',
      'Simulación de fallos en la red principal'
    ],
    architecture: 'Grid Environment (Gym) ---> Deep RL PPO Agent ---> Battery Control Commands',
    setup: 'python 33_Smart_Grids_Equilibrio_Carga/src/smart_grid_agent.py'
  },
  {
    id: 34,
    number: '34',
    sector: 'Energía',
    title: 'Predicción de Calidad del Aire',
    status: 'planned',
    description: 'Estimación del índice de calidad del aire (ICA) y concentración de contaminantes (PM2.5, NO2, O3) en zonas urbanas.',
    folder: '34_Prediccion_Calidad_Aire',
    tags: ['Python', 'Regresión', 'LSTM', 'SQL', 'Folium'],
    features: [
      'Procesamiento de datos de estaciones de monitoreo ambiental y satelitales',
      'Predicción espacial y temporal de picos de contaminación',
      'Alertas de salud pública para grupos vulnerables',
      'Mapa de calor urbano interactivo'
    ],
    architecture: 'Environmental Sensors SQL ---> Spatial LSTM ---> AQI Calculator ---> Map Visualizer',
    setup: 'python 34_Prediccion_Calidad_Aire/src/air_quality.py'
  },
  {
    id: 35,
    number: '35',
    sector: 'Energía',
    title: 'Análisis de Impacto del Cambio Climático',
    status: 'planned',
    description: 'Estudio de tendencias históricas de temperatura y precipitación para modelar escenarios climáticos futuros a nivel regional.',
    folder: '35_Analisis_Impacto_Cambio_Climatico',
    tags: ['Python', 'pandas', 'scikit-learn', 'NetCDF4', 'Xarray', 'R'],
    features: [
      'Procesamiento de archivos climáticos en formato NetCDF / GRIB',
      'Modelos de regresión espacial para proyección de anomalías térmicas',
      'Visualización de riesgos de sequía y eventos meteorológicos extremos',
      'Informe ejecutivo de sostenibilidad'
    ],
    architecture: 'NetCDF Climate Files ---> Xarray Pipeline ---> Spatial Regression ---> Climate Dashboard',
    setup: 'python 35_Analisis_Impacto_Cambio_Climatico/src/climate_analysis.py'
  },

  // ---------------- EDUCACIÓN ----------------
  {
    id: 36,
    number: '36',
    sector: 'Educación',
    title: 'Predicción de Rendimiento Estudiantil',
    status: 'planned',
    description: 'Diagnóstico temprano de estudiantes que necesitan apoyo académico adicional evaluando patrones de estudio y entregas.',
    folder: '36_Prediccion_Rendimiento_Estudiantil',
    tags: ['Python', 'Clasificación', 'Regresión', 'scikit-learn', 'LMS Data'],
    features: [
      'Extracción de interacciones en plataformas LMS (Moodle / Canvas)',
      'Modelado del progreso en calificaciones y tiempo dedicado a tareas',
      'Identificación de factores determinantes del éxito escolar',
      'Panel para tutores y asesores educativos'
    ],
    architecture: 'LMS Activity Logs ---> Feature Extractor ---> Classification Pipeline ---> Tutor Alerts',
    setup: 'python 36_Prediccion_Rendimiento_Estudiantil/src/student_performance.py'
  },
  {
    id: 37,
    number: '37',
    sector: 'Educación',
    title: 'Recomendación de Aprendizaje Personalizado',
    status: 'planned',
    description: 'Plataforma adaptativa que sugiere lecturas, ejercicios y videos ajustados al nivel de conocimiento y estilo de aprendizaje del alumno.',
    folder: '37_Recomendacion_Aprendizaje_Personalizado',
    tags: ['Python', 'Filtrado Colaborativo', 'TensorFlow', 'Knowledge Tracing'],
    features: [
      'Modelado de la curva de conocimiento del estudiante (Knowledge Tracing)',
      'Recomendación paso a paso del siguiente mejor recurso (Next-Best-Item)',
      'Ajuste dinámico de la dificultad de los ejercicios',
      'Ruta de aprendizaje visual e interactiva'
    ],
    architecture: 'Student Quiz History ---> Knowledge Tracing Model ---> Adaptive Path Engine',
    setup: 'python 37_Recomendacion_Aprendizaje_Personalizado/src/adaptive_learning.py'
  },
  {
    id: 38,
    number: '38',
    sector: 'Educación',
    title: 'Predicción de Riesgo de Deserción Escolar',
    status: 'planned',
    description: 'Sistema de alerta temprana para evitar el abandono universitario mediante la detección de factores socioeconómicos y académicos.',
    folder: '38_Prediccion_Desercion_Escolar',
    tags: ['Python', 'Regresión Logística', 'XGBoost', 'SHAP'],
    features: [
      'Modelado probabilístico de permanencia estudiantil semestre a semestre',
      'Factores de riesgo explicables individualizados mediante SHAP',
      'Recomendación de becas o mentorías de acompañamiento',
      'Informe de gestión para bienestar universitario'
    ],
    architecture: 'Academic Records SQL ---> XGBoost Classifier ---> SHAP Explainer ---> Retention Panel',
    setup: 'python 38_Prediccion_Desercion_Escolar/src/dropout_prediction.py'
  },
  {
    id: 39,
    number: '39',
    sector: 'Educación',
    title: 'Detección de Plagio en Ensayos',
    status: 'planned',
    description: 'Comparación de similitud semántica y léxica entre entregas académicas y corpus de referencias en internet.',
    folder: '39_Deteccion_Plagio_NLP',
    tags: ['Python', 'NLP', 'Similitud del Coseno', 'NLTK', 'FAISS'],
    features: [
      'N-gramas y huellas digitales de texto (Winnowing Algorithm)',
      'Búsqueda de vectores de alta velocidad con la librería FAISS',
      'Cálculo del porcentaje de coincidencia y marcado de párrafos sospechosos',
      'Generación de reporte detallado de autenticidad'
    ],
    architecture: 'Essay PDF/TXT ---> Text Embedder ---> FAISS Vector Search ---> Plagiarism Report',
    setup: 'python 39_Deteccion_Plagio_NLP/src/plagiarism_checker.py'
  },
  {
    id: 40,
    number: '40',
    sector: 'Educación',
    title: 'Calificación Automatizada de Ensayos',
    status: 'planned',
    description: 'Evaluación objetiva y corrección gramatical y coherencia sintáctica en ensayos escritos utilizando modelos Transformers BERT.',
    folder: '40_Calificacion_Automatizada_Ensayos',
    tags: ['Python', 'NLP', 'Transformers', 'BERT', 'spaCy'],
    features: [
      'Extracción de métricas de riqueza de vocabulario y estructura discursiva',
      'Finetuning de modelo BERT en rúbricas de evaluación estandarizadas',
      'Retroalimentación textual automática con sugerencias de mejora',
      'Asistente de corrección para docentes'
    ],
    architecture: 'Student Essay ---> spaCy Feature Extraction + Fine-tuned BERT ---> Grade & Feedback',
    setup: 'python 40_Calificacion_Automatizada_Ensayos/src/essay_grader.py'
  },

  // ---------------- SOCIAL MEDIA ----------------
  {
    id: 41,
    number: '41',
    sector: 'Social Media',
    title: 'Recomendación de Videos (Estilo YouTube)',
    status: 'planned',
    description: 'Arquitectura Deep Learning de dos etapas (Candidate Generation + Ranking) para recomendar contenidos audiovisuales masivos.',
    folder: '41_Recomendacion_Videos_YouTube',
    tags: ['Python', 'Factorización de Matrices', 'TensorFlow', 'ANN', 'FAISS'],
    features: [
      'Etapa 1: Generación de candidatos con redes neuronales profundas (Two-Tower Model)',
      'Etapa 2: Red de clasificación (Ranking) considerando tiempo de reproducción estimado',
      'Filtrado de videos ya vistos y diversidad de recomendaciones',
      'API de baja latencia'
    ],
    architecture: 'User Profile + History ---> Candidate Tower ---> FAISS Index ---> Ranking Net ---> Feed API',
    setup: 'python 41_Recomendacion_Videos_YouTube/src/video_recommender.py'
  },
  {
    id: 42,
    number: '42',
    sector: 'Social Media',
    title: 'Detección de Noticias Falsas (Fake News)',
    status: 'planned',
    description: 'Clasificador automático de veracidad de artículos y noticias analizando el estilo periodístico y fuentes asociadas.',
    folder: '42_Deteccion_Fake_News',
    tags: ['Python', 'NLP', 'Transformers', 'scikit-learn', 'RoBERTa'],
    features: [
      'Detección de titulares engañosos (Clickbait Detection)',
      'Finetuning de RoBERTa para verificación de hechos (Fact-Checking)',
      'Puntuación de credibilidad de la fuente noticiosa',
      'Extensión de navegador simulada'
    ],
    architecture: 'Article URL/Text ---> RoBERTa Fact Checker ---> Credibility Score Output',
    setup: 'python 42_Deteccion_Fake_News/src/fake_news_detector.py'
  },
  {
    id: 43,
    number: '43',
    sector: 'Social Media',
    title: 'Sistema de Recomendación de Música',
    status: 'planned',
    description: 'Generador de listas de reproducción personalizadas analizando el espectrograma de audio (tempo, tono, energía) e interacciones del usuario.',
    folder: '43_Sistema_Recomendacion_Musica',
    tags: ['Python', 'Librosa', 'Filtrado Colaborativo', 'PyTorch', 'Spotify API'],
    features: [
      'Extracción de características de audio con la librería Librosa (MFCCs, Chroma)',
      'Recomendación por continuidad de estado de ánimo (Mood-based playlists)',
      'Integración con datos de la API de Spotify',
      'Reproductor interactivo de prueba'
    ],
    architecture: 'MP3 Audio Files ---> Librosa Audio Features ---> Nearest Neighbors ---> Playlist Generator',
    setup: 'python 43_Sistema_Recomendacion_Musica/src/music_recommender.py'
  },
  {
    id: 44,
    number: '44',
    sector: 'Social Media',
    title: 'Predicción de Popularidad de Memes',
    status: 'planned',
    description: 'Modelo multimodal (Texto e Imagen) para pronosticar el potencial de viralización de contenidos virales en redes sociales.',
    folder: '44_Prediccion_Popularidad_Memes',
    tags: ['Python', 'CLIP', 'Vision Transformers', 'Regresión', 'PyTorch'],
    features: [
      'Embeddings multimodales combinando imagen y texto con OpenAI CLIP',
      'Predicción del volumen de compartidos y me gusta en las primeras 24 horas',
      'Análisis de temas y formatos de meme con mayor tendencia',
      'Herramienta de optimización para creadores de contenido'
    ],
    architecture: 'Meme Image + Caption ---> CLIP Multimodal Encoder ---> Virality Predictor Regressor',
    setup: 'python 44_Prediccion_Popularidad_Memes/src/meme_virality.py'
  },
  {
    id: 45,
    number: '45',
    sector: 'Social Media',
    title: 'Pronóstico de Tendencias de Hashtags',
    status: 'planned',
    description: 'Detección temprana de temas emergentes (Trending Topics) mediante análisis de velocidad de conversación en redes sociales.',
    folder: '45_Pronostico_Tendencias_Hashtags',
    tags: ['Python', 'Series Temporales', 'NLP', 'BERTopic', 'NetworkX'],
    features: [
      'Modelado de temas dinámicos con BERTopic',
      'Análisis de la estructura del grafo de difusión de hashtags',
      'Predicción de picos de interés a 6 y 12 horas',
      'Dashboard de inteligencia de tendencias'
    ],
    architecture: 'Stream Tweets ---> BERTopic Extraction ---> TimeSeries Burst Detection ---> Trend Alert',
    setup: 'python 45_Pronostico_Tendencias_Hashtags/src/hashtag_trends.py'
  },

  // ---------------- GOBIERNO ----------------
  {
    id: 46,
    number: '46',
    sector: 'Gobierno',
    title: 'Predicción de Crímenes en Ciudades',
    status: 'planned',
    description: 'Mapeo predictivo de seguridad ciudadana para optimizar el patrullaje policial preventivo en cuadrantes urbanos.',
    folder: '46_Prediccion_Crimenes_Ciudades',
    tags: ['Python', 'Clasificación', 'Series Temporales', 'SQL', 'Geopandas'],
    features: [
      'Procesamiento de partes policiales históricos y variables espacio-temporales',
      'Predicción de densidad de incidentes por día de la semana y rango horario',
      'Visualización de zonas calientes (Hotspots) en mapas de patrullaje',
      'Reporte de asignación eficiente de recursos de seguridad'
    ],
    architecture: 'Crime Logs SQL ---> Geo Spatial Grid Engine ---> XGBoost Classifier ---> Patrol Map',
    setup: 'python 46_Prediccion_Crimenes_Ciudades/src/crime_prediction.py'
  },
  {
    id: 47,
    number: '47',
    sector: 'Gobierno',
    title: 'Detección de Puntos Críticos de Accidentes de Tráfico',
    status: 'planned',
    description: 'Identificación de tramos de alta siniestralidad vial mediante clustering espacial y análisis de infraestructura urbana.',
    folder: '47_Puntos_Criticos_Accidentes_GIS',
    tags: ['Python', 'Clustering', 'HDBSCAN', 'Geopandas', 'Folium'],
    features: [
      'Clustering de geolocalizaciones de colisiones con HDBSCAN / OPTICS',
      'Correlación con factores de infraestructura (semáforos, velocidad máxima, iluminación)',
      'Propuestas automatizadas de mejoras en señalización vial',
      'Mapa interactivo de siniestralidad para el ministerio de transporte'
    ],
    architecture: 'Accident GPS Coordinates ---> HDBSCAN Clusterer ---> Infrastructure Analyzer ---> GIS Map',
    setup: 'python 47_Puntos_Criticos_Accidentes_GIS/src/blackspots_detection.py'
  },
  {
    id: 48,
    number: '48',
    sector: 'Gobierno',
    title: 'Optimización Energética para Ciudades Inteligentes',
    status: 'planned',
    description: 'Reducción del consumo de alumbrado público y gestión eficiente de edificios municipales utilizando IoT y control predictivo.',
    folder: '48_Optimizacion_Ciudades_Inteligentes',
    tags: ['Python', 'Reinforcement Learning', 'Optimización', 'SciPy'],
    features: [
      'Ajuste automático de la intensidad de luminarias según tráfico peatonal y vehicular',
      'Estimación de ahorro presupuestario y reducción de emisiones de CO2',
      'Integración con plataformas de gestión Smart City',
      'Simulador de consumo eléctrico municipal'
    ],
    architecture: 'Traffic + Light Sensors ---> SciPy Optimizer ---> Lighting Dimming Commands',
    setup: 'python 48_Optimizacion_Ciudades_Inteligentes/src/smart_city_energy.py'
  },
  {
    id: 49,
    number: '49',
    sector: 'Gobierno',
    title: 'Predicción de Respuesta a Desastres (Inundaciones)',
    status: 'planned',
    description: 'Sistema de alerta temprana y delimitación de zonas de riesgo de inundación mediante procesamiento de imágenes satelitales y datos hidrológicos.',
    folder: '49_Prediccion_Desastres_Inundaciones',
    tags: ['Python', 'LSTM', 'CNN', 'Imágenes Satelitales', 'OpenCV'],
    features: [
      'Procesamiento de imágenes de radar Sentinel-1 para mapear láminas de agua',
      'Redes LSTM para pronóstico de caudales de ríos a partir de precipitación',
      'Generación de mapas de evacuación preventiva para defensa civil',
      'Visualizador de impacto ambiental'
    ],
    architecture: 'Satellite Radar + River Gauges ---> CNN & LSTM Models ---> Evacuation Zone Map',
    setup: 'python 49_Prediccion_Desastres_Inundaciones/src/flood_prediction.py'
  },
  {
    id: 50,
    number: '50',
    sector: 'Gobierno',
    title: 'Predicción de Resultados Electorales',
    status: 'planned',
    description: 'Agregación de encuestas, análisis de sentimiento político en redes y modelos demográficos para proyectar escenarios de elección popular.',
    folder: '50_Prediccion_Resultados_Electorales',
    tags: ['Python', 'NLP', 'Clasificación', 'Series Temporales', 'MCMC', 'PyMC'],
    features: [
      'Ponderación bayesiana de encuestas según histórico de precisión de encuestadoras',
      'Simulaciones de Montecarlo mediante cadenas de Markov (MCMC)',
      'Modelado de distribución de escaños en parlamentos/congresos',
      'Dashboard electoral interactivo con mapas de intención de voto'
    ],
    architecture: 'Poll Aggregator + Demographics ---> PyMC Bayesian Engine ---> Montecarlo Seats Simulator',
    setup: 'python 50_Prediccion_Resultados_Electorales/src/election_forecast.py'
  }
];

if (typeof window !== 'undefined') {
  window.SECTORS = SECTORS;
  window.PROJECTS = PROJECTS;
}
