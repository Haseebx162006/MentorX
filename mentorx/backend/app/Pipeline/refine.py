from app.Pipeline.State import State
from app.utility.decompose_sentences import decompose
from app.utility.filter_chain import filter_chain


def refine(state: State):
    q = state.get("question") if isinstance(state, dict) else state.question
    docs = state.get("docs") if isinstance(state, dict) else state.docs

    context = "\n\n".join(d.page_content for d in (docs or []))

    strips = decompose(context)

    kept_strips = []

    for s in strips:
        result = filter_chain.invoke({"question": q, "sentence": s})
        if getattr(result, "keep", False):
            kept_strips.append(s)

    refined_context = "\n\n".join(kept_strips)

    return {
        "strips": strips,
        "kept_strips": kept_strips,
        "refined_context": refined_context
    }