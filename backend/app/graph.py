import os
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from app.state import MedicalState
from app.nodes.supervisor import supervisor_node
from app.nodes.diagnostic_agent import diagnostic_agent_node
from app.nodes.physician_review import physician_review_node
from app.nodes.report_agent import report_agent_node


def create_graph(use_checkpointer=True):
    builder = StateGraph(MedicalState)

    builder.add_node("supervisor", supervisor_node)
    builder.add_node("diagnostic_agent", diagnostic_agent_node)
    builder.add_node("physician_review", physician_review_node)
    builder.add_node("report_agent", report_agent_node)

    builder.set_entry_point("supervisor")

    builder.add_conditional_edges(
        "supervisor",
        lambda state: state.get("next", "diagnostic_agent"),
        {
            "diagnostic_agent": "diagnostic_agent",
            "physician_review": "physician_review",
            "report_agent": "report_agent",
            "FINISH": END
        }
    )

    builder.add_edge("diagnostic_agent", END)
    builder.add_edge("physician_review", END)
    builder.add_edge("report_agent", END)

    # Only use MemorySaver when running via FastAPI
    # LangGraph Studio handles its own persistence
    if use_checkpointer:
        memory = MemorySaver()
        return builder.compile(checkpointer=memory)
    else:
        return builder.compile()


# LangGraph Studio uses this — no checkpointer
graph = create_graph(use_checkpointer=False)