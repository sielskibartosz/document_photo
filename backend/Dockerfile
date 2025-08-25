# --- Etap 1: budowanie pakietów ---
FROM python:3.12-slim AS builder

WORKDIR /app

# Kopiujemy plik z zależnościami
COPY requirements.txt .

# Instalacja minimalnych zależności systemowych
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Instalacja pakietów Python z CPU-only PyTorch
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt \
    --index-url https://download.pytorch.org/whl/cpu

# --- Etap 2: finalny obraz ---
FROM python:3.12-slim

WORKDIR /app

# Zainstaluj minimalne biblioteki systemowe
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj zbudowane pakiety
COPY --from=builder /install /usr/local

# Skopiuj aplikację
COPY . /app

# FastAPI logi bez buforowania
ENV PYTHONUNBUFFERED=1

# Port dla Fly.io
EXPOSE 8080

# Uruchom aplikację
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
