from langchain_core.tools import tool
from typing import Any


@tool
def ask_patient(question: str) -> str:
    """
    Tool used by the Diagnostic Agent to ask a question to the patient.
    Returns the question so it can be displayed to the patient.
    """
    return question


@tool  
def record_patient_answer(answer: str) -> str:
    """
    Tool used to record the patient's answer in the workflow.
    """
    return answer