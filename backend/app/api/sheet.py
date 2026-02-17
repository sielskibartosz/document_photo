
#sheet.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import os, uuid, base64

router = APIRouter(prefix="/api/download", tags=["download"])

DOWNLOAD_DIR = "downloads"
TOKEN_EXPIRE_MINUTES = 10

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

class DownloadRequest(BaseModel):
    image_base64: str

# token -> { path, expires, paid }
download_tokens = {}

@router.post("/create")
async def create_download(body: DownloadRequest):
    try:
        if "," in body.image_base64:
            _, encoded = body.image_base64.split(",", 1)
        else:
            encoded = body.image_base64

        file_bytes = base64.b64decode(encoded)
        token = str(uuid.uuid4())
        filename = f"{token}.jpg"
        path = os.path.join(DOWNLOAD_DIR, filename)

        with open(path, "wb") as f:
            f.write(file_bytes)

        # zapis tokena z paid=False
        download_tokens[token] = {
            "path": path,
            "expires": datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES),
            "paid": False
        }

        return {"token": token}  # <-- zwracamy token do umieszczenia w metadata Stripe

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{token}")
async def download_file(token: str):
    data = download_tokens.get(token)
    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    if datetime.now(timezone.utc) > data["expires"]:
        raise HTTPException(status_code=403, detail="Link wygasł")

    if not data.get("paid", False):
        raise HTTPException(status_code=403, detail="Płatność nie została zakończona")

    path = data["path"]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")

    return FileResponse(path=path, media_type="image/jpeg", filename="photo_sheet.jpg")

