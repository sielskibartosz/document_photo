# app/main.py
import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from PIL import Image
from transparent_background import remove
import torch

app = FastAPI(title="Document Photo API")

# Maksymalny rozmiar uploadu w bajtach (2 MB)
MAX_UPLOAD_SIZE = 2 * 1024 * 1024
# Maksymalna rozdzielczość obrazu
MAX_SIZE = (512, 512)

# Ustawienia PyTorch (CPU only)
device = torch.device("cpu")


def resize_image(image: Image.Image) -> Image.Image:
    """Zmniejsza obraz do maksymalnego rozmiaru."""
    image.thumbnail(MAX_SIZE)
    return image


@app.post("/remove-background/")
async def remove_background(file: UploadFile = File(...)):
    # Sprawdzenie rozmiaru pliku
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    # Wczytanie obrazu
    try:
        image = Image.open(tempfile.NamedTemporaryFile(delete=False, suffix=".png"))
        image = Image.open(tempfile.SpooledTemporaryFile())
        image.file.write(contents)
        image.file.seek(0)
        image = Image.open(image.file).convert("RGBA")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # Resize dla oszczędności pamięci
    image = resize_image(image)

    # Usunięcie tła (transparent_background)
    try:
        result = remove(image, device=device)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Background removal failed: {str(e)}")

    # Zapis do pliku tymczasowego
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
    result.save(tmp_file.name, format="PNG")

    return FileResponse(tmp_file.name, media_type="image/png", filename="no_bg.png")


@app.get("/")
def root():
    return JSONResponse(content={"message": "Document Photo API is running."})
