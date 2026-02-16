from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import os
import uuid
import base64
from fastapi import Request

from app.services import download_tokens

router = APIRouter(prefix="/api/download", tags=["download"])

DOWNLOAD_DIR = "downloads"
TOKEN_EXPIRE_MINUTES = 10

os.makedirs(DOWNLOAD_DIR, exist_ok=True)


class DownloadRequest(BaseModel):
    image_base64: str


@router.post("/create")
async def create_download(request: DownloadRequest):
    try:
        header, encoded = request.image_base64.split(",", 1)
        file_bytes = base64.b64decode(encoded)

        token = str(uuid.uuid4())
        filename = f"{token}.jpg"
        path = os.path.join(DOWNLOAD_DIR, filename)

        with open(path, "wb") as f:
            f.write(file_bytes)

        request.app.state.download_tokens[token] = {
            "path": path,
            "expires": datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES),
            "used": False
        }

        return {"url": f"/api/download/{token}"}

    except Exception:
        raise HTTPException(status_code=500, detail="Nie udało się utworzyć pliku")


@router.get("/{token}")
async def download_file(token: str, background_tasks: BackgroundTasks, request: Request):
    data = request.app.state.download_tokens.get(token)


    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    if data["used"]:
        raise HTTPException(status_code=403, detail="Link został już użyty")

    # ✅ porównanie z timezone-aware datetime
    if datetime.now(timezone.utc) > data["expires"]:
        raise HTTPException(status_code=403, detail="Link wygasł")

    path = data["path"]

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")

    data["used"] = True
    download_tokens.pop(token, None)

    # 🔥 jeśli chcesz usunąć plik po pobraniu, odkomentuj poniższe:
    # background_tasks.add_task(os.remove, path)

    return FileResponse(
        path,
        media_type="image/jpeg",
        filename="photo_sheet.jpg"
    )
