from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uuid
from langchain_core.messages import HumanMessage, AIMessage
from app.graph import create_graph

app = FastAPI(title="Medical Multi-Agent API")
graph = create_graph(use_checkpointer=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartConsultationRequest(BaseModel):
    patient_case: str

class PatientAnswerRequest(BaseModel):
    thread_id: str
    answer: str

class PhysicianReviewRequest(BaseModel):
    thread_id: str
    physician_treatment: str


@app.post("/sessions/start")
def start_session():
    thread_id = str(uuid.uuid4())
    return {"thread_id": thread_id}


@app.post("/consultation/start")
def start_consultation(request: StartConsultationRequest):
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = {
        "patient_case": request.patient_case,
        "messages": [HumanMessage(content=request.patient_case)],
        "question_count": 0,
        "patient_answers": [],
        "next": "diagnostic_agent"
    }

    result = graph.invoke(initial_state, config=config)
    last_message = result["messages"][-1].content if result.get("messages") else ""

    return {
        "thread_id": thread_id,
        "status": "in_progress",
        "question_count": result.get("question_count", 0),
        "message": last_message
    }


@app.post("/consultation/resume")
def resume_consultation(request: PatientAnswerRequest):
    config = {"configurable": {"thread_id": request.thread_id}}

    current = graph.get_state(config)
    if not current:
        raise HTTPException(status_code=404, detail="Session not found")

    values = current.values
    question_count = values.get("question_count", 0)
    patient_answers = values.get("patient_answers", [])
    messages = values.get("messages", [])

    updated_answers = patient_answers + [request.answer]
    updated_count = question_count + 1

    graph.update_state(config, {
        "patient_answers": updated_answers,
        "question_count": updated_count,
        "messages": messages + [HumanMessage(content=request.answer)],
        "next": "diagnostic_agent"
    }, as_node="supervisor")

    result = graph.invoke(None, config=config)

    last_message = result["messages"][-1].content if result.get("messages") else ""
    diagnostic_summary = result.get("diagnostic_summary", "")
    interim_care = result.get("interim_care", "")

    if diagnostic_summary:
        status = "waiting_physician"
    else:
        status = "in_progress"

    return {
        "thread_id": request.thread_id,
        "status": status,
        "question_count": result.get("question_count", updated_count),
        "message": last_message,
        "diagnostic_summary": diagnostic_summary,
        "interim_care": interim_care
    }


@app.post("/consultation/physician")
def physician_review(request: PhysicianReviewRequest):
    config = {"configurable": {"thread_id": request.thread_id}}

    current = graph.get_state(config)
    if not current:
        raise HTTPException(status_code=404, detail="Session not found")

    values = current.values
    messages = values.get("messages", [])

    graph.update_state(config, {
        "physician_treatment": request.physician_treatment,
        "messages": messages + [HumanMessage(content=request.physician_treatment)],
        "next": "report_agent"
    }, as_node="supervisor")

    result = graph.invoke(None, config=config)

    return {
        "thread_id": request.thread_id,
        "status": "completed",
        "final_report": result.get("final_report", "")
    }


@app.get("/consultation/{thread_id}")
def get_consultation(thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    current = graph.get_state(config)

    if not current:
        raise HTTPException(status_code=404, detail="Session not found")

    values = current.values
    return {
        "thread_id": thread_id,
        "question_count": values.get("question_count", 0),
        "diagnostic_summary": values.get("diagnostic_summary", ""),
        "interim_care": values.get("interim_care", ""),
        "physician_treatment": values.get("physician_treatment", ""),
        "final_report": values.get("final_report", ""),
        "next": values.get("next", "")
    }


@app.get("/consultation/{thread_id}/report")
def get_report(thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    current = graph.get_state(config)

    if not current:
        raise HTTPException(status_code=404, detail="Session not found")

    final_report = current.values.get("final_report", "")
    if not final_report:
        raise HTTPException(status_code=404, detail="Report not ready yet")

    return {
        "thread_id": thread_id,
        "final_report": final_report
    }