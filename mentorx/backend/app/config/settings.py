import os
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
    ADMIN_EMAILS: str = Field(
        default="haseebahmadcool678@gmail.com,admin@mentorx.edu",
        description="Comma-separated admin email addresses with automatic administrator role",
    )

    # LangSmith Tracing & Observability
    LANGCHAIN_TRACING_V2: bool = Field(
        default=True,
        description="Enable LangSmith Tracing V2",
    )
    LANGCHAIN_API_KEY: Optional[str] = Field(
        default="",
        description="LangSmith API Key (lsv2_pt_...)",
    )
    LANGSMITH_API_KEY: Optional[str] = Field(
        default=None,
        description="Alternative LangSmith API Key",
    )
    LANGCHAIN_PROJECT: str = Field(
        default="mentorx",
        description="LangSmith Project Name for tracking graph runs and LLM calls",
    )
    LANGSMITH_PROJECT: Optional[str] = Field(
        default=None,
        description="Alternative LangSmith Project Name",
    )
    LANGCHAIN_ENDPOINT: str = Field(
        default="https://api.smith.langchain.com",
        description="LangSmith API Endpoint URL",
    )
    LANGSMITH_ENDPOINT: Optional[str] = Field(
        default=None,
        description="Alternative LangSmith API Endpoint",
    )

    # PostgreSQL / Neon Database Settings
    DATABASE_URL: str = Field(
        default="",
        description="Neon / PostgreSQL connection string (e.g., postgresql://user:password@ep-xyz.neon.tech/dbname?sslmode=require)",
    )
    POSTGRES_URL: Optional[str] = Field(default=None, description="Alternative PostgreSQL connection URL")
    NEON_DATABASE_URL: Optional[str] = Field(default=None, description="Alternative Neon connection URL")

    # Google / Gemini / OAuth Settings
    GOOGLE_API_KEY: str = Field(default="", description="Google Generative AI API key")
    GOOGLE_CLIENT_ID: Optional[str] = Field(default="", description="Google OAuth 2.0 Web Client ID")
    EMBEDDING_MODEL_NAME: str = Field(
        default="models/text-embedding-004",
        description="Embedding model name for Google Generative AI",
    )

    # Groq Settings
    GROQ_API_KEY: str = Field(default="", description="Groq API key")
    GROQ_MODEL: str = Field(
        default="openai/gpt-oss-120b",
        description="Groq LLM model name",
    )

    # Qdrant Vector Database Settings
    QDRANT_URL: str = Field(default="", description="Qdrant instance URL")
    QDRANT_API_KEY: str = Field(default="", description="Qdrant API key")
    QDRANT_COLLECTION_NAME: str = Field(
        default="mentorx",
        description="Qdrant collection name",
    )

    # Tavily Web Search Settings
    TAVILY_API_KEY: Optional[str] = Field(default="", description="Tavily Search API key")

    # Text Chunking Settings
    CHUNK_SIZE: int = Field(default=1000, description="Chunk size for RecursiveCharacterTextSplitter")
    CHUNK_OVERLAP: int = Field(default=300, description="Chunk overlap for RecursiveCharacterTextSplitter")

    def get_database_url(self) -> str:
        """Returns active PostgreSQL connection URL from settings."""
        url = self.DATABASE_URL or self.POSTGRES_URL or self.NEON_DATABASE_URL or ""
        return url.strip()

    def configure_langsmith(self):
        """Sets environment variables required by LangChain / LangGraph for LangSmith tracing."""
        api_key = (self.LANGCHAIN_API_KEY or self.LANGSMITH_API_KEY or "").strip()
        project = (self.LANGCHAIN_PROJECT or self.LANGSMITH_PROJECT or "mentorx").strip()
        endpoint = (self.LANGCHAIN_ENDPOINT or self.LANGSMITH_ENDPOINT or "https://api.smith.langchain.com").strip()

        if api_key:
            os.environ["LANGCHAIN_TRACING_V2"] = "true" if self.LANGCHAIN_TRACING_V2 else "false"
            os.environ["LANGCHAIN_API_KEY"] = api_key
            os.environ["LANGSMITH_API_KEY"] = api_key
            os.environ["LANGCHAIN_PROJECT"] = project
            os.environ["LANGSMITH_PROJECT"] = project
            os.environ["LANGCHAIN_ENDPOINT"] = endpoint
            os.environ["LANGSMITH_ENDPOINT"] = endpoint
            print(f"✓ LangSmith tracing enabled for project: '{project}'")
        else:
            print("Notice: LANGCHAIN_API_KEY not set. LangSmith tracing is currently idle.")

    model_config = SettingsConfigDict(
        env_file=(str(ENV_FILE), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# Global settings instance for singleton access across the application
settings = Settings()

# Automatically configure LangSmith environment variables on initialization
settings.configure_langsmith()
