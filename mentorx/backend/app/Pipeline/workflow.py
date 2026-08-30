from typing import Dict, Any
from langgraph.graph import StateGraph, START, END

# Use consistent imports based on your app structure
from Pipeline.State import State
from Pipeline.eval_node import eval_node
from Pipeline.refine import refine
from Pipeline.web_node import rewrite_query_node, web_search_node
from Pipeline.combine_docs_node import combine_docs_node
from Pipeline.generate_node import generate_node
from Pipeline.retrieve_node import retrieve_node
from Pipeline.route import route_decision


def build_workflow():
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

    # 7. Compile Graph
    graph = workflow.compile()

    # Print Mermaid graph
    #print(graph.get_graph().draw_mermaid())

    return graph