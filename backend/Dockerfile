# --- Etap 1: budowanie pakietów ---
FROM python:3.12-slim AS builder

# Ustaw katalog roboczy
WORKDIR /app

# Kopiujemy tylko plik z zależnościami
COPY requirements.txt .

# Instalujemy pakiety w lokalizacji /install bez cache
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# --- Etap 2: finalny obraz ---
FROM python:3.12-slim

# Ustaw katalog roboczy
WORKDIR /app

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
