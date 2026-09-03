import os
import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

try:
    from app.config.settings import settings
    def get_jwt_secret() -> str:
        return getattr(settings, "JWT_SECRET_KEY", "mentorx-super-secure-production-jwt-secret-key-32-bytes-min!")
    def get_jwt_algo() -> str:
        return getattr(settings, "JWT_ALGORITHM", "HS256")
    def get_jwt_expire() -> int:
        return getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7)
except Exception:
    def get_jwt_secret() -> str:
        return os.getenv("JWT_SECRET_KEY", "mentorx-super-secure-production-jwt-secret-key-32-bytes-min!")
    def get_jwt_algo() -> str:
        return os.getenv("JWT_ALGORITHM", "HS256")
    def get_jwt_expire() -> int:
        return int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7)))


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Creates a cryptographically signed JWT access token containing claims
    like user_id, email, and role.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=get_jwt_expire())

    to_encode.update({
        "exp": expire,
        "iat": now,
    })

    encoded_jwt = jwt.encode(
        to_encode,
        get_jwt_secret(),
        algorithm=get_jwt_algo(),
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and cryptographically verifies a JWT token.
    Returns payload dictionary if valid, or None if expired or invalid.
    """
    try:
        payload = jwt.decode(
            token,
            get_jwt_secret(),
            algorithms=[get_jwt_algo()],
        )
        return payload
    except (jwt.PyJWTError, Exception):
        return None
