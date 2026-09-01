from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc
from typing import List, Optional
from app.models.user import User


class UserRepository:
    """
    SQLAlchemy ORM Repository for User operations.
    """

    @staticmethod
    def get_by_id(db: Session, user_id: str) -> Optional[User]:
        stmt = select(User).where(User.id == user_id)
        return db.scalars(stmt).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        stmt = select(User).where(User.email == email)
        return db.scalars(stmt).first()

    @staticmethod
    def get_all(db: Session) -> List[User]:
        stmt = select(User).order_by(desc(User.created_at))
        return list(db.scalars(stmt).all())

    @staticmethod
    def create(db: Session, user: User) -> User:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_block_status(db: Session, user: User, is_blocked: bool) -> User:
        user.is_blocked = is_blocked
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update_last_active(db: Session, user: User) -> User:
        user.last_active = func.now()
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_user_counts(db: Session) -> dict:
        total = db.scalar(select(func.count()).select_from(User)) or 0
        blocked = db.scalar(select(func.count()).select_from(User).where(User.is_blocked == True)) or 0
        return {
            "total": total,
            "active": total - blocked,
            "blocked": blocked,
        }
