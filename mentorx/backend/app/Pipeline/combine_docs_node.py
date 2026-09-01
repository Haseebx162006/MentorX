from typing import Dict, Any, List
from langchain_core.documents import Document
from app.Pipeline.State import State
from langsmith import traceable


@traceable(name="mentorx_combine_docs", run_type="chain")
def combine_docs_node(state: State) -> Dict[str, Any]:
    """
    Merges verified local academic documents (good_docs) with live web search results (web_docs).
    """
    good_docs: List[Document] = (
        state.get("good_docs") if isinstance(state, dict) else state.good_docs
    ) or []
    
    web_docs: List[Document] = (
        state.get("web_docs") if isinstance(state, dict) else state.web_docs
    ) or []
    
    # Fallback to general docs if good_docs is empty
    if not good_docs:
        raw_docs = (state.get("docs") if isinstance(state, dict) else state.docs) or []
        good_docs = raw_docs

    context_sections: List[str] = []

    # Format Verified Local Syllabus / Textbook Documents
    if good_docs:
        local_entries = []
        for idx, doc in enumerate(good_docs, 1):
            source_name = doc.metadata.get("source", f"Academic Chunk {idx}")
            local_entries.append(
                f"[Local Source {idx} - {source_name}]:\n{doc.page_content.strip()}"
            )
        
        context_sections.append(
            "=== VERIFIED ACADEMIC / SYLLABUS DOCUMENTS ===\n" + "\n\n".join(local_entries)
        )

    # Format External Web Search Documents
    if web_docs:
        web_entries = []
        for idx, doc in enumerate(web_docs, 1):
            title = doc.metadata.get("title", f"Web Result {idx}")
            url = doc.metadata.get("url", "N/A")
            web_entries.append(
                f"[Web Source {idx} - {title} ({url})]:\n{doc.page_content.strip()}"
            )
            
        context_sections.append(
            "=== SUPPLEMENTARY WEB SEARCH SOURCES ===\n" + "\n\n".join(web_entries)
        )

    # Join all formatted sections into a single refined context
    combined_context = "\n\n" + ("=" * 40) + "\n\n".join(context_sections)

    return {
        "refined_context": combined_context,
        "docs": good_docs + web_docs
    }
