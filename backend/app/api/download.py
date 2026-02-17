import base64
import uuid
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.download_service import get_file
import os

from app.models import CreateDownloadRequest
from starlette.responses import JSONResponse
from app.config import config

from app.services.download_service import download_tokens

router = APIRouter(prefix="/api/download", tags=["download"])

@router.get("/{token}")
async def download_file(token: str):
    data = get_file(token)
    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")
    if not data.get("paid", False):
        raise HTTPException(status_code=403, detail="Płatność nie została zakończona")
    path = data["path"]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")
    return FileResponse(path, media_type="image/jpeg", filename="photo_sheet.jpg")


@router.post("/create")
async def create_download(body: CreateDownloadRequest):
    """Zapisuje plik i generuje token do pobrania"""
    try:
        # dekodowanie base64
        if "," in body.image_base64:
            _, encoded = body.image_base64.split(",", 1)
        else:
            encoded = body.image_base64
        file_bytes = base64.b64decode(encoded)

        # generujemy token
        token = str(uuid.uuid4())
        filename = f"{token}.jpg"
        path = os.path.join(config.DOWNLOAD_DIR, filename)

        # zapis pliku
        with open(path, "wb") as f:
            f.write(file_bytes)

        # zapis tokena
        download_tokens[token] = {
            "path": path,
            "expires": datetime.now(timezone.utc) + timedelta(minutes=config.TOKEN_EXPIRE_MINUTES),
            "paid": False
        }

        return JSONResponse({"token": token})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
