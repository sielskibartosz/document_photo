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

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")


def parse_bg_color(bg_color: str):
    try:
        if bg_color.startswith("[") and bg_color.endswith("]"):
            bg_list = json.loads(bg_color)
        else:
            bg_list = [int(x) for x in bg_color.split(",")]
        bg_list = [max(0, min(255, int(c))) for c in bg_list[:4]]
        while len(bg_list) < 4:
            bg_list.append(255)
        return tuple(bg_list)
    except Exception:
        return (255, 255, 255, 255)


app = FastAPI(title="Remove Background API")
load_dotenv()
allowed_origin = os.getenv("ALLOWED_ORIGIN", "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,
    allow_methods=["*"],
    allow_headers=["*"],
)

remover = Remover()
MAX_DIMENSION = 5000


@app.post("/remove-background/")
async def remove_background(
        background_tasks: BackgroundTasks,
        image: UploadFile = File(...),
        bg_color: str = Form("[255,255,255]"),
):
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")

        if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
            logger.info(f"Image resized to {img.size} to save memory.")

        result = remover.process(img, type="rgba").convert("RGBA")
        bg_tuple = parse_bg_color(bg_color)
        background = Image.new("RGBA", result.size, bg_tuple)
        composed = Image.alpha_composite(background, result)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            composed.save(tmp.name, format="PNG")
            tmp_path = tmp.name

        background_tasks.add_task(lambda: os.remove(tmp_path))
        logger.info(f"Processed image {image.filename}, size {img.size}")

        return FileResponse(tmp_path, media_type="image/png", filename="result.png")

    except Exception as e:
        logger.exception("Error processing image")
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/ping")
def ping():
    return {"message": "Server is running!"}