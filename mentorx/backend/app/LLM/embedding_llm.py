from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config.settings import settings


def create_embedding_llm(api_key: str | None = None, model: str | None = None):
    """
    Create an embedding language model instance using Google Generative AI API.

    Args:
        api_key (str, optional): The API key for authentication. Defaults to settings.GOOGLE_API_KEY.
        model (str, optional): The embedding model name. Defaults to settings.EMBEDDING_MODEL_NAME.

    Returns:
        An instance of the GoogleGenerativeAIEmbeddings class.
    """
    key = api_key or settings.GOOGLE_API_KEY
    model_name = model or settings.EMBEDDING_MODEL_NAME

    return GoogleGenerativeAIEmbeddings(api_key=key, model=model_name)