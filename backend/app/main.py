from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import base64
from rembg import remove
from .utils import hex_to_rgba

app = FastAPI(title="Background Remover API")

# --- CORS ---
origins = [
    "https://sielskibartosz.github.io",   # GitHub Pages
    "https://photoidcreator.com",             # Twoja domena (jak podepniesz)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # na produkcji lepiej podać listę frontendu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-background/")
async def remove_background(
    image: UploadFile = File(...),
    bg_color: str = Form("#ffffff")
):
    if not image:
        raise HTTPException(status_code=400, detail="No image provided")

    input_image = Image.open(io.BytesIO(await image.read())).convert("RGBA")
    output_image = remove(input_image)
    bg_color_rgba = hex_to_rgba(bg_color)
    bg = Image.new("RGBA", output_image.size, bg_color_rgba)
    bg.paste(output_image, mask=output_image.split()[3])

    buffered = io.BytesIO()
    bg.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return JSONResponse(content={"image_no_bg": img_str})

@app.get("/ping/")
async def ping():
    return JSONResponse(content={"Status": "okey"})