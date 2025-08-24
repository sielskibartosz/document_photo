from PIL import Image
from transparent_background import Remover
import numpy as np

# 1. Załaduj model
remover = Remover()  # domyślnie u2net

# 2. Otwórz obraz (podmień ścieżkę na swój plik)
img = Image.open("twarz-podklad.jpg").convert("RGB")

# 3. Usuń tło -> wymuś typ 'rgba'
out = remover.process(img, type="rgba")

# upewnij się, że mamy np.uint8 i 4 kanały
if isinstance(out, Image.Image):
    result = out.convert("RGBA")
else:
    out = np.array(out, dtype=np.uint8)
    if out.shape[2] == 3:
        # dodaj kanał alfa
        alpha = np.full((out.shape[0], out.shape[1], 1), 255, dtype=np.uint8)
        out = np.concatenate([out, alpha], axis=2)
    result = Image.fromarray(out, "RGBA")

# 4. Stwórz białe tło w tym samym rozmiarze
white_bg = Image.new("RGB", result.size, (255, 255, 255))

# 5. Nałóż wycięty obraz na białe tło (kanał alfa jako maska)
white_bg.paste(result, mask=result.split()[3])

# 6. Zapisz wynik
white_bg.save("output_white.jpg", "JPEG")

print("Gotowe! Wynik zapisany jako output_white.jpg")
