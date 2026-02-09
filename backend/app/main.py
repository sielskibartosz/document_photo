import os
import io
import json
import tempfile
import asyncio
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image
from transparent_background import Remover

# ---------- helpers ----------

def parse_bg_color(bg_color: str):
    try:
        if bg_color.startswith("["):
            bg = json.loads(bg_color)
        else:
            bg = [int(x) for x in bg_color.split(",")]
        bg = [max(0, min(255, int(c))) for c in bg[:4]]
        while len(bg) < 4:
            bg.append(255)
        return tuple(bg)
    except Exception:
        return (255, 255, 255, 255)


class FileResponseWithCleanup(FileResponse):
    def __init__(self, *args, cleanup_path=None, **kwargs):
        super().__init__(*args, **kwargs)
        self.cleanup_path = cleanup_path

    async def __call__(self, scope, receive, send):
        try:
            await super().__call__(scope, receive, send)
        finally:
            if self.cleanup_path and os.path.exists(self.cleanup_path):
                os.remove(self.cleanup_path)


# ---------- app setup ----------

load_dotenv()
app = FastAPI(title="Remove Background API")

allowed_origin = os.getenv("ALLOWED_ORIGIN", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn")

# ---------- model ----------

remover = Remover()  # U2Net
MAX_DIMENSION = 5000


# ---------- endpoint ----------

@app.post("/remove-background/")
async def remove_background(
    image: UploadFile = File(...),
    bg_color: str = Form("[255,255,255]"),
):
    try:
        contents = await image.read()

        try:
            img = Image.open(io.BytesIO(contents))
            img.verify()
            img = Image.open(io.BytesIO(contents)).convert("RGB")
        except Exception:
            return JSONResponse({"error": "Invalid image"}, 400)

        if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))

        loop = asyncio.get_running_loop()
        result = await loop.run_in_executor(
            None,
            lambda: remover.process(img, type="rgba").convert("RGBA")
        )

        bg_tuple = parse_bg_color(bg_color)
        background = Image.new("RGBA", result.size, bg_tuple)
        composed = Image.alpha_composite(background, result)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            composed.save(tmp.name, format="PNG")
            tmp_path = tmp.name

        logger.info(
            f"Sending file {tmp_path}, size={os.path.getsize(tmp_path)} bytes"
        )

        return FileResponseWithCleanup(
            tmp_path,
            media_type="image/png",
            filename="result.png",
            headers={
                "Cache-Control": "no-store",
                "Content-Disposition": "attachment; filename=result.png",
            },
            cleanup_path=tmp_path,
        )

    except Exception as e:
        logger.exception("Processing error")
        return JSONResponse({"error": str(e)}, 500)


@app.get("/ping")
def ping():
    return {"status": "ok"}
