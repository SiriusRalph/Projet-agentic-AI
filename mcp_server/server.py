from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="MCP Medical Tools Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "server": "MCP Medical Tools"}


@app.post("/tools/recommend_interim_care")
def recommend_interim_care(body: dict):
    symptoms_summary = body.get("symptoms_summary", "")
    result = f"""
    ⚠️ Ce système ne remplace pas une consultation médicale.
    
    Recommandation intermédiaire basée sur : {symptoms_summary}
    
    Conseils généraux en attendant la revue médicale :
    - Repos recommandé
    - Hydratation suffisante
    - Surveiller l'évolution des symptômes
    - Consulter rapidement en cas d'aggravation
    - Ne pas automédication sans avis médical
    """
    return {"result": result}


@app.post("/tools/get_red_flags")
def get_red_flags(body: dict):
    symptoms = body.get("symptoms", "")
    red_flags = [
        "difficulté à respirer",
        "douleur thoracique",
        "confusion",
        "perte de conscience",
        "convulsions",
        "saignement important",
        "paralysie",
        "fièvre très élevée"
    ]
    found_flags = [f for f in red_flags if f.lower() in symptoms.lower()]

    if found_flags:
        result = f"""
        🚨 SIGNES D'ALARME DÉTECTÉS : {', '.join(found_flags)}
        ⚠️ Consultation médicale URGENTE recommandée.
        Appelez le 15 (SAMU) ou rendez-vous aux urgences.
        """
    else:
        result = """
        ✅ Aucun signe d'alarme immédiat détecté.
        Surveillance recommandée et consultation si aggravation.
        """
    return {"result": result}


if __name__ == "__main__":
    print("MCP Medical Tools Server running on http://127.0.0.1:8001")
    uvicorn.run(app, host="127.0.0.1", port=8001)