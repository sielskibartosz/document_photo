# app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from PIL import Image
import io
from transparent_background import Remover

app = FastAPI(title="Background Removal API")

# Wczytujemy model raz przy starcie aplikacji
remover = Remover(mode="fast", resize="static", device="cpu")  # CPU-only, tryb lekki


@app.post("/remove-background/")
async def remove_background(file: UploadFile = File(...)):
    # Odczytujemy obraz z przesłanego pliku
    img = Image.open(file.file).convert("RGB")

    # Przetwarzamy obraz
    result = remover.process(img, type="rgba")

    # Zapis do bufora w pamięci
    buf = io.BytesIO()
    result.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
