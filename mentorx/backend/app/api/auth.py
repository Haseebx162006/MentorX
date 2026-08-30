from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import GoogleAuthRequest, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/google", response_model=UserResponse)
async def google_sign_in(
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticates or registers a student/admin via Google OAuth using SQLAlchemy ORM.
    """
    try:
        user = UserService.get_or_create_google_user(
            db=db,
            email=payload.email,
            name=payload.name,
            avatar=payload.avatar,
            study_track=payload.study_track or "Pre-Medical",
        )

        if user.is_blocked:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been blocked by an administrator.",
            )

        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}",
        )


@router.get("/me/{user_id}", response_model=UserResponse)
async def get_current_user(
    user_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves current user status and checks for block enforcement.
    """
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been blocked by an administrator.",
        )

    return user
