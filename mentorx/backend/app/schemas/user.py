from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class GoogleAuthRequest(BaseModel):
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    study_track: Optional[str] = "Pre-Medical"
    token: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    name: str
    avatar: Optional[str] = None
    role: str = "student"
    study_track: str = "Pre-Medical"


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar: Optional[str] = None
    role: str
    study_track: str
    is_blocked: bool
    created_at: Optional[datetime] = None
    last_active: Optional[datetime] = None
    access_token: Optional[str] = None
    token_type: Optional[str] = "bearer"

    model_config = ConfigDict(from_attributes=True)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class BlockStatusRequest(BaseModel):
    is_blocked: bool


class DashboardStatsResponse(BaseModel):
    total_users: int
    active_users: int
    blocked_users: int
    total_documents: int
    total_indexed_chunks: int
