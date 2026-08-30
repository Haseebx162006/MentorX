
from LLM.embedding_llm import create_embedding_llm
from State import State
from langchain_qdrant import QdrantVectorStore
from mentorx.backend.app.config import settings
from qdrant_client import QdrantClient
from config.settings import settings
    

def retrieve_node(state:State):
    q= state.get("question")

    embedding_model=create_embedding_llm(
        api_key=state.get("GOOGLE_API_KEY"),
        model=state.get("EMBEDDING_MODEL_NAME"),
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



    
