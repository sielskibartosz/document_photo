import os
import asyncio
import json
from datetime import datetime, timezone
from typing import List, Dict, Any
from PIL import Image
import io
from app.config import config
from fastapi import FastAPI
from transparent_background import Remover

# 🔹 słownik tokenów do pobierania arkuszy
download_tokens: dict[str, dict] = {}

remover = Remover()


# -------------------------
# IMAGE SERVICE
# -------------------------
def parse_bg_color(bg_color: str) -> tuple[int, int, int, int]:
    """Parse background color from string to RGBA tuple."""
    try:
        if bg_color.startswith("[") and bg_color.endswith("]"):
            bg_list = json.loads(bg_color)
        else:
            bg_list = [int(x.strip()) for x in bg_color.split(",")]

        bg_list = [max(0, min(255, int(c))) for c in bg_list[:4]]
        while len(bg_list) < 4:
            bg_list.append(255)
        return tuple(bg_list)
    except (ValueError, json.JSONDecodeError):
        return (255, 255, 255, 255)


def process_image(image_content: bytes, bg_color: str, output_path: str) -> None:
    """Process image to remove background and save result."""
    img = Image.open(io.BytesIO(image_content)).convert("RGB")

    # Resize if too large
    if img.width > config.MAX_DIMENSION or img.height > config.MAX_DIMENSION:
        img.thumbnail((config.MAX_DIMENSION, config.MAX_DIMENSION))

    # Remove background
    result = remover.process(img, type="rgba").convert("RGBA")
    bg_tuple = parse_bg_color(bg_color)
    background = Image.new("RGBA", result.size, bg_tuple)
    composed = Image.alpha_composite(background, result)

    # Save result
    composed.save(output_path, format="PNG")


# -------------------------
# FEEDBACK SERVICE
# -------------------------
def save_feedback(message: str) -> None:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = {"timestamp": now, "message": message}

    with open(config.FEEDBACK_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
        f.flush()


def load_feedbacks() -> List[Dict[str, Any]]:
    feedbacks = []
    try:
        with open(config.FEEDBACK_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    feedbacks.append(json.loads(line))
    except FileNotFoundError:
        pass
    return feedbacks


# -------------------------
# CLEANUP SERVICE
# -------------------------
async def cleanup_expired_files(app: FastAPI):
    while True:
        now = datetime.now(timezone.utc)
        expired_tokens = []

        tokens = app.state.download_tokens
        print(f"[cleanup] Tokens: {list(tokens.keys())}")

        for token, data in list(tokens.items()):
            if now > data["expires"]:
                path = data["path"]
                if os.path.exists(path):
                    try:
                        os.remove(path)
                        print(f"[cleanup] Removed file: {path}")
                    except Exception as e:
                        print(f"[cleanup] Failed to remove {path}: {e}")
                expired_tokens.append(token)

        for token in expired_tokens:
            tokens.pop(token, None)
            print(f"[cleanup] Removed token: {token}")

        await asyncio.sleep(20)  # co 10 minut

