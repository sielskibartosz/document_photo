# Wersja Pythona
FROM python:3.12-slim

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Zainstaluj zależności systemowe potrzebne dla PIL / OpenCV
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

# Skopiuj plik z wymaganiami i zainstaluj zależności Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Skopiuj resztę kodu
COPY . /app

# Ustaw zmienne środowiskowe
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Otwórz port, na którym będzie nasłuchiwać FastAPI
EXPOSE 8080

# Uruchom serwer Uvicorn wskazując właściwą ścieżkę do main.py
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
