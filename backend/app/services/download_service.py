import os
import uuid
from datetime import datetime, timedelta, timezone
from app.config import config  # import config z centralnego miejsca

# ⚠️ Produkcyjnie zamiast dict użyj bazy danych
download_tokens = {}  # token -> { path, expires, paid }

def save_file(image_bytes: bytes) -> str:
    """Zapisuje plik i generuje token do pobrania"""
    token = str(uuid.uuid4())
    filename = f"{token}.jpg"
    path = config.DOWNLOAD_PATH / filename  # korzystamy z config
    with open(path, "wb") as f:
        f.write(image_bytes)

    download_tokens[token] = {
        "path": str(path),  # zapisujemy ścieżkę jako string
        "expires": datetime.now(timezone.utc) + timedelta(minutes=config.TOKEN_EXPIRE_MINUTES),
        "paid": False
    }
    return token

def get_file(token: str):
    """Zwraca dane pliku po tokenie"""
    return download_tokens.get(token)

def mark_paid(token: str):
    """Oznacza token jako opłacony"""
    if token in download_tokens:
        download_tokens[token]["paid"] = True
