# --- Etap 1: budowanie pakietów ---
FROM python:3.12-slim AS builder

WORKDIR /app

# Kopiujemy tylko plik z zależnościami
COPY requirements.txt .

# Instalujemy pakiety potrzebne do transparent-background
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Instalacja pakietów w lokalizacji /install bez cache
RUN pip install --prefix=/install --no-cache-dir -r requirements.txt

# --- Etap 2: finalny obraz ---
FROM python:3.12-slim

WORKDIR /app

# Wymagane biblioteki systemowe
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Kopiujemy zbudowane pakiety
COPY --from=builder /install /usr/local

# Kopiujemy aplikację
COPY . /app

ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
