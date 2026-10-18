from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from starlette.concurrency import run_in_threadpool
import os
import tempfile
import logging
from app.config import config
from app.services.image_service import process_image

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/remove-background", tags=["background"])


def _unlink(path: str) -> None:
    try:
        os.unlink(path)
    except OSError:
        pass


@router.post("/")
async def remove_background(
        background_tasks: BackgroundTasks,
        image: UploadFile = File(..., media_type="image/*"),
        bg_color: str = Form("[255,255,255]")
):
    """Remove background from uploaded image."""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Nieprawidłowy typ pliku")

    contents = await image.read(config.MAX_UPLOAD_BYTES + 1)
    if len(contents) > config.MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Plik jest zbyt duży")

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
        tmp_path = tmp.name

    try:
        # model jest ciezki (CPU/GPU) - nie blokujemy petli zdarzen
        await run_in_threadpool(process_image, contents, bg_color, tmp_path)
        logger.info("Image processed successfully")
    except Exception:
        _unlink(tmp_path)
        logger.exception("Error processing image")
        raise HTTPException(status_code=500, detail="Błąd przetwarzania obrazu")

    background_tasks.add_task(_unlink, tmp_path)
    return FileResponse(
        tmp_path,
        media_type="image/png",
        filename="result.png",
        headers={"Cache-Control": "no-cache"}
    )
