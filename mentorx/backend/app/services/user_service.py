import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.document_repository import DocumentRepository


class UserService:
    """
    Business logic layer for user authentication and administrative management.
    """

    @staticmethod
    def get_or_create_google_user(
        db: Session,
        email: str,
        name: str,
        avatar: Optional[str] = None,
        study_track: str = "Pre-Medical",
    ) -> User:
        from app.config.settings import settings

        admin_emails = [e.strip().lower() for e in settings.ADMIN_EMAILS.split(",") if e.strip()]
        is_admin = email.lower() in admin_emails or "admin" in email.lower()
        role = "admin" if is_admin else "student"

        user = UserRepository.get_by_email(db, email)
        if user:
            if is_admin and user.role != "admin":
                user.role = "admin"
                db.commit()
                db.refresh(user)
            return UserRepository.update_last_active(db, user)

        new_user = User(
            id=f"usr_{uuid.uuid4().hex[:8]}",
            email=email,
            name=name,
            avatar=avatar or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            role=role,
            study_track="System Administrator" if role == "admin" else study_track,
            is_blocked=False,
        )
        return UserRepository.create(db, new_user)

    @staticmethod
    def get_all_users(db: Session) -> List[User]:
        return UserRepository.get_all(db)

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        return UserRepository.get_by_id(db, user_id)

    @staticmethod
    def toggle_block_status(db: Session, user_id: str, is_blocked: bool) -> Optional[User]:
        user = UserRepository.get_by_id(db, user_id)
        if not user:
            return None
        return UserRepository.update_block_status(db, user, is_blocked)

    @staticmethod
    def get_dashboard_stats(db: Session) -> dict:
        user_counts = UserRepository.get_user_counts(db)
        doc_counts = DocumentRepository.get_document_counts(db)
        return {
            "total_users": user_counts["total"],
            "active_users": user_counts["active"],
            "blocked_users": user_counts["blocked"],
            "total_documents": doc_counts["total_documents"],
            "total_indexed_chunks": doc_counts["total_indexed_chunks"],
        }
