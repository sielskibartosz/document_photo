from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from transparent_background import Remover
import io, base64, json, gc

app = FastAPI(title="Remove Background API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # możesz tu wstawić frontend np. ["http://localhost:3000"]
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
        del contents  # zwalniamy pamięć
        gc.collect()

        # 2. Usuń tło
        result = remover.process(img, type="rgba").convert("RGBA")
        del img  # zwalniamy pamięć
        gc.collect()

        # 3. Parsowanie koloru tła
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

        # 4. Nałóż tło
        background = Image.new("RGBA", result.size, bg_tuple)
        background.paste(result, mask=result.getchannel("A"))
        del result
        gc.collect()

        # 5. Konwersja do base64
        buf = io.BytesIO()
        background.save(buf, format="PNG")
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")
        del background, buf
        gc.collect()

        return JSONResponse(content={"image": b64})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/ping")
def ping():
    return {"message": "Server is running!"}
