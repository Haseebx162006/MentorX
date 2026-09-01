from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator
from app.config.settings import settings

db_url = settings.get_database_url()

# Format dialect for SQLAlchemy if needed
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# Lazy/resilient engine creation
engine = None

if db_url:
    try:
        engine = create_engine(
            db_url,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 10},
        )
    except Exception as e:
        engine = None
        print(f"Warning: Engine initialization error: {e}")

# Session Factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# Declarative Base
Base = declarative_base()


def get_db() -> Generator:
    """
    FastAPI dependency yielding a database session per request.
    Throws RuntimeError / ConnectionError if PostgreSQL is not configured or fails.
    """  """
    FastAPI dependency yielding a database session per request.
    Throws RuntimeError / ConnectionError if PostgreSQL is not configured or fails.
    """
    if engine is None:
        raise RuntimeError(
            "FATAL: PostgreSQL connection string is not configured or engine failed to initialize. "
            "Please configure DATABASE_URL in your .env file."
        )

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Initializes PostgreSQL tables using SQLAlchemy ORM metadata.
    Creates schema tables without inserting any dummy records.
    Throws an error if the connection fails.
    """
    if engine is None:
        raise RuntimeError(
            "FATAL: Cannot initialize database. PostgreSQL DATABASE_URL is not set."
        )

    try:
        # Import models so they are registered with Base metadata
        from app.models.user import User
        from app.models.document import Document
        from app.models.chat import ChatSession, ChatMessage

        # Create all tables cleanly using SQLAlchemy ORM
        Base.metadata.create_all(bind=engine)

    except Exception as e:
        raise ConnectionError(
            f"FATAL: PostgreSQL SQLAlchemy initialization failed. Error: {str(e)}"
        ) from e
