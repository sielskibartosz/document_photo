# download_service.py
import os
import uuid
from datetime import datetime, timedelta, timezone
from app.config import config

download_tokens = {}  # token -> { path, expires, paid }


def save_file(image_bytes: bytes, is_admin: bool = False) -> str:
    """Zapisuje plik i generuje token do pobrania"""
    token = str(uuid.uuid4())
    filename = f"{token}.jpg"
    path = os.path.join(config.DOWNLOAD_DIR, filename)

    with open(path, "wb") as f:
        f.write(image_bytes)

    download_tokens[token] = {
        "path": path,
        "expires": datetime.now(timezone.utc) + timedelta(minutes=config.TOKEN_EXPIRE_MINUTES),
        "paid": is_admin  # jeśli admin, od razu oznaczone jako opłacone
    }
    print("✅ Created download token:", token)
    print("Available tokens:", list(download_tokens.keys()))
    return token


def get_file(token: str):
    """Zwraca dane pliku po tokenie"""
    return download_tokens.get(token)


def mark_paid(token: str):
    """Oznacza token jako opłacony"""
    if token in download_tokens:
        download_tokens[token]["paid"] = True
