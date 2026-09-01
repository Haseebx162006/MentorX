from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from typing import List, Optional, Any
from app.models.chat import ChatSession, ChatMessage
from datetime import datetime


class ChatRepository:
    """
    SQLAlchemy ORM Repository for Chat Sessions and Messages.
    """

    @staticmethod
    def get_sessions_by_user(db: Session, user_id: Optional[str] = None) -> List[ChatSession]:
        stmt = select(ChatSession)
        if user_id:
            stmt = stmt.where(ChatSession.user_id == user_id)
        stmt = stmt.order_by(desc(ChatSession.updated_at))
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_session_by_id(db: Session, session_id: str) -> Optional[ChatSession]:
        stmt = select(ChatSession).where(ChatSession.id == session_id)
        return db.scalars(stmt).first()

    @staticmethod
    def create_session(
        db: Session,
        session_id: str,
        title: str = "New Conversation",
        user_id: Optional[str] = None,
    ) -> ChatSession:
        valid_user_id = None
        if user_id:
            from app.models.user import User
            try:
                user = db.scalars(select(User).where(User.id == user_id)).first()
                if user:
                    valid_user_id = user_id
                else:
                    # Auto-provision user record for guest / fallback client user IDs
                    guest_user = User(
                        id=user_id,
                        email=f"{user_id}@mentorx.edu",
                        name="Student User",
                        role="student",
                    )
                    db.add(guest_user)
                    db.commit()
                    valid_user_id = user_id
            except Exception as e:
                db.rollback()
                print(f"Notice: User check/provisioning handled ({e}). Creating guest session.")
                valid_user_id = None

        session = ChatSession(
            id=session_id,
            user_id=valid_user_id,
            title=title,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def update_session_title(db: Session, session_id: str, title: str) -> Optional[ChatSession]:
        session = ChatRepository.get_session_by_id(db, session_id)
        if session:
            session.title = title
            db.commit()
            db.refresh(session)
        return session

    @staticmethod
    def touch_session(db: Session, session: ChatSession) -> ChatSession:
        session.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def delete_session(db: Session, session_id: str) -> bool:
        session = ChatRepository.get_session_by_id(db, session_id)
        if session:
            db.delete(session)
            db.commit()
            return True
        return False

    @staticmethod
    def get_messages_by_session(
        db: Session, session_id: str, limit: int = 100
    ) -> List[ChatMessage]:
        stmt = (
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .limit(limit)
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def create_message(
        db: Session,
        message_id: str,
        session_id: str,
        role: str,
        content: str,
        sources: Optional[Any] = None,
        verdict: Optional[str] = None,
    ) -> ChatMessage:
        message = ChatMessage(
            id=message_id,
            session_id=session_id,
            role=role,
            content=content,
            sources=sources,
            verdict=verdict,
        )
        db.add(message)
        db.commit()
        db.refresh(message)
        return message
