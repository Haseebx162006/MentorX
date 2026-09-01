from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserResponse, BlockStatusRequest, DashboardStatsResponse
from app.schemas.document import DocumentResponse, DocumentUploadResponse
from app.services.user_service import UserService
from app.services.document_service import DocumentService

router = APIRouter(prefix="/api/admin", tags=["Admin Management"])


@router.get("/stats", response_model=DashboardStatsResponse)
async def get_admin_stats(db: Session = Depends(get_db)):
    """Returns overview stats for the admin dashboard using SQLAlchemy ORM."""
    try:
        stats = UserService.get_dashboard_stats(db)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/users", response_model=List[UserResponse])
async def list_all_users(db: Session = Depends(get_db)):
    """Lists all registered students and administrators using SQLAlchemy ORM."""
    try:
        users = UserService.get_all_users(db)
        return users
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.patch("/users/{user_id}/status")
async def update_user_block_status(
    user_id: str,
    payload: BlockStatusRequest,
    db: Session = Depends(get_db),
):
    """Blocks or unblocks a specific user in PostgreSQL via SQLAlchemy ORM."""
    try:
        updated = UserService.toggle_block_status(db, user_id, payload.is_blocked)
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found",
            )
        return {
            "message": f"User {'blocked' if payload.is_blocked else 'unblocked'} successfully",
            "user": UserResponse.model_validate(updated),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.get("/documents", response_model=List[DocumentResponse])
async def list_ingested_documents(db: Session = Depends(get_db)):
    """Lists all syllabus and textbook documents ingested into the vector database."""
    try:
        docs = DocumentService.get_all_documents(db)
        return docs
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_and_ingest_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    subject: str = Form("Physics"),
    board: str = Form("Punjab Board"),
    chunk_size: Optional[int] = Form(None),
    chunk_overlap: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    """
    Ingests textbook PDF into Qdrant Vector Store and saves metadata in PostgreSQL via SQLAlchemy ORM.
    """
    try:
        doc = await DocumentService.process_and_ingest_document(
            db=db,
            file=file,
            title=title,
            subject=subject,
            board=board,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
        return DocumentUploadResponse(
            message="Document successfully parsed, chunked, and ingested into Qdrant Vector Store.",
            document=DocumentResponse.model_validate(doc),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document ingestion error: {str(e)}",
        )
