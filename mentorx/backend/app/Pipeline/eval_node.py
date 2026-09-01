from typing import List
from langchain_core.documents import Document
from app.Pipeline.State import State
from app.utility.doc_eval_chain import doc_eval_chain
from langsmith import traceable


@traceable(name="mentorx_eval_relevance", run_type="chain")
def eval_node(state: State):
    q = state.get("question") if isinstance(state, dict) else state.question
    docs = state.get("docs") if isinstance(state, dict) else state.docs

    if not docs:
        return {
            "good_docs": [],
            "verdict": "bad",
            "reason": "No documents retrieved from vector database."
        }

    # Prepare inputs for parallel batch evaluation
    eval_inputs = [{"question": q, "chunk": d.page_content[:1500]} for d in docs]
    
    # Execute parallel batch evaluation across all chunks simultaneously
    results = doc_eval_chain.batch(eval_inputs, max_workers=5)

    scores: List[float] = []
    reasons: List[str] = []
    good: List[Document] = []

    for d, res in zip(docs, results):
        score = float(getattr(res, "score", 0.0))
        reason = getattr(res, "reason", "Evaluated relevance")
        scores.append(score)
        reasons.append(reason)
        if score >= 0.4:
            good.append(d)

    # 1. 'good' verdict: at least one strong match (score >= 0.6) or multiple relevant matches
    if any(s >= 0.6 for s in scores) or len(good) >= 2:
        return {
            "good_docs": good if good else docs[:2],
            "verdict": "good",
            "reason": "Relevant knowledge documents verified in vector database."
        }

    # 2. 'mixed' verdict: partial relevance
    if len(good) > 0:
        return {
            "good_docs": good,
            "verdict": "mixed",
            "reason": "Partial document relevance detected; combining with web search."
        }

    # 3. 'bad' verdict: chunks did not contain the answer (triggers web search & bold star notice)
    return {
        "good_docs": [],
        "verdict": "bad",
        "reason": "Requested information not available in local chunks. Triggering live web search."
    }