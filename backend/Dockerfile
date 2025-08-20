# Wybieramy lekkiego Pythona
FROM python:3.12-slim

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy plik z wymaganiami
COPY requirements.txt .

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy resztę projektu
COPY app .

# Eksponujemy port FastAPI
EXPOSE 8080

# Uruchamiamy serwer uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
