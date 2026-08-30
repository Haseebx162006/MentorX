from app.LLM.embedding_llm import create_embedding_llm
from app.Pipeline.State import State
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from app.config.settings import settings


def retrieve_node(state: State):
    q = state.get("question") if isinstance(state, dict) else state.question

    embedding_model = create_embedding_llm(
        api_key=settings.GOOGLE_API_KEY,
        model=settings.EMBEDDING_MODEL_NAME,
    )

    client = QdrantClient(
        url=settings.QDRANT_URL or None,
        api_key=settings.QDRANT_API_KEY or None,
    )
    
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=settings.QDRANT_COLLECTION_NAME,
        embedding=embedding_model,
    )

    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    retrieved_docs = retriever.invoke(q)
    
    return {"docs": retrieved_docs}
