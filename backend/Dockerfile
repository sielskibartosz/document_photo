# --- Etap 1: budowanie pakietów ---
FROM python:3.12-slim AS builder

WORKDIR /app

# Kopiujemy plik z zależnościami
COPY requirements.txt .

# Zainstaluj zależności systemowe potrzebne do OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Instalacja pakietów Python z PyPI (bez torch/torchvision)
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# Instalacja PyTorch CPU-only (z właściwego indexu)
RUN pip install --prefix=/install --no-cache-dir \
    torch==2.3.0+cpu torchvision==0.18.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu


# --- Etap 2: finalny obraz ---
FROM python:3.12-slim

WORKDIR /app

# Zainstaluj wymagane biblioteki systemowe
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj zbudowane pakiety z etapu builder
COPY --from=builder /install /usr/local

# Skopiuj aplikację
COPY . /app

# Ustaw zmienną środowiskową, aby FastAPI nie buforowało logów
ENV PYTHONUNBUFFERED=1

# Wystaw port dla Fly.io
EXPOSE 8080

# Uruchom aplikację
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
