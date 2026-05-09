from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, AIMessage
from app.state import MedicalState
from app.tools.patient_tools import ask_patient
from app.tools.mcp_client import mcp_recommend_interim_care

DIAGNOSTIC_QUESTIONS = [
    "Quels sont vos symptômes principaux en ce moment ?",
    "Depuis combien de temps avez-vous ces symptômes ?",
    "Avez-vous de la fièvre ou des frissons ?",
    "Avez-vous des antécédents médicaux ou des allergies connues ?",
    "Prenez-vous actuellement des médicaments ?"
]


def diagnostic_agent_node(state: MedicalState) -> MedicalState:
    question_count = state.get("question_count", 0)
    patient_answers = state.get("patient_answers", [])
    messages = state.get("messages", [])

    # Still have questions to ask — ask ONE question then stop
    if question_count < 5:
        question = DIAGNOSTIC_QUESTIONS[question_count]
        ask_patient.invoke({"question": question})

        return {
            "messages": messages + [AIMessage(content=question)],
            "question_count": question_count,
            "patient_answers": patient_answers,
            "next": "FINISH"  # Stop and wait for patient answer via API
        }

    # All 5 answers collected — produce clinical summary
    llm = ChatOllama(model="llama3.2", temperature=0)

    answers_text = "\n".join([
        f"Q{i+1}: {DIAGNOSTIC_QUESTIONS[i]}\nR: {patient_answers[i]}"
        for i in range(min(5, len(patient_answers)))
    ])

    prompt = f"""Tu es un assistant médical académique. 
    
Voici les réponses d'un patient :

{answers_text}

Produis une synthèse clinique préliminaire courte et prudente.
Rappelle toujours que ce système ne remplace pas une consultation médicale.
Ne pose pas de diagnostic définitif."""

    response = llm.invoke([HumanMessage(content=prompt)])
    diagnostic_summary = response.content

    interim_care = mcp_recommend_interim_care.invoke({
    "symptoms_summary": patient_answers[0] if patient_answers else "symptômes non précisés"
})

    return {
        "messages": messages + [AIMessage(content=diagnostic_summary)],
        "diagnostic_summary": diagnostic_summary,
        "interim_care": interim_care,
        "question_count": 5,
        "next": "FINISH"
    }