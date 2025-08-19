import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from rembg import remove
from PIL import Image
import io
import base64
from urllib.request import urlretrieve

# --- Ustawienia modelu ---
MODEL_DIR = "/opt/render/.u2net"
MODEL_PATH = os.path.join(MODEL_DIR, "u2net.onnx")
MODEL_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx"

os.makedirs(MODEL_DIR, exist_ok=True)

if not os.path.exists(MODEL_PATH):
    print("Pobieranie modelu u2net.onnx...")
    urlretrieve(MODEL_URL, MODEL_PATH)
    print("Model pobrany!")

# --- FastAPI ---
app = FastAPI(title="Remove Background API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://photoidcreator.com", "https://document-photo.onrender.com"],  # lub lista frontendów np. ["https://photoidcreator.com"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoint do usuwania tła ---
@app.post("/remove-background/")
async def remove_background(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

        output_image = remove(input_image)

        buf = io.BytesIO()
        output_image.save(buf, format="PNG")
        base64_image = base64.b64encode(buf.getvalue()).decode("utf-8")

        return JSONResponse(content={"image": base64_image})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# --- Ping ---
@app.get("/ping")
def ping():
    return {"message": "Server is running!"}

