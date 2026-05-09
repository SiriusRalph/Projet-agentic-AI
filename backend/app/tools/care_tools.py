from langchain_core.tools import tool


@tool
def recommend_interim_care(symptoms_summary: str) -> str:
    """
    Tool that generates a preliminary interim care recommendation
    based on the patient's symptoms. This is NOT a medical diagnosis.
    It provides general guidance only such as rest, hydration, monitoring.
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