from app.Pipeline.State import State
from langsmith import traceable


@traceable(name="mentorx_refine_context", run_type="chain")
def refine(state: State):
    """
    Synthesizes and consolidates verified document chunks into a rich, structured context.
    """
    good_docs = (state.get("good_docs") if isinstance(state, dict) else getattr(state, "good_docs", [])) or []
    docs = (state.get("docs") if isinstance(state, dict) else getattr(state, "docs", [])) or []

    target_docs = good_docs if good_docs else docs

    # Combine relevant chunks cleanly
    context_blocks = []
    for i, d in enumerate(target_docs[:6], 1):
        content = d.page_content.strip()
        metadata = getattr(d, "metadata", {}) or {}
        source_title = metadata.get("title") or metadata.get("source") or f"Knowledge Document #{i}"
        context_blocks.append(f"--- [Document: {source_title}] ---\n{content}")

    refined_context = "\n\n".join(context_blocks)

    return {
        "refined_context": refined_context
    }