from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from fastapi.responses import FileResponse
from app.services.download_service import get_file, save_file
import logging
import os
from starlette.concurrency import run_in_threadpool
from starlette.responses import JSONResponse
from app.config import config

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/download", tags=["download"])

# nazwy plików, które może wybrać frontend: arkusz do druku albo samo zdjęcie do wniosku online
_DOWNLOAD_NAMES = {"photo_sheet.jpg", "photo.jpg"}

# sygnatury JPEG / PNG
_IMAGE_MAGIC = (b"\xff\xd8\xff", b"\x89PNG\r\n\x1a\n")


@router.get("/admin-check")
async def admin_check(x_admin_token: str | None = Header(None, alias="X-Admin-Token")):
    """Pozwala frontendowi pokazać, czy kod admina jest poprawny (znaczek wersji darmowej)."""
    return {"admin": config.is_admin(x_admin_token)}


@router.get("/status/{token}")
async def download_status(
    token: str,
    x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    """Pozwala frontendowi sprawdzic, czy webhook Stripe juz oznaczyl platnosc."""
    data = get_file(token)
    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")
    return {"paid": bool(data.get("paid")) or config.is_admin(x_admin_token)}


@router.get("/{token}")
async def download_file(
    token: str,
    x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    data = get_file(token)
    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    if not data.get("paid", False) and not config.is_admin(x_admin_token):
        raise HTTPException(status_code=403, detail="Płatność nie została zakończona")

    path = data["path"]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")

    return FileResponse(
        path,
        media_type="application/octet-stream",
        filename=data.get("filename", "photo_sheet.jpg")
    )


@router.post("/create")
async def create_download(
    image: UploadFile = File(...),
    x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    """Zapisuje plik i generuje token do pobrania"""
    file_bytes = await image.read(config.MAX_UPLOAD_BYTES + 1)
    if not file_bytes:
        raise HTTPException(status_code=400, detail="Brak danych pliku")
    if len(file_bytes) > config.MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Plik jest zbyt duży")
    if not file_bytes.startswith(_IMAGE_MAGIC):
        raise HTTPException(status_code=400, detail="Nieprawidłowy typ pliku")

    try:
        filename = image.filename if image.filename in _DOWNLOAD_NAMES else "photo_sheet.jpg"
        token = await run_in_threadpool(save_file, file_bytes, config.is_admin(x_admin_token), filename)
    except Exception:
        logger.exception("Error saving download file")
        raise HTTPException(status_code=500, detail="Błąd zapisu pliku")
    return JSONResponse({"token": token})
