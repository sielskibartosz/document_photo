# download_service.py
# Tokeny trzymane sa na dysku (obok pliku), zeby przetrwaly restart serwera
# i byly widoczne dla wszystkich workerow korzystajacych z tego samego katalogu.
import json
import logging
import os
import re
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.config import config

logger = logging.getLogger(__name__)

TOKEN_RE = re.compile(r"^[0-9a-f-]{36}$")


def _image_path(token: str) -> str:
    return os.path.join(config.DOWNLOAD_DIR, f"{token}.jpg")


def _meta_path(token: str) -> str:
    return os.path.join(config.DOWNLOAD_DIR, f"{token}.json")


def _write_meta(token: str, meta: dict) -> None:
    tmp = _meta_path(token) + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(meta, f)
    os.replace(tmp, _meta_path(token))


def _read_meta(token: str) -> Optional[dict]:
    if not TOKEN_RE.match(token):
        return None
    try:
        with open(_meta_path(token), "r", encoding="utf-8") as f:
            meta = json.load(f)
        meta["expires"] = datetime.fromisoformat(meta["expires"])
        return meta
    except (FileNotFoundError, ValueError, KeyError):
        return None


def save_file(image_bytes: bytes, is_admin: bool = False) -> str:
    """Zapisuje plik i generuje token do pobrania"""
    token = str(uuid.uuid4())
    path = _image_path(token)

    with open(path, "wb") as f:
        f.write(image_bytes)

    _write_meta(token, {
        "path": path,
        "expires": (datetime.now(timezone.utc) + timedelta(minutes=config.TOKEN_EXPIRE_MINUTES)).isoformat(),
        "paid": is_admin,  # jeśli admin, od razu oznaczone jako opłacone
    })
    logger.info("Created download token: %s", token)
    return token


def get_file(token: str) -> Optional[dict]:
    """Zwraca dane pliku po tokenie (None gdy brak lub wygasl)"""
    meta = _read_meta(token)
    if not meta or datetime.now(timezone.utc) > meta["expires"]:
        return None
    return meta


def mark_paid(token: str) -> bool:
    """Oznacza token jako opłacony i wydluza waznosc pliku. Zwraca False gdy token nie istnieje."""
    meta = _read_meta(token)
    if not meta or not os.path.exists(meta["path"]):
        return False
    meta["paid"] = True
    paid_expires = datetime.now(timezone.utc) + timedelta(minutes=config.PAID_TOKEN_EXPIRE_MINUTES)
    meta["expires"] = max(meta["expires"], paid_expires).isoformat()
    _write_meta(token, meta)
    return True


def remove_expired() -> None:
    """Usuwa wygasle tokeny oraz pliki bez metadanych (np. z poprzednich wersji)."""
    now = datetime.now(timezone.utc)
    for name in os.listdir(config.DOWNLOAD_DIR):
        token, ext = os.path.splitext(name)
        full = os.path.join(config.DOWNLOAD_DIR, name)
        if ext == ".json":
            meta = _read_meta(token)
            if meta is None or now > meta["expires"]:
                for p in (_image_path(token), full):
                    try:
                        os.remove(p)
                    except FileNotFoundError:
                        pass
                    except OSError as e:
                        logger.warning("[cleanup] Failed to remove %s: %s", p, e)
        elif ext == ".jpg" and not os.path.exists(_meta_path(token)):
            # osierocony plik - usuwamy, jesli jest starszy niz czas waznosci tokena
            age = now.timestamp() - os.path.getmtime(full)
            if age > config.TOKEN_EXPIRE_MINUTES * 60:
                try:
                    os.remove(full)
                except OSError as e:
                    logger.warning("[cleanup] Failed to remove %s: %s", full, e)
