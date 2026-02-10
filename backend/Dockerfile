# Wersja Pythona 3.12 slim (mniejsza niż pełna)
FROM python:3.12-slim

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Zainstaluj zależności systemowe potrzebne dla PIL i transparent-background
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj requirements i zainstaluj Python dependencies (cache-friendly)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Utwórz folder na feedback (persistent volume)
RUN mkdir -p /app/data && chmod 755 /app/data

# Skopiuj KOD (po instalacji zależności - cache-friendly)
COPY app/ ./app/

# Ustaw zmienne środowiskowe
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    FEEDBACK_FILE=/app/data/feedback.txt

# Otwórz port
EXPOSE 8080

# Uruchom serwer Uvicorn (production-ready)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
