from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage
from app.state import MedicalState


def report_agent_node(state: MedicalState) -> MedicalState:
    """
    Report Agent:
    Generates the final structured clinical report
    combining the diagnostic summary, interim care,
    and the physician's treatment decision.
    """
    llm = ChatOllama(model="llama3.2", temperature=0)

    patient_case = state.get("patient_case", "Non précisé")
    diagnostic_summary = state.get("diagnostic_summary", "")
    interim_care = state.get("interim_care", "")
    physician_treatment = state.get("physician_treatment", "")
    messages = state.get("messages", [])

    prompt = f"""Tu es un assistant médical académique.
    
Génère un rapport médical final structuré basé sur ces informations :

Cas patient : {patient_case}
Synthèse clinique : {diagnostic_summary}
Recommandation intermédiaire : {interim_care}
Traitement proposé par le médecin : {physician_treatment}

Le rapport doit contenir :
1. Résumé du cas patient
2. Synthèse clinique préliminaire
3. Recommandation intermédiaire
4. Traitement / Conduite à tenir (médecin)
5. Conclusion

Termine TOUJOURS par : "Ce système ne remplace pas une consultation médicale."
"""

    response = llm.invoke([HumanMessage(content=prompt)])
    final_report = response.content

    return {
        "messages": messages + [AIMessage(content=final_report)],
        "final_report": final_report,
        "next": "FINISH"
    }