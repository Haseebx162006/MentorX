from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, START, END
from app.config.settings import settings

# Use consistent imports based on your app structure
from app.Pipeline.State import State
from app.Pipeline.eval_node import eval_node
from app.Pipeline.refine import refine
from app.Pipeline.web_node import rewrite_query_node, web_search_node
from app.Pipeline.combine_docs_node import combine_docs_node
from app.Pipeline.generate_node import generate_node
from app.Pipeline.retrieve_node import retrieve_node
from app.Pipeline.route import route_decision

# Checkpointer instances
_active_checkpointer = None


def get_checkpointer():
    """
    Initializes PostgreSQL PostgresSaver checkpointer using DATABASE_URL.
    Creates checkpoint tables in PostgreSQL for short-term thread state.
    Gracefully falls back to MemorySaver if PostgreSQL is unreachable.
    """
    global _active_checkpointer
    if _active_checkpointer is not None:
        return _active_checkpointer

    db_url = settings.get_database_url()
    if db_url:
        try:
            # Normalize URL dialect for psycopg3
            if db_url.startswith("postgres://"):
                db_url = db_url.replace("postgres://", "postgresql://", 1)

            from psycopg_pool import ConnectionPool
            from langgraph.checkpoint.postgres import PostgresSaver

            pool = ConnectionPool(conninfo=db_url, max_size=10, kwargs={"autocommit": True})
            checkpointer = PostgresSaver(pool)
            checkpointer.setup()
            _active_checkpointer = checkpointer
            print("PostgresSaver checkpointer initialized for LangGraph workflow.")
            return _active_checkpointer
        except Exception as e:
            print(f"Notice: PostgresSaver initialization notice: {e}. Falling back to MemorySaver.")

    from langgraph.checkpoint.memory import MemorySaver
    _active_checkpointer = MemorySaver()
    return _active_checkpointer


def build_workflow(checkpointer: Optional[Any] = None):
    workflow = StateGraph(State)

    # 1. Register all nodes
    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("evaluate", eval_node)
    workflow.add_node("refine", refine)
    workflow.add_node("rewrite_query", rewrite_query_node)
    workflow.add_node("web_search", web_search_node)
    workflow.add_node("combine_docs", combine_docs_node)
    workflow.add_node("generate", generate_node)

    # 2. Start Pipeline -> Retrieve -> Evaluate
    workflow.add_edge(START, "retrieve")
    workflow.add_edge("retrieve", "evaluate")

    # 3. Conditional routing after Evaluation
    workflow.add_conditional_edges(
        "evaluate",
        route_decision,
        {
            "refine": "refine",
            "rewrite_query": "rewrite_query",
            "rewrite_query_mixed": "rewrite_query",
        }
    )

    # 4. Web Search Branching: 'mixed' vs 'bad'
    def route_after_web(state: State) -> str:
        verdict = state.get("verdict") if isinstance(state, dict) else state.verdict
        if verdict == "mixed":
            return "combine_docs"
        return "generate"

    workflow.add_edge("rewrite_query", "web_search")
    
    workflow.add_conditional_edges(
        "web_search",
        route_after_web,
        {
            "combine_docs": "combine_docs",
            "generate": "generate",
        }
    )

    # 5. Connect 'mixed' combine_docs -> refine -> generate
    workflow.add_edge("combine_docs", "refine")
    workflow.add_edge("refine", "generate")

    # 6. Connect Generate -> END
    workflow.add_edge("generate", END)

    # 7. Compile Graph with PostgreSQL Checkpointer for Short-Term Memory
    if checkpointer is None:
        checkpointer = get_checkpointer()

    graph = workflow.compile(checkpointer=checkpointer)

    return graph