import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.repositories.chat_repository import ChatRepository
from app.models.chat import ChatSession, ChatMessage


class ChatService:
    """
    Business logic service for Chat Sessions, Message History, and LangGraph memory preparation.
    """

    @staticmethod
    def categorize_date(dt: datetime) -> str:
        if not dt:
            return "Today"
        now = datetime.now(timezone.utc)
        # Ensure dt is timezone-aware
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        
        diff = now - dt
        if diff < timedelta(days=1) and now.day == dt.day:
            return "Today"
        elif diff < timedelta(days=2):
            return "Yesterday"
        elif diff < timedelta(days=7):
            return "7 days"
        else:
            return "Older"

    @classmethod
    def get_user_sessions(cls, db: Session, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        sessions = ChatRepository.get_sessions_by_user(db, user_id)
        result = []
        for s in sessions:
            category = cls.categorize_date(s.updated_at or s.created_at)
            result.append({
                "id": s.id,
                "title": s.title,
                "userId": s.user_id,
                "createdAt": s.created_at.isoformat() if s.created_at else "",
                "updatedAt": s.updated_at.isoformat() if s.updated_at else "",
                "category": category,
                "messageCount": len(s.messages) if s.messages else 0,
            })
        return result

    @classmethod
    def get_session_with_messages(cls, db: Session, session_id: str) -> Optional[Dict[str, Any]]:
        session = ChatRepository.get_session_by_id(db, session_id)
        if not session:
            return None
        
        messages = ChatRepository.get_messages_by_session(db, session_id)
        formatted_messages = []
        for m in messages:
            formatted_messages.append({
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "sources": m.sources or [],
                "verdict": m.verdict,
                "timestamp": m.created_at.strftime("%I:%M %p") if m.created_at else "",
                "createdAt": m.created_at.isoformat() if m.created_at else "",
            })

        return {
            "id": session.id,
            "title": session.title,
            "userId": session.user_id,
            "createdAt": session.created_at.isoformat() if session.created_at else "",
            "updatedAt": session.updated_at.isoformat() if session.updated_at else "",
            "category": cls.categorize_date(session.updated_at or session.created_at),
            "messages": formatted_messages,
        }

    @staticmethod
    def get_or_create_session(
        db: Session,
        session_id: Optional[str] = None,
        user_id: Optional[str] = None,
        title: Optional[str] = None,
    ) -> ChatSession:
        if session_id:
            existing = ChatRepository.get_session_by_id(db, session_id)
            if existing:
                return existing

        target_id = session_id or f"session_{uuid.uuid4().hex[:12]}"
        default_title = title or "New Conversation"
        return ChatRepository.create_session(
            db=db,
            session_id=target_id,
            title=default_title,
            user_id=user_id,
        )

    @staticmethod
    def get_recent_history_context(db: Session, session_id: str, limit: int = 6) -> List[Dict[str, str]]:
        """
        Retrieves recent turns for LangGraph short-term memory prompt synthesis.
        """
        messages = ChatRepository.get_messages_by_session(db, session_id, limit=limit)
        history = []
        for m in messages:
            history.append({
                "role": m.role,
                "content": m.content,
            })
        return history

    @staticmethod
    def save_turn(
        db: Session,
        session_id: str,
        user_id: Optional[str],
        question: str,
        answer: str,
        sources: Optional[List[Dict[str, Any]]] = None,
        verdict: Optional[str] = "good",
    ) -> Dict[str, Any]:
        """
        Persists both user question and assistant answer in a transactional step.
        Auto-generates title if initial turn.
        """
        session = ChatService.get_or_create_session(db, session_id, user_id)

        # If title is default, generate concise title from the first question
        if session.title in ["New Conversation", "New Chat", ""]:
            new_title = question.strip()
            if len(new_title) > 38:
                new_title = new_title[:38] + "..."
            ChatRepository.update_session_title(db, session.id, new_title)

        user_msg_id = f"msg_{uuid.uuid4().hex[:12]}"
        ai_msg_id = f"msg_{uuid.uuid4().hex[:12]}"

        # Save user message
        ChatRepository.create_message(
            db=db,
            message_id=user_msg_id,
            session_id=session.id,
            role="user",
            content=question,
        )

        # Save assistant message
        ChatRepository.create_message(
            db=db,
            message_id=ai_msg_id,
            session_id=session.id,
            role="assistant",
            content=answer,
            sources=sources,
            verdict=verdict,
        )

        # Touch session update timestamp
        ChatRepository.touch_session(db, session)

        return {
            "session_id": session.id,
            "user_message_id": user_msg_id,
            "assistant_message_id": ai_msg_id,
        }

    @staticmethod
    def delete_session(db: Session, session_id: str) -> bool:
        return ChatRepository.delete_session(db, session_id)
