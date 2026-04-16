from fastapi import APIRouter, HTTPException, Header, UploadFile, File
from fastapi.responses import FileResponse
from app.services.download_service import get_file, save_file
import os
from starlette.responses import JSONResponse
from app.config import config

router = APIRouter(prefix="/api/download", tags=["download"])

@router.get("/{token}")
async def download_file(
    token: str,
    x_admin_token: str | None = Header(None, alias="X-Admin-Token")  # ✅ alias!
):
    data = get_file(token)
    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    # 🔥 ADMIN BYPASS – TEN SAM klucz!
    if not data.get("paid", False) and x_admin_token != config.ADMIN_DOWNLOAD_KEY:
        raise HTTPException(status_code=403, detail="Płatność nie została zakończona")

    path = data["path"]
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")

    # ✅ Fix: Explicitly set headers for better browser compatibility
    return FileResponse(
        path, 
        media_type="image/jpeg", 
        headers={"Content-Disposition": 'attachment; filename="photo_sheet.jpg"'},
        filename="photo_sheet.jpg"
    )

@router.post("/create")
async def create_download(
    image: UploadFile = File(...),
    x_admin_token: str | None = Header(None, alias="X-Admin-Token")  # ✅ alias!
):
    """Zapisuje plik i generuje token do pobrania"""
    try:
        file_bytes = await image.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Brak danych pliku")

        # 🔥 ADMIN BYPASS – TEN SAM klucz!
        is_admin = x_admin_token == config.ADMIN_DOWNLOAD_KEY

        # zapis pliku i wygenerowanie tokena
        token = save_file(file_bytes, is_admin=is_admin)
        return JSONResponse({"token": token})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))