from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from rembg import remove, new_session
from PIL import Image, ImageFilter
import io
import base64

app = FastAPI(title="Remove Background API 1.2")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # możesz ograniczyć do frontendów np. ["https://photoidcreator.com"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Tworzymy sesję z pełnym modelem u2net (dokładniejsze tło) ---
session = new_session("u2net")

@app.post("/remove-background/")
async def remove_background(
    image: UploadFile = File(...),
    bg_color: str = Form("#ffffff")
):
    try:
        # --- Wczytanie obrazu ---
        image_bytes = await image.read()
        input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

        # --- Skalowanie dużych obrazów dla lepszej jakości ---
        max_dim = 1024
        w, h = input_image.size
        scale = min(max_dim / w, max_dim / h, 1.0)
        if scale < 1.0:
            input_image = input_image.resize((int(w*scale), int(h*scale)), Image.LANCZOS)

        # --- Usunięcie tła ---
        output_image = remove(input_image, session=session)

        # --- Wygładzenie krawędzi (delikatne rozmycie alfa) ---
        alpha = output_image.split()[3]
        alpha = alpha.filter(ImageFilter.GaussianBlur(1))
        output_image.putalpha(alpha)

        # --- Dodanie jednolitego tła ---
        if bg_color:
            bg_image = Image.new("RGBA", output_image.size, bg_color)
            output_image = Image.alpha_composite(bg_image, output_image)

        # --- Konwersja do base64 ---
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
