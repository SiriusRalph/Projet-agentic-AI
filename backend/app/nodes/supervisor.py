from app.state import MedicalState


def supervisor_node(state: MedicalState) -> MedicalState:
    """
    Supervisor orchestrates the workflow.
    It decides which agent runs next based on the current state.
    """
    question_count = state.get("question_count", 0)
    diagnostic_summary = state.get("diagnostic_summary", "")
    physician_treatment = state.get("physician_treatment", "")

    # If diagnostic is not done yet (less than 5 questions answered)
    if question_count < 5 or not diagnostic_summary:
        return {"next": "diagnostic_agent"}

    # If doctor hasn't reviewed yet
    if not physician_treatment:
        return {"next": "physician_review"}

    # If doctor reviewed, generate final report
    if physician_treatment and not state.get("final_report", ""):
        return {"next": "report_agent"}

    # Everything is done
    return {"next": "FINISH"}