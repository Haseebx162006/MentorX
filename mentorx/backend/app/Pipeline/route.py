from typing import Dict, Any
from State import State
def route_decision(state: State) -> str:
    verdict = state.get("verdict") if isinstance(state, dict) else state.verdict
    if verdict == "good":
        return "refine"
    elif verdict == "bad":
        return "rewrite_query"
    else:
        # 'mixed' verdict: rewrites query & triggers web search, then merges
        return "rewrite_query_mixed"