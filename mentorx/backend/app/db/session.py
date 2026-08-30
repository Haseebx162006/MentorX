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
    Initializes PostgreSQL tables using SQLAlchemy ORM metadata and seeds initial records.
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

        # Create all tables using SQLAlchemy ORM (No Raw SQL)
        Base.metadata.create_all(bind=engine)

        # Seed initial demo data via ORM session
        with SessionLocal() as db:
            user_count = db.query(User).count()
            if user_count == 0:
                initial_users = [
                    User(
                        id="admin_001",
                        email="admin@mentorx.edu",
                        name="Admin Supervisor",
                        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                        role="admin",
                        study_track="System Admin",
                        is_blocked=False,
                    ),
                    User(
                        id="user_001",
                        email="ayesha.malik@gmail.com",
                        name="Ayesha Malik",
                        avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                        role="student",
                        study_track="FSc Pre-Medical",
                        is_blocked=False,
                    ),
                    User(
                        id="user_002",
                        email="hamza.tariq@gmail.com",
                        name="Hamza Tariq",
                        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                        role="student",
                        study_track="FSc Pre-Engineering",
                        is_blocked=False,
                    ),
                    User(
                        id="user_003",
                        email="zainab.fatima@gmail.com",
                        name="Zainab Fatima",
                        avatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
                        role="student",
                        study_track="ICS",
                        is_blocked=False,
                    ),
                    User(
                        id="user_004",
                        email="bilal.khan@gmail.com",
                        name="Bilal Khan",
                        avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                        role="student",
                        study_track="A-Levels",
                        is_blocked=True,
                    ),
                ]
                db.add_all(initial_users)
                db.commit()

            doc_count = db.query(Document).count()
            if doc_count == 0:
                initial_docs = [
                    Document(
                        id="doc_001",
                        filename="NUST_UG_Prospectus_2025.pdf",
                        title="NUST Undergraduate Admission Policy & NET Weightages",
                        subject="NUST Islamabad",
                        board="Admission & NET Criteria",
                        chunk_count=342,
                        status="indexed",
                        uploaded_by="Admin Supervisor",
                    ),
                    Document(
                        id="doc_002",
                        filename="FAST_Closing_Merit_Lists_2024.pdf",
                        title="FAST-NUCES Historical Closing Merits (CS/SE/AI/DS)",
                        subject="FAST-NUCES",
                        board="Merit Lists & Cutoffs",
                        chunk_count=288,
                        status="indexed",
                        uploaded_by="Admin Supervisor",
                    ),
                    Document(
                        id="doc_003",
                        filename="LUMS_Financial_Aid_NOP_Criteria.pdf",
                        title="LUMS National Outreach Program (NOP) Full Scholarships",
                        subject="LUMS Lahore",
                        board="Financial Aid & Scholarships",
                        chunk_count=415,
                        status="indexed",
                        uploaded_by="Admin Supervisor",
                    ),
                    Document(
                        id="doc_004",
                        filename="HEC_PreMed_to_Computing_Policy.pdf",
                        title="HEC Pre-Medical to Computing / BSCS Eligibility Rules",
                        subject="Higher Education Commission",
                        board="HEC National Policy",
                        chunk_count=160,
                        status="indexed",
                        uploaded_by="Admin Supervisor",
                    ),
                ]
                db.add_all(initial_docs)
                db.commit()

    except Exception as e:
        raise ConnectionError(
            f"FATAL: PostgreSQL SQLAlchemy initialization failed. Error: {str(e)}"
        ) from e
