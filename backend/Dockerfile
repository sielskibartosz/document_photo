# --- Etap 1: budowanie pakietów ---
FROM python:3.12-slim AS builder

# Ustaw katalog roboczy
WORKDIR /app

# Kopiujemy tylko plik z zależnościami
COPY requirements.txt .

# Zainstaluj pakiety wymagane do budowania OpenCV
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Instalujemy pakiety w lokalizacji /install bez cache
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# --- Etap 2: finalny obraz ---
FROM python:3.12-slim

# Ustaw katalog roboczy
WORKDIR /app

# Zainstaluj wymagane biblioteki systemowe w finalnym obrazie
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj zbudowane pakiety z poprzedniego etapu
COPY --from=builder /install /usr/local

# Skopiuj aplikację
COPY . /app

# Ustaw zmienną środowiskową, aby FastAPI nie buforowało logów
ENV PYTHONUNBUFFERED=1

# Wystaw port dla Fly.io
EXPOSE 8080

# Uruchom aplikację
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
