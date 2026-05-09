from app.state import MedicalState
from langchain_core.messages import HumanMessage


def physician_review_node(state: MedicalState) -> MedicalState:
    """
    Human-in-the-Loop node.
    The workflow pauses here and waits for the doctor to provide
    their treatment decision before continuing.
    This node is interrupted by LangGraph — the doctor's input
    comes via the API resume endpoint.
    """
    diagnostic_summary = state.get("diagnostic_summary", "")
    interim_care = state.get("interim_care", "")
    messages = state.get("messages", [])

    # Build the review prompt for the doctor
    review_message = f"""
    👨‍⚕️ REVUE MÉDECIN REQUISE
    
    Synthèse clinique préliminaire :
    {diagnostic_summary}
    
    Recommandation intermédiaire :
    {interim_care}
    
    ⚠️ Ce système ne remplace pas une consultation médicale.
    En tant que médecin traitant, veuillez proposer un traitement
    ou une conduite à tenir.
    """

    return {
        "messages": messages + [HumanMessage(content=review_message)],
        "next": "report_agent"
    }