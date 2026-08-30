# Backwards compatibility alias for db.session
from db.session import engine, SessionLocal, Base, get_db, init_db

__all__ = ["engine", "SessionLocal", "Base", "get_db", "init_db"]
