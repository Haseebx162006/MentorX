from langchain_qdrant import QdrantVectorStore
from app.LLM.embedding_llm import create_embedding_llm
from app.config.settings import settings


def get_embedding_model():
    """
    Helper function to initialize the embedding model using configuration settings.
    """
    return create_embedding_llm(
        api_key=settings.GOOGLE_API_KEY,
        model=settings.EMBEDDING_MODEL_NAME,
    )


def store_db(chunks, embedding_model=None):
    """
    Takes a list of chunks and an embedding model, generates embeddings for each chunk,
    and stores them in a Qdrant database using configured settings.
    """
    try:
        model = embedding_model or get_embedding_model()

        vector_store = QdrantVectorStore.from_documents(
            documents=chunks,
            embedding=model,
            collection_name=settings.QDRANT_COLLECTION_NAME,
            url=settings.QDRANT_URL or None,
            api_key=settings.QDRANT_API_KEY or None,
        )

        return vector_store

    except Exception as e:
        print(f"Error storing chunks in Qdrant database: {e}")
        return None
