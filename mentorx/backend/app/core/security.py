import os
import json
import base64
import hmac
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

try:
    import jwt
except ImportError:
    jwt = None

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


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64_decode(data: str) -> bytes:
    padding = 4 - (len(data) % 4)
    if padding != 4:
        data += "=" * padding
    return base64.urlsafe_b64decode(data.encode("utf-8"))


def create_access_token(
    data: Dict[str, Any],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Creates a cryptographically signed JWT access token containing claims
    like user_id, email, and role. Uses PyJWT when available, with a
    built-in standard library HMAC-SHA256 fallback.
    """
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=get_jwt_expire())

    to_encode.update({
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
    })

    if jwt is not None:
        return jwt.encode(
            to_encode,
            get_jwt_secret(),
            algorithm=get_jwt_algo(),
        )

    # Standard library fallback: RFC 7519 HMAC-SHA256 JWT
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _b64_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64_encode(json.dumps(to_encode, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(
        get_jwt_secret().encode("utf-8"),
        signing_input,
        hashlib.sha256,
    ).digest()
    sig_b64 = _b64_encode(signature)
    return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and cryptographically verifies a JWT token.
    Returns payload dictionary if valid, or None if expired or invalid.
    """
    if not token or not isinstance(token, str):
        return None

    if jwt is not None:
        try:
            return jwt.decode(
                token,
                get_jwt_secret(),
                algorithms=[get_jwt_algo()],
            )
        except Exception:
            return None

    # Standard library fallback verification
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        header_b64, payload_b64, sig_b64 = parts
        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(
            get_jwt_secret().encode("utf-8"),
            signing_input,
            hashlib.sha256,
        ).digest()

        actual_sig = _b64_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None

        payload_bytes = _b64_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))

        # Expiration verification
        exp = payload.get("exp")
        if exp is not None:
            now_ts = int(datetime.now(timezone.utc).timestamp())
            if now_ts > int(exp):
                return None

        return payload
    except Exception:
        return None
