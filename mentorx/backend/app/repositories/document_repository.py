from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc
from typing import List, Optional
from app.models.document import Document


class DocumentRepository:
    """
    SQLAlchemy ORM Repository for Document metadata operations.
    Pure ORM methods without raw SQL strings.
    """

    @staticmethod
    def get_by_id(db: Session, doc_id: str) -> Optional[Document]:
        stmt = select(Document).where(Document.id == doc_id)
        return db.scalars(stmt).first()

    @staticmethod
    def get_all(db: Session) -> List[Document]:
        stmt = select(Document).order_by(desc(Document.created_at))
        return list(db.scalars(stmt).all())

    @staticmethod
    def create(db: Session, doc: Document) -> Document:
        db.add(doc)
        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def get_document_counts(db: Session) -> dict:
        total_docs = db.scalar(select(func.count()).select_from(Document)) or 0
        total_chunks = db.scalar(select(func.coalesce(func.sum(Document.chunk_count), 0))) or 0
        return {
            "total_documents": total_docs,
            "total_indexed_chunks": total_chunks,
        }
