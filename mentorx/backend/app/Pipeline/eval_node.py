from typing import List
from langchain_core.documents import Document
from app.Pipeline.State import State
from app.utility.doc_eval_chain import doc_eval_chain


def eval_node(state: State):
    q = state.get("question") if isinstance(state, dict) else state.question
    docs = state.get("docs") if isinstance(state, dict) else state.docs

    scores: List[float] = []
    reasons: List[str] = []
    good: List[Document] = []

    for d in (docs or []):
        result = doc_eval_chain.invoke({"question": q, "chunk": d.page_content})
        scores.append(result.score)
        reasons.append(result.reason)
        if result.score > 0.3:
            good.append(d)

    if any(s > 0.7 for s in scores):
        return {
            "good_docs": good,
            "verdict": "good",
            "reason": "Some documents are relevant."
        }

    if len(scores) > 0 and all(s <= 0.3 for s in scores):
        return {
            "good_docs": [],
            "verdict": "bad",
            "reason": "All documents are irrelevant."
        }

    return {
        "good_docs": good,
        "verdict": "mixed",
        "reason": "Some documents are relevant, some are not."  
    }