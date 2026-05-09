# Replace this line at the top of api.py:
from app.graph import graph

# With this:
from app.nodes.supervisor import supervisor_node
from app.nodes.diagnostic_agent import diagnostic_agent_node
from app.nodes.physician_review import physician_review_node
from app.nodes.report_agent import report_agent_node
from app.graph import create_graph

# Then add this line right after:
graph = create_graph(use_checkpointer=True)