from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from rembg import remove
from PIL import Image
import io
import base64

app = FastAPI(title="Remove Background API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # możesz podać listę frontendów np. ["https://photoidcreator.com"]
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove-background/")
async def remove_background(
    image: UploadFile = File(...),
    bg_color: str = Form("#ffffff")  # odbieramy kolor tła
):
    try:
        image_bytes = await image.read()
        input_image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

        # usuwamy tło
        output_image = remove(input_image)

        # wstawienie jednolitego tła
        if bg_color:
            bg_image = Image.new("RGBA", output_image.size, bg_color)
            bg_image.paste(output_image, mask=output_image)
            output_image = bg_image

        # konwersja do base64
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
