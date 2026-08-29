#!/usr/bin/env python3
"""
Hub CLI - 50 Proyectos de Ciencia de Datos & Analítica Cuantitativa
Gestión en línea de comandos de proyectos, exploración e inicialización automatizada.
"""

import os
import sys
import argparse
import http.server
import socketserver
import webbrowser

PROJECTS = [
    {"num": "01", "name": "Diagnóstico Predictivo Oncológico (Full-Stack)", "sector": "Salud", "folder": "01_Prediccion_Enfermedades"},
    {"num": "02", "name": "Clasificación de Imágenes Médicas", "sector": "Salud", "folder": "02_Clasificacion_Imagenes_Medicas"},
    {"num": "03", "name": "Sistema de Recomendación de Medicamentos", "sector": "Salud", "folder": "03_Sistema_Recomendacion_Medicamentos"},
    {"num": "04", "name": "Predicción de Riesgo de Reingreso", "sector": "Salud", "folder": "04_Prediccion_Riesgo_Reingreso"},
    {"num": "05", "name": "Análisis de Supervivencia al Cáncer", "sector": "Salud", "folder": "05_Analisis_Supervivencia_Cancer"},

    {"num": "06", "name": "Modelo de Puntuación Crediticia", "sector": "Finanzas", "folder": "06_Puntuacion_Crediticia_Finanzas"},
    {"num": "07", "name": "Detección de Fraude en Transacciones", "sector": "Finanzas", "folder": "07_Deteccion_Fraude_Transacciones"},
    {"num": "08", "name": "Pronóstico de Precios Mercado de Valores", "sector": "Finanzas", "folder": "08_Pronostico_Mercado_Valores"},
    {"num": "09", "name": "Segmentación de Clientes de Préstamos", "sector": "Finanzas", "folder": "09_Segmentacion_Clientes_Prestamos"},
    {"num": "10", "name": "Optimización de Riesgo y Portafolio", "sector": "Finanzas", "folder": "10_Optimizacion_Riesgo_Portafolio"},

    {"num": "11", "name": "Sistema Recomendador E-Commerce", "sector": "E-Commerce", "folder": "11_Recomendador_Ecommerce_Amazon"},
    {"num": "12", "name": "Predicción de Abandono de Clientes (Churn)", "sector": "E-Commerce", "folder": "12_Prediccion_Churn_Ecommerce"},
    {"num": "13", "name": "Análisis de Sentimiento en Reseñas", "sector": "E-Commerce", "folder": "13_Analisis_Sentimiento_Resenas"},
    {"num": "14", "name": "Modelo de Precios Dinámicos", "sector": "E-Commerce", "folder": "14_Modelo_Precios_Dinamicos"},
    {"num": "15", "name": "Pronóstico de Demanda de Inventario", "sector": "E-Commerce", "folder": "15_Pronostico_Demanda_Inventario"},

    {"num": "16", "name": "Análisis de Efectividad de Campañas", "sector": "Marketing", "folder": "16_Efectividad_Campanas_Marketing"},
    {"num": "17", "name": "Puntuación de Leads (Conversión)", "sector": "Marketing", "folder": "17_Puntuacion_Leads_Conversion"},
    {"num": "18", "name": "Predicción del Valor de Vida del Cliente (CLV)", "sector": "Marketing", "folder": "18_Valor_Vida_Cliente_CLV"},
    {"num": "19", "name": "Análisis Cesta de la Compra", "sector": "Marketing", "folder": "19_Market_Basket_Analysis"},
    {"num": "20", "name": "Seguimiento Sentimiento Redes Sociales", "sector": "Marketing", "folder": "20_Sentimiento_Redes_Sociales"},

    {"num": "21", "name": "Predicción Rendimiento Jugadores", "sector": "Deportes", "folder": "21_Prediccion_Rendimiento_Jugadores"},
    {"num": "22", "name": "Pronóstico Riesgo de Lesiones", "sector": "Deportes", "folder": "22_Pronostico_Riesgo_Lesiones"},
    {"num": "23", "name": "Predicción Resultados Partidos", "sector": "Deportes", "folder": "23_Prediccion_Resultados_Partidos"},
    {"num": "24", "name": "Recomendador Ligas Fantasy", "sector": "Deportes", "folder": "24_Recomendador_Ligas_Fantasy"},
    {"num": "25", "name": "Análisis Comportamiento Bots Juegos", "sector": "Deportes", "folder": "25_Comportamiento_Bots_Juegos"},

    {"num": "26", "name": "Predicción Retraso de Vuelos", "sector": "Logística", "folder": "26_Prediccion_Retraso_Vuelos"},
    {"num": "27", "name": "Predicción Tarifas Taxi", "sector": "Logística", "folder": "27_Prediccion_Tarifas_Taxi"},
    {"num": "28", "name": "Optimización Rutas Transporte", "sector": "Logística", "folder": "28_Optimizacion_Rutas_Transporte"},
    {"num": "29", "name": "Demanda Cadena de Suministro", "sector": "Logística", "folder": "29_Demanda_Cadena_Suministro"},
    {"num": "30", "name": "Predicción Mantenimiento IoT", "sector": "Logística", "folder": "30_Mantenimiento_Predictivo_IoT"},

    {"num": "31", "name": "Predicción Consumo Electricidad", "sector": "Energía", "folder": "31_Prediccion_Consumo_Electricidad"},
    {"num": "32", "name": "Pronóstico Producción Energía Solar", "sector": "Energía", "folder": "32_Pronostico_Energia_Solar"},
    {"num": "33", "name": "Smart Grids Equilibrio Carga", "sector": "Energía", "folder": "33_Smart_Grids_Equilibrio_Carga"},
    {"num": "34", "name": "Predicción Calidad del Aire", "sector": "Energía", "folder": "34_Prediccion_Calidad_Aire"},
    {"num": "35", "name": "Impacto Cambio Climático", "sector": "Energía", "folder": "35_Analisis_Impacto_Cambio_Climatico"},

    {"num": "36", "name": "Predicción Rendimiento Estudiantil", "sector": "Educación", "folder": "36_Prediccion_Rendimiento_Estudiantil"},
    {"num": "37", "name": "Recomendación Aprendizaje Personalizado", "sector": "Educación", "folder": "37_Recomendacion_Aprendizaje_Personalizado"},
    {"num": "38", "name": "Predicción Riesgo Deserción Escolar", "sector": "Educación", "folder": "38_Prediccion_Desercion_Escolar"},
    {"num": "39", "name": "Detección Plagio en Ensayos", "sector": "Educación", "folder": "39_Deteccion_Plagio_NLP"},
    {"num": "40", "name": "Calificación Automatizada Ensayos", "sector": "Educación", "folder": "40_Calificacion_Automatizada_Ensayos"},

    {"num": "41", "name": "Recomendación Videos Estilo YouTube", "sector": "Social Media", "folder": "41_Recomendacion_Videos_YouTube"},
    {"num": "42", "name": "Detección Fake News", "sector": "Social Media", "folder": "42_Deteccion_Fake_News"},
    {"num": "43", "name": "Sistema Recomendación Música", "sector": "Social Media", "folder": "43_Sistema_Recomendacion_Musica"},
    {"num": "44", "name": "Predicción Popularidad Memes", "sector": "Social Media", "folder": "44_Prediccion_Popularidad_Memes"},
    {"num": "45", "name": "Pronóstico Tendencias Hashtags", "sector": "Social Media", "folder": "45_Pronostico_Tendencias_Hashtags"},

    {"num": "46", "name": "Predicción Crímenes en Ciudades", "sector": "Gobierno", "folder": "46_Prediccion_Crimenes_Ciudades"},
    {"num": "47", "name": "Puntos Críticos Accidentes Tráfico", "sector": "Gobierno", "folder": "47_Puntos_Criticos_Accidentes_GIS"},
    {"num": "48", "name": "Optimización Energética Smart Cities", "sector": "Gobierno", "folder": "48_Optimizacion_Ciudades_Inteligentes"},
    {"num": "49", "name": "Predicción Respuesta a Desastres", "sector": "Gobierno", "folder": "49_Prediccion_Desastres_Inundaciones"},
    {"num": "50", "name": "Predicción Resultados Electorales", "sector": "Gobierno", "folder": "50_Prediccion_Resultados_Electorales"}
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_status_str(folder_name):
    folder_path = os.path.join(BASE_DIR, folder_name)
    if os.path.exists(folder_path):
        readme_path = os.path.join(folder_path, "README.md")
        if os.path.exists(readme_path):
            return "\033[92m[COMPLETADO]\033[0m"
        return "\033[93m[EN DESARROLLO]\033[0m"
    return "\033[90m[PLANIFICADO]\033[0m"

def list_projects(sector_filter=None):
    print("\n\033[1;36m===============================================================\033[0m")
    print("\033[1;37m   PORTAFOLIO EJECUTIVO: 50 SOLUCIONES DE CIENCIA DE DATOS    \033[0m")
    print("\033[1;36m===============================================================\033[0m\n")

    created_count = 0
    total_count = 0

    for p in PROJECTS:
        if sector_filter and p["sector"].lower() != sector_filter.lower():
            continue

        status = get_status_str(p["folder"])
        if "COMPLETADO" in status or "DESARROLLO" in status:
            created_count += 1
        total_count += 1

        print(f"\033[1;33m#{p['num']}\033[0m \033[1;35m[{p['sector']}]\033[0m {p['name']:<48} {status}")

    print("\n\033[1;36m---------------------------------------------------------------\033[0m")
    print(f"\033[1;37mResumen: {created_count} proyectos iniciados de {total_count} mostrados.\033[0m\n")

def init_project_folder(project_num):
    target = next((p for p in PROJECTS if p["num"] == str(project_num).zfill(2)), None)
    if not target:
        print(f"\033[91mError: No se encontró el registro número {project_num}\033[0m")
        return

    folder_path = os.path.join(BASE_DIR, target["folder"])
    subdirs = ["src", "api", "models", "data", "frontend"]

    print(f"\n\033[1;34mInicializando directorio para registro #{target['num']}: {target['name']}...\033[0m")
    os.makedirs(folder_path, exist_ok=True)

    for sd in subdirs:
        os.makedirs(os.path.join(folder_path, sd), exist_ok=True)

    readme_path = os.path.join(folder_path, "README.md")
    if not os.path.exists(readme_path):
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(f"# Proyecto #{target['num']}: {target['name']}\n\n")
            f.write(f"**Sector Industrial:** {target['sector']}\n\n")
            f.write("## Resumen Ejecutivo\nEspecificación técnica y modelos predictivos.\n\n")
            f.write("## Estructura de Directorios\n")
            f.write("- `src/`: Algoritmos y pipelines ML/DL\n")
            f.write("- `api/`: Servicios REST & FastAPI\n")
            f.write("- `models/`: Artefactos entrenados (.joblib, .pth)\n")
            f.write("- `data/`: Datasets locales\n")
            f.write("- `frontend/`: Interfaz de usuario\n")

    req_path = os.path.join(folder_path, "requirements.txt")
    if not os.path.exists(req_path):
        with open(req_path, "w", encoding="utf-8") as f:
            f.write("pandas\nnumpy\nscikit-learn\nmatplotlib\nfastapi\n")

    print(f"\033[92mDirectorio creado en ./{target['folder']}\033[0m\n")

def serve_hub(port=8000):
    os.chdir(BASE_DIR)
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}/index.html"
        print(f"\n\033[1;92mServidor iniciado en: {url}\033[0m")
        print("\033[90mPresiona Ctrl+C para detener el servidor.\033[0m\n")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\033[1;33mServidor detenido.\033[0m")

def main():
    parser = argparse.ArgumentParser(description="CLI del Portafolio Ejecutivo de Ciencia de Datos")
    parser.add_argument("-l", "--list", action="store_true", help="Listar proyectos en consola")
    parser.add_argument("-s", "--sector", type=str, help="Filtrar por sector industrial")
    parser.add_argument("-i", "--init", type=int, help="Inicializar estructura de carpetas por número (1 a 50)")
    parser.add_argument("--serve", action="store_true", help="Iniciar servidor web local")

    args = parser.parse_args()

    if args.serve:
        serve_hub()
    elif args.init:
        init_project_folder(args.init)
    elif args.list or args.sector:
        list_projects(args.sector)
    else:
        list_projects()
        print("\033[90mOpciones rápidas:\033[0m")
        print("  python3 hub.py --serve          -> Iniciar servidor web")
        print("  python3 hub.py --init 5         -> Inicializar proyecto #5")
        print("  python3 hub.py --sector Salud   -> Filtrar sector Salud\n")

if __name__ == "__main__":
    main()
