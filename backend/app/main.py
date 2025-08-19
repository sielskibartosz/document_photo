from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
from rembg import remove
import io
from .utils import hex_to_rgba  # zostaw jak miałeś

app = FastAPI(title="Background Remover API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://photoidcreator.com", "https://document-photo.onrender.com"],  # albo ["*"] dla testów
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

    # Wczytaj i usuń tło
    input_image = Image.open(io.BytesIO(await image.read())).convert("RGBA")
    output_image = remove(input_image)

    # Dodaj kolor tła
    bg_color_rgba = hex_to_rgba(bg_color)
    bg = Image.new("RGBA", output_image.size, bg_color_rgba)
    bg.paste(output_image, mask=output_image.split()[3])

    # Zapisz jako PNG i zwróć jako binarny strumień
    buffered = io.BytesIO()
    bg.save(buffered, format="PNG")
    buffered.seek(0)

    return StreamingResponse(buffered, media_type="image/png")
