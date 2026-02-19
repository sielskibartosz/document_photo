import base64
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException, Header
from fastapi.responses import FileResponse
from app.services.download_service import get_file
import os

from app.models import CreateDownloadRequest
from starlette.responses import JSONResponse
from app.config import config

from app.services.download_service import download_tokens

from app.services.download_service import save_file

router = APIRouter(prefix="/api/download", tags=["download"])


@router.get("/{token}")
async def download_file(token: str, x_admin_token: str | None = Header(None)):
    data = get_file(token)
    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    # ADMIN BYPASS
    if not data.get("paid", False) and x_admin_token != os.getenv("ADMIN_SECRET"):
        raise HTTPException(status_code=403, detail="Płatność nie została zakończona")

    path = data["path"]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")

    return FileResponse(path, media_type="image/jpeg", filename="photo_sheet.jpg")


@router.post("/create")
async def create_download(body: CreateDownloadRequest, x_admin_token: str | None = Header(None)):
    """Zapisuje plik i generuje token do pobrania"""

    print("QQQQQQQQQQQQQQ", os.getenv("ADMIN_SECRET"))
    try:
        # dekodowanie base64
        if "," in body.image_base64:
            _, encoded = body.image_base64.split(",", 1)
        else:
            encoded = body.image_base64
        file_bytes = base64.b64decode(encoded)

        # czy admin?
        is_admin = x_admin_token == os.getenv("ADMIN_SECRET")

        # zapis pliku i wygenerowanie tokena
        token = save_file(file_bytes, is_admin=is_admin)

        return JSONResponse({"token": token})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
