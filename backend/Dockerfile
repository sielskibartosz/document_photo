# Lekki Python
FROM python:3.12-slim

# Ustawienia środowiska
ENV PYTHONUNBUFFERED=1
ENV APP_HOME=/app

WORKDIR $APP_HOME

# systemowe zależności wymagane przez pillow, cv2 i transparent-background
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Kopiujemy wymagania
COPY requirements.txt .

# Instalacja zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy cały projekt
COPY . .

# Uruchomienie FastAPI w pierwszym planie
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
