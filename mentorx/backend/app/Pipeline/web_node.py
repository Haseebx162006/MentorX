from State import State
from utility.web_rewrite_chain import rewrite_chain
from langchain_core.documents import Document

def rewrite_query_node(state: State):
    output = rewrite_chain.invoke({"question": state["question"]})
    return {"web_query": output.query}

def web_search_node(state:State):
    q=state.get("web_query") or state.get("question")

    result = tavily.invoke({"query": q})

    web_docs = []

    for r in result or []:
        title = r.get("title", "")
        url = r.get("url", "")
        content = r.get("content", "") or r.get("snippet", "")
        text = f"TITLE: {title}\nURL: {url}\nCONTENT:\n{content}"
        web_docs.append(Document(page_content=text, metadata={"url": url, "title": title}))

    return {"web_docs": web_docs}
