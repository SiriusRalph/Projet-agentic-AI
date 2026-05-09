import httpx
from langchain_core.tools import tool


MCP_SERVER_URL = "http://127.0.0.1:8001"


@tool
def mcp_recommend_interim_care(symptoms_summary: str) -> str:
    """
    Calls the MCP server to get an interim care recommendation
    based on the patient's symptoms.
    """
    try:
        response = httpx.post(
            f"{MCP_SERVER_URL}/tools/recommend_interim_care",
            json={"symptoms_summary": symptoms_summary},
            timeout=10.0
        )
        if response.status_code == 200:
            return response.json().get("result", "")
        else:
            # Fallback if MCP server is unavailable
            return recommend_interim_care_fallback(symptoms_summary)
    except Exception:
        return recommend_interim_care_fallback(symptoms_summary)


@tool
def mcp_get_red_flags(symptoms: str) -> str:
    """
    Calls the MCP server to check for red flag symptoms.
    """
    try:
        response = httpx.post(
            f"{MCP_SERVER_URL}/tools/get_red_flags",
            json={"symptoms": symptoms},
            timeout=10.0
        )
        if response.status_code == 200:
            return response.json().get("result", "")
        else:
            return "Impossible de vérifier les signes d'alarme pour le moment."
    except Exception:
        return "Impossible de vérifier les signes d'alarme pour le moment."


def recommend_interim_care_fallback(symptoms_summary: str) -> str:
    """Fallback if MCP server is unavailable"""
    return f"""
    ⚠️ Ce système ne remplace pas une consultation médicale.
    
    Recommandation intermédiaire basée sur : {symptoms_summary}
    
    Conseils généraux :
    - Repos recommandé
    - Hydratation suffisante  
    - Surveiller l'évolution des symptômes
    - Consulter rapidement en cas d'aggravation
    """