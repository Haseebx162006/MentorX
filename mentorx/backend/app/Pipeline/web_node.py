from app.Pipeline.State import State
from app.utility.web_rewrite_chain import rewrite_chain
from langchain_core.documents import Document


def rewrite_query_node(state: State):
    q = state.get("question") if isinstance(state, dict) else state.question
    output = rewrite_chain.invoke({"question": q})
    return {"web_query": getattr(output, "query", q)}


def web_search_node(state: State):
    q = (state.get("web_query") if isinstance(state, dict) else getattr(state, "web_query", None)) or (
        state.get("question") if isinstance(state, dict) else state.question
    )

    web_docs = []

    try:
        from langchain_community.tools.tavily_search import TavilySearchResults
        tavily = TavilySearchResults(max_results=3)
        result = tavily.invoke({"query": q})

        for r in result or []:
            title = r.get("title", "")
            url = r.get("url", "")
            content = r.get("content", "") or r.get("snippet", "")
            text = f"TITLE: {title}\nURL: {url}\nCONTENT:\n{content}"
            web_docs.append(Document(page_content=text, metadata={"url": url, "title": title}))
    except Exception as e:
        print(f"Web search node notice: {e}")

    return {"web_docs": web_docs}
