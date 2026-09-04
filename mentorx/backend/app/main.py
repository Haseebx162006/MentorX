import sys
from pathlib import Path

# Add backend root and app directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
app_dir = Path(__file__).resolve().parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(app_dir) not in sys.path:
    sys.path.insert(0, str(app_dir))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.chat import router as chat_router
from app.db.session import init_db

import os
import tempfile

# Ensure temp directory exists for uploads (safe for serverless / Vercel read-only filesystem)
if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
    TEMP_DIR = Path(tempfile.gettempdir())
else:
    TEMP_DIR = backend_dir / "temp"
try:
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
except Exception:
    TEMP_DIR = Path(tempfile.gettempdir())

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(chat_router)


@app.on_event("startup")
async def on_startup():
    """Initializes database schema, models, and LangSmith tracing on application startup."""
    try:
        settings.configure_langsmith()
        init_db()
        print("SQLAlchemy PostgreSQL database schema initialized successfully.")
    except Exception as e:
        print(f"Database startup notice: {e}")


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": "PostgreSQL (SQLAlchemy ORM)",
    }


@app.get("/", tags=["Health"])
@app.api_route("/api/index.py", methods=["GET", "POST", "OPTIONS"], tags=["Health"])
async def root():
    """Root entrypoint."""
    return {
        "message": "MentorX Academic Intelligence API (SQLAlchemy ORM + Neon) is running.",
        "docs": "/docs",
        "status": "healthy",
    }
