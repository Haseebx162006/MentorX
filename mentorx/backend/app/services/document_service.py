import os
import uuid
from pathlib import Path
from typing import List, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.repositories.document_repository import DocumentRepository
from app.Chunker.chunker import convert_to_chunks
from app.vector.database import store_db

TEMP_DIR = Path(__file__).resolve().parent.parent.parent / "temp"
TEMP_DIR.mkdir(parents=True, exist_ok=True)


class DocumentService:
    """
    Business logic layer for textbook processing, chunking, and Qdrant ingestion.
    """

    @staticmethod
    def get_all_documents(db: Session) -> List[Document]:
        return DocumentRepository.get_all(db)

    @staticmethod
    async def process_and_ingest_document(
        db: Session,
        file: UploadFile,
        title: str,
        subject: str = "Physics",
        board: str = "Punjab Board",
        chunk_size: Optional[int] = 1000,
        chunk_overlap: Optional[int] = 300,
    ) -> Document:
        temp_file_path = TEMP_DIR / file.filename
        with open(temp_file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        try:
            from langchain_community.document_loaders import PyPDFLoader, TextLoader

            if file.filename.lower().endswith(".pdf"):
                loader = PyPDFLoader(str(temp_file_path))
                documents = loader.load()
            else:
                loader = TextLoader(str(temp_file_path))
                documents = loader.load()

            all_chunks = []
            for doc in documents:
                chunks = convert_to_chunks(doc, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
                all_chunks.extend(chunks)

            chunk_count = len(all_chunks)

            # Store in Qdrant Vector Store
            store_db(all_chunks)

            # Create Record in PostgreSQL via SQLAlchemy ORM
            new_doc = Document(
                id=f"doc_{uuid.uuid4().hex[:8]}",
                filename=file.filename,
                title=title,
                subject=subject,
                board=board,
                chunk_count=chunk_count,
                status="indexed",
                uploaded_by="Admin Supervisor",
            )
            return DocumentRepository.create(db, new_doc)

        finally:
            try:
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
            except Exception:
                pass
