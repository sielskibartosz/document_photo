# -------------------------
# IMAGE SERVICE
# -------------------------
import json
import threading
from PIL import Image
import io
import torch
from app.config import config
from transparent_background import Remover

# liczba watkow CPU dla modelu - domyslnie tyle, ile vCPU serwera
torch.set_num_threads(config.TORCH_NUM_THREADS)

# tryb "base" - "fast" jest ~5x szybszy, ale daje widoczne artefakty na krawedziach;
# jit=True na CPU nie przyspiesza, a kompilacja trwa minuty i zuzywa duzo RAM
remover = Remover(mode="base")
# model nie jest bezpieczny do rownoleglego uzycia z wielu watkow
_remover_lock = threading.Lock()


def parse_bg_color(bg_color: str) -> tuple[int, int, int, int]:
    """Parse background color from string to RGBA tuple."""
    try:
        if bg_color.startswith("[") and bg_color.endswith("]"):
            bg_list = json.loads(bg_color)
        else:
            bg_list = [int(x.strip()) for x in bg_color.split(",")]

        if not isinstance(bg_list, list):
            raise ValueError("bg_color must be a list")
        bg_list = [max(0, min(255, int(c))) for c in bg_list[:4]]
        while len(bg_list) < 4:
            bg_list.append(255)
        return tuple(bg_list)
    except (ValueError, TypeError, json.JSONDecodeError):
        return (255, 255, 255, 255)


def process_image(image_content: bytes, bg_color: str, output_path: str) -> None:
    """Process image to remove background and save result."""
    img = Image.open(io.BytesIO(image_content)).convert("RGB")

    # Resize if too large
    if img.width > config.MAX_DIMENSION or img.height > config.MAX_DIMENSION:
        img.thumbnail((config.MAX_DIMENSION, config.MAX_DIMENSION))

    # Remove background
    with _remover_lock:
        result = remover.process(img, type="rgba").convert("RGBA")
    bg_tuple = parse_bg_color(bg_color)
    background = Image.new("RGBA", result.size, bg_tuple)
    composed = Image.alpha_composite(background, result)

    # Save result
    composed.save(output_path, format="PNG")
