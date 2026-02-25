from fastapi import APIRouter, UploadFile, File, Form, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
import os
import tempfile
import logging
from app.services.image_service import process_image

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/remove-background", tags=["background"])


@router.post("/")
async def remove_background(
        background_tasks: BackgroundTasks,
        image: UploadFile = File(..., media_type="image/*"),
        bg_color: str = Form("[255,255,255]")
):
    """Remove background from uploaded image."""
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Nieprawidłowy typ pliku")

    try:
        contents = await image.read()

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            tmp_path = tmp.name

        process_image(contents, bg_color, tmp_path)
        logger.info(f"Image processed successfully")

        def cleanup():
            try:
                os.unlink(tmp_path)
            except OSError:
                pass

        background_tasks.add_task(cleanup)
        return FileResponse(
            tmp_path,
            media_type="image/png",
            filename="result.png",
            headers={"Cache-Control": "no-cache"}
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Error processing image")
        raise HTTPException(status_code=500, detail="Błąd przetwarzania obrazu")
