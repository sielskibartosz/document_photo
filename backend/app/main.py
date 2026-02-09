import os
import io
import json
import tempfile
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image
from transparent_background import Remover
import logging
from .helpers import parse_bg_color
import sys
print(sys.path)


# --- Setup ---
app = FastAPI(title="Remove Background API")
load_dotenv()
allowed_origin = os.getenv("ALLOWED_ORIGIN", "").split(",")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Logger ---
logger = logging.getLogger("uvicorn")

# --- Model ---
remover = Remover()  # default U2Net

# --- Constants ---
MAX_DIMENSION = 5000  # Max width/height to limit memory usage


@app.post("/remove-background/")
async def remove_background(
        background_tasks: BackgroundTasks,
        image: UploadFile = File(...),
        bg_color: str = Form("[255,255,255]"),
):
    try:
        # --- Read image ---
        contents = await image.read()
        try:
            img = Image.open(io.BytesIO(contents))
            img.verify()  # Validate image
            img = Image.open(io.BytesIO(contents)).convert("RGB")  # Reopen for processing
        except Exception:
            return JSONResponse(content={"error": "Invalid image"}, status_code=400)

        # --- Resize if too large ---
        if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
            logger.info(f"Image resized to {img.size} to save memory.")

        # --- Remove background ---
        result = remover.process(img, type="rgba").convert("RGBA")

        # --- Parse background color ---
        bg_tuple = parse_bg_color(bg_color)

        # --- Composite over background ---
        background = Image.new("RGBA", result.size, bg_tuple)
        composed = Image.alpha_composite(background, result)

        # --- Save to temp file ---
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            composed.save(tmp.name, format="PNG")
            tmp_path = tmp.name

        # --- Schedule deletion ---
        background_tasks.add_task(lambda: os.remove(tmp_path))
        logger.info(f"Processed image {image.filename}, size {img.size}")

        # --- Return file ---
        return FileResponse(tmp_path, media_type="image/png", filename="result.png")

    except Exception as e:
        logger.exception("Error processing image")
        return JSONResponse(content={"error": str(e)}, status_code=500)


# @app.post("/save-sheet")
# async def save_sheet(sheet: UploadFile = File(...)):
#     with open("sheet.jpg", "wb") as f:
#         shutil.copyfileobj(sheet.file, f)
#     return {"status": "ok"}
#
#
# @app.get("/download-sheet")
# def download_sheet():
#     return FileResponse(
#         path="sheet.jpg",  # plik wcześniej zapisany
#         media_type="image/jpeg",
#         filename="photo.jpg"
#     )


@app.get("/ping")
def ping():
    return {"message": "Server is running!"}
