from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path
from typing import Optional

# Path to the backend root directory (where .env resides)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"


class Settings(BaseSettings):
    """
    Application Settings configured via environment variables and .env file.
    Inherits from Pydantic BaseSettings for type validation and automatic loading.
    """

    # Application Settings
    APP_NAME: str = "MentorX API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "AI Academic Guidance Assistant for FSc Students"
    DEBUG: bool = False

    # Google / Gemini Settings
    GOOGLE_API_KEY: str = Field(default="", description="Google Generative AI API key")
    EMBEDDING_MODEL_NAME: str = Field(
        default="models/text-embedding-004",
        description="Embedding model name for Google Generative AI",
    )

    # Groq Settings
    GROQ_API_KEY: str = Field(default="", description="Groq API key")
    GROQ_MODEL: str = Field(
        default="llama-3.3-70b-versatile",
        description="Groq LLM model name",
    )

    # Qdrant Vector Database Settings
    QDRANT_URL: str = Field(default="", description="Qdrant instance URL")
    QDRANT_API_KEY: str = Field(default="", description="Qdrant API key")
    QDRANT_COLLECTION_NAME: str = Field(
        default="mentorx",
        description="Qdrant collection name",
    )

    # Text Chunking Settings
    CHUNK_SIZE: int = Field(default=1000, description="Chunk size for RecursiveCharacterTextSplitter")
    CHUNK_OVERLAP: int = Field(default=300, description="Chunk overlap for RecursiveCharacterTextSplitter")

    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# Global settings instance for singleton access across the application
settings = Settings()
