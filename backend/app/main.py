from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from transparent_background import Remover
import io, base64
import numpy as np
import json

app = FastAPI(title="Remove Background API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # lub podaj frontend np. ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- model ---
remover = Remover()  # domyślnie U2Net

@app.post("/remove-background/")
async def remove_background(
    image: UploadFile = File(...),
    bg_color: str = Form("[255,255,255]")  # domyślnie białe tło
):
    try:
        # 1. Wczytaj obraz
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")

        # 2. Usuń tło
        out = remover.process(img, type="rgba")

        # 3. Upewnij się, że mamy RGBA
        if isinstance(out, Image.Image):
            result = out.convert("RGBA")
        else:
            out = np.array(out, dtype=np.uint8)
            if out.shape[2] == 3:
                alpha = np.full((out.shape[0], out.shape[1], 1), 255, dtype=np.uint8)
                out = np.concatenate([out, alpha], axis=2)
            result = Image.fromarray(out, "RGBA")

        # 4. Sparsuj kolor tła
        try:
            bg_list = json.loads(bg_color)
            if len(bg_list) == 3:
                bg_list.append(255)
            bg_tuple = tuple(bg_list)
        except:
            bg_tuple = (255, 255, 255, 255)

        # 5. Stwórz tło i nałóż wycięty obraz
        background = Image.new("RGBA", result.size, bg_tuple)
        background.paste(result, mask=result.split()[3])

        # 6. Konwersja do base64
        buf = io.BytesIO()
        background.save(buf, format="PNG")
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")

        return JSONResponse(content={"image": b64})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/ping")
def ping():
    return {"message": "Server is running!"}
