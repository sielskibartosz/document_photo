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
        bg_color: str = Form('[255,255,255]')  # string w formacie '[R,G,B]'

):
    print(bg_color)
    print(type(bg_color))
    try:
        # 1. Wczytaj obraz
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")

        # 2. Usuń tło z podanym kolorem (string '[R,G,B]')
        result = remover.process(img, type=bg_color)

        # 3. Konwersja obrazu na base64
        buf = io.BytesIO()
        result.save(buf, format="PNG")
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")

        # 4. Zwróć base64 do frontendu
        return JSONResponse(content={"image": b64})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/ping")
def ping():
    return {"message": "Server is running!"}