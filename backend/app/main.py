import os

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from transparent_background import Remover
import io, base64
import json
from dotenv import load_dotenv

app = FastAPI(title="Remove Background API")

load_dotenv()
allowed_origin = os.getenv("ALLOWED_ORIGIN").split(",")
# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,  # lub podaj frontend np. ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- model ---
remover = Remover()  # domyślnie U2Net
@app.post("/remove-background/")
async def remove_background(
    image: UploadFile = File(...),
    bg_color: str = Form('[255,255,255]')
):
    try:
        # Wczytaj obraz
        img = Image.open(io.BytesIO(await image.read())).convert("RGB")

        # Usuń tło
        result = remover.process(img, type=bg_color)

        # Konwersja do base64
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode("utf-8")

        return JSONResponse(content={"image": b64})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/ping")
def ping():
    return {"message": "Server is running!"}