# --- Jednowarstwowy obraz ---
FROM python:3.12-slim

WORKDIR /app

# Zainstaluj zależności systemowe
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj plik requirements najpierw!
COPY requirements.txt .

RUN pip install flet==0.7.4
# Zainstaluj zależności Python, w tym Torch CPU i resztę pakietów
RUN pip install --no-cache-dir torch==2.3.0+cpu torchvision==0.18.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r requirements.txt

# Skopiuj kod aplikacji
COPY . /app

# FastAPI logi nie będą buforowane
ENV PYTHONUNBUFFERED=1

# Port dla Fly.io
EXPOSE 8080

# Uruchom aplikację
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]# --- Jednowarstwowy obraz ---
FROM python:3.12-slim

WORKDIR /app

# Zainstaluj zależności systemowe
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj plik requirements najpierw!
COPY requirements.txt .

RUN pip install flet==0.7.4
# Zainstaluj zależności Python, w tym Torch CPU i resztę pakietów
RUN pip install --no-cache-dir torch==2.3.0+cpu torchvision==0.18.0+cpu \
    --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r requirements.txt

# Skopiuj kod aplikacji
COPY . /app

# FastAPI logi nie będą buforowane
ENV PYTHONUNBUFFERED=1

# Port dla Fly.io
EXPOSE 8080

# Uruchom aplikację
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]