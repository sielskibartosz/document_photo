import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import requests
import base64

# --- Load .env ---
load_dotenv()
REMBG_API_KEY = os.getenv("REMBG_API_KEY")

app = FastAPI(title="Remove Background API via Rembg API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lub ogranicz do frontend np. ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

REMBG_API_URL = "https://api.rembg.com/rmbg"

@app.post("/remove-background")
async def remove_background_api(
    image: UploadFile = File(...),
    bg_color: str = Form("#ffffff")
):
    try:
        image_bytes = await image.read()
        files = {"image": (image.filename, image_bytes)}
        data = {"bg_color": bg_color}
        headers = {"x-api-key": REMBG_API_KEY}

        response = requests.post(REMBG_API_URL, files=files, data=data, headers=headers)

        if response.status_code != 200:
            return JSONResponse(
                content={"error": f"Rembg API error: {response.text}"},
                status_code=response.status_code
            )

        img_bytes = response.content
        base64_image = base64.b64encode(img_bytes).decode("utf-8")
        return JSONResponse(content={"image": base64_image})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/ping")
def ping():
    return {"message": "Server is running!"}
