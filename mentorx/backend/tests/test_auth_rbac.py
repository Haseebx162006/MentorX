import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from datetime import timedelta
from app.core.security import create_access_token, decode_access_token


def test_jwt_create_and_decode_valid_token():
    payload = {
        "sub": "usr_test123",
        "email": "student@mentorx.edu",
        "role": "student",
    }
    token = create_access_token(payload, expires_delta=timedelta(minutes=15))
    assert isinstance(token, str)
    assert len(token) > 20

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "usr_test123"
    assert decoded["email"] == "student@mentorx.edu"
    assert decoded["role"] == "student"
    assert "exp" in decoded


def test_jwt_expired_token_returns_none():
    payload = {"sub": "usr_expired"}
    # Token expired 1 minute ago
    expired_token = create_access_token(payload, expires_delta=timedelta(minutes=-1))
    decoded = decode_access_token(expired_token)
    assert decoded is None


def test_jwt_tampered_token_returns_none():
    payload = {"sub": "usr_tampered", "role": "student"}
    token = create_access_token(payload)
    # Tamper with token signature
    tampered_token = token[:-5] + "abcde"
    decoded = decode_access_token(tampered_token)
    assert decoded is None


if __name__ == "__main__":
    test_jwt_create_and_decode_valid_token()
    test_jwt_expired_token_returns_none()
    test_jwt_tampered_token_returns_none()
    print("✓ All JWT security tests passed successfully!")
