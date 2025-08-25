from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from transparent_background import Remover
import io, base64, json, gc
from tempfile import NamedTemporaryFile

app = FastAPI(title="Remove Background API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # zmień na frontend np. ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- model ---
remover = Remover(model="u2netp")  # lżejszy model

MAX_SIZE = (1024, 1024)  # max rozmiar obrazu

@app.post("/remove-background/")
async def remove_background(
        image: UploadFile = File(...),
        bg_color: str = Form("[255,255,255]")  # domyślnie białe tło
):
    try:
        # 1. Wczytaj obraz
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")

        # 2. Zmniejsz obraz jeśli jest duży
        img.thumbnail(MAX_SIZE, Image.ANTIALIAS)

        # 3. Usuń tło
        result = remover.process(img, type="rgba").convert("RGBA")

        # 4. Sparsuj kolor tła
        try:
            if bg_color.startswith("[") and bg_color.endswith("]"):
                bg_list = json.loads(bg_color)
            else:
                bg_list = [int(x) for x in bg_color.split(",")]
            if len(bg_list) == 3:
                bg_list.append(255)
            bg_tuple = tuple(bg_list)
        except Exception:
            bg_tuple = (255, 255, 255, 255)

        # 5. Stwórz tło i nałóż wycięty obraz
        background = Image.new("RGBA", result.size, bg_tuple)
        background.paste(result, mask=result.getchannel("A"))

        # 6. Konwersja do base64 przez tymczasowy plik
        with NamedTemporaryFile(suffix=".png") as tmp:
            background.save(tmp.name, format="PNG")
            tmp.seek(0)
            b64 = base64.b64encode(tmp.read()).decode("utf-8")

        # 7. Zwolnij pamięć
        del img, result, background
        gc.collect()

        return JSONResponse(content={"image": b64})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/ping")
def ping():
    return {"message": "Server is running!"}
