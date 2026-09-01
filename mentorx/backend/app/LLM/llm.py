from langchain_groq import ChatGroq
from app.config.settings import settings


def create_llm(
    model: str | None = None,
    api_key: str | None = None,
    temperature: float = 0.7,
    max_tokens: int = 2000,
):
    """
    Create a language model instance based on the specified model name.

    Args:
        model (str, optional): The name of the model to create. Defaults to settings.GROQ_MODEL.
        api_key (str, optional): The API key for authentication. Defaults to settings.GROQ_API_KEY.
        temperature (float, optional): Sampling temperature. Defaults to 0.7.
        max_tokens (int, optional): Maximum number of tokens to generate. Defaults to 2000.

    Returns:
        An instance of the specified language model.
    """
    model_name = model or settings.GROQ_MODEL
    key = (api_key or settings.GROQ_API_KEY or "").strip()

    if not key:
        raise ValueError(
            "GROQ_API_KEY is missing or empty. Please configure the GROQ_API_KEY environment variable in your Render backend settings."
        )

    return ChatGroq(
        model=model_name,
        api_key=key,
        temperature=temperature,
        max_tokens=max_tokens,
    )