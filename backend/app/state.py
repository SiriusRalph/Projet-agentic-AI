from typing import Annotated, Literal
from typing_extensions import TypedDict
from langgraph.graph.message import add_messages


class MedicalState(TypedDict, total=False):
    # All messages exchanged in the conversation
    messages: Annotated[list, add_messages]
    
    # Which node should run next
    next: Literal[
        "diagnostic_agent",
        "physician_review",
        "report_agent",
        "FINISH"
    ]
    
    # How many questions have been asked to the patient
    question_count: int
    
    # The preliminary clinical summary produced by DiagnosticAgent
    diagnostic_summary: str
    
    # The intermediate care recommendation
    interim_care: str
    
    # The doctor's treatment decision (human-in-the-loop)
    physician_treatment: str
    
    # The final report produced by ReportAgent
    final_report: str
    
    # The patient's initial case description
    patient_case: str
    
    # All patient answers stored here
    patient_answers: list