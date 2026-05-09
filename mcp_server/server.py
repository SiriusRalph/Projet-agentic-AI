from mcp.server.fastmcp import FastMCP

# Create the MCP server
mcp = FastMCP("Medical Tools Server")


@mcp.tool()
def recommend_interim_care(symptoms_summary: str) -> str:
    """
    Generates a preliminary interim care recommendation
    based on the patient's symptoms.
    This is NOT a medical diagnosis.
    """
    return f"""
    ⚠️ Ce système ne remplace pas une consultation médicale.
    
    Recommandation intermédiaire basée sur : {symptoms_summary}
    
    Conseils généraux en attendant la revue médicale :
    - Repos recommandé
    - Hydratation suffisante
    - Surveiller l'évolution des symptômes
    - Consulter rapidement en cas d'aggravation
    - Ne pas automédication sans avis médical
    """


@mcp.tool()
def get_red_flags(symptoms: str) -> str:
    """
    Checks for red flag symptoms that require immediate medical attention.
    """
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

    found_flags = [
        flag for flag in red_flags
        if flag.lower() in symptoms.lower()
    ]

    if found_flags:
        return f"""
        🚨 SIGNES D'ALARME DÉTECTÉS : {', '.join(found_flags)}
        
        ⚠️ Consultation médicale URGENTE recommandée.
        Ces symptômes nécessitent une attention médicale immédiate.
        Appelez le 15 (SAMU) ou rendez-vous aux urgences.
        """
    else:
        return """
        ✅ Aucun signe d'alarme immédiat détecté.
        Surveillance recommandée et consultation si aggravation.
        """


if __name__ == "__main__":
    import uvicorn
    print("MCP Server running on http://127.0.0.1:8001")
    uvicorn.run(mcp.sse_app(), host="127.0.0.1", port=8001)