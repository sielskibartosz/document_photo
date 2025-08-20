# Lekki Python
FROM python:3.12-slim

# Ustawienia środowiska
ENV PYTHONUNBUFFERED=1
ENV APP_HOME=/app

WORKDIR $APP_HOME

# Kopiujemy wymagania
COPY requirements.txt .

# Instalacja zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy cały projekt
COPY . .

# Uruchomienie FastAPI w pierwszym planie
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
