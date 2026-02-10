import os
import io
import json
import tempfile
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from datetime import datetime
from PIL import Image
from transparent_background import Remover

# -----------------------
# Load env and allowed origins
# -----------------------
load_dotenv()
allowed_origin = os.getenv("ALLOWED_ORIGIN", "")
allowed_origins = [o.strip() for o in allowed_origin.split(",") if o.strip()]

# -----------------------
# FastAPI app
# -----------------------
app = FastAPI(title="Remove Background & Feedback API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins or ["*"],  # jeśli brak env, pozwól wszystkim
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Background remover
# -----------------------
remover = Remover()
MAX_DIMENSION = 5000

def parse_bg_color(bg_color: str):
    try:
        if bg_color.startswith("[") and bg_color.endswith("]"):
            bg_list = json.loads(bg_color)
        else:
            bg_list = [int(x) for x in bg_color.split(",")]
        bg_list = [max(0, min(255, int(c))) for c in bg_list[:4]]
        while len(bg_list) < 4:
            bg_list.append(255)
        return tuple(bg_list)
    except Exception:
        return (255, 255, 255, 255)


FEEDBACK_FILE = "feedback.txt"
ADMIN_KEY = os.getenv("ADMIN_KEY")  # domyślne hasło: 123

# -----------------------
# Dodawanie opinii
# -----------------------
@app.post("/api/feedback")
async def submit_feedback(request: Request):
    print("feedback endpoint hit")
    data = await request.json()
    message = data.get("message")
    if not message:
        return {"status": "error", "detail": "Brak wiadomości"}

    from datetime import datetime
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {"timestamp": now, "message": message}

    with open(FEEDBACK_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")

    return {"status": "ok"}


# -----------------------
# Podgląd opinii (po haśle)
# -----------------------
@app.get("/api/feedback/view/{key}")
async def view_feedback(key: str):
    if key != ADMIN_KEY:
        return {"status": "error", "feedbacks": []}

    feedbacks = []
    try:
        with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
            for line in f:
                feedbacks.append(json.loads(line))
    except FileNotFoundError:
        pass

    return {"status": "ok", "feedbacks": feedbacks}

# -----------------------
# Remove background endpoint
# -----------------------
@app.post("/remove-background/")
async def remove_background(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    bg_color: str = Form("[255,255,255]"),
):
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")

        if img.width > MAX_DIMENSION or img.height > MAX_DIMENSION:
            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION))
            print(f"Image resized to {img.size} to save memory.")

        result = remover.process(img, type="rgba").convert("RGBA")
        bg_tuple = parse_bg_color(bg_color)
        background = Image.new("RGBA", result.size, bg_tuple)
        composed = Image.alpha_composite(background, result)

        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as tmp:
            composed.save(tmp.name, format="PNG")
            tmp_path = tmp.name

        # Usuń plik po wysłaniu
        background_tasks.add_task(lambda: os.remove(tmp_path))
        print(f"Processed image {image.filename}, size {img.size}")

        return FileResponse(tmp_path, media_type="image/png", filename="result.png")

    except Exception as e:
        print("Error processing image")
        return JSONResponse(content={"error": str(e)}, status_code=500)

# -----------------------
# Ping
# -----------------------
@app.get("/ping")
def ping():
    print("Ping received")
    return {"message": "Server is running!"}

# -----------------------
# # Run server
# # -----------------------
# if __name__ == "__main__":
#     import uvicorn
#     port = int(os.environ.get("PORT", 8000))
#     print(f"Starting server on 0.0.0.0:{port}")
#     uvicorn.run("main:app", host="0.0.0.0", port=port, log_level="info")
