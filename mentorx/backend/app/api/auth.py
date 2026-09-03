from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import GoogleAuthRequest, UserResponse
from app.services.user_service import UserService

import json
import urllib.request
import urllib.error
from app.config.settings import settings

from app.core.security import create_access_token
from app.api.deps import get_current_user as get_authenticated_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/google", response_model=UserResponse)
async def google_sign_in(
    payload: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    """
    Authenticates or registers a student/admin via Google OAuth using SQLAlchemy ORM.
    Supports token verification with Google's public tokeninfo endpoint.
    Issues a cryptographically signed JWT access token.
    """
    try:
        email = payload.email
        name = payload.name
        avatar = payload.avatar

        # If a Google ID token was provided, optionally verify against Google tokeninfo endpoint
        if payload.token:
            try:
                url = f"https://oauth2.googleapis.com/tokeninfo?id_token={payload.token}"
                req = urllib.request.Request(url, headers={"User-Agent": "MentorX-Backend"})
                with urllib.request.urlopen(req, timeout=5) as response:
                    if response.status == 200:
                        google_data = json.loads(response.read().decode("utf-8"))
                        if google_data.get("email"):
                            email = google_data.get("email")
                            name = google_data.get("name", name)
                            avatar = google_data.get("picture", avatar)
            except Exception as token_err:
                print(f"Notice: Google token verification skipped or failed ({token_err}). Using client payload.")

        user = UserService.get_or_create_google_user(
            db=db,
            email=email,
            name=name,
            avatar=avatar,
            study_track=payload.study_track or "Pre-Medical",
        )

        if user.is_blocked:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been blocked by an administrator.",
            )

        # Generate cryptographically signed JWT access token
        token_payload = {
            "sub": user.id,
            "id": user.id,
            "email": user.email,
            "role": user.role,
        }
        access_token = create_access_token(token_payload)

        # Return user with access token
        user_dict = {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "avatar": user.avatar,
            "role": user.role,
            "study_track": user.study_track,
            "is_blocked": user.is_blocked,
            "created_at": user.created_at,
            "last_active": user.last_active,
            "access_token": access_token,
            "token_type": "bearer",
        }
        return UserResponse(**user_dict)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}",
        )


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: User = Depends(get_authenticated_user),
):
    """
    Retrieves the currently authenticated user's profile using their JWT Bearer token.
    """
    return current_user


@router.get("/me/{user_id}", response_model=UserResponse)
async def get_current_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
):
    """
    Retrieves current user status and checks for block enforcement (Legacy endpoint).
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
