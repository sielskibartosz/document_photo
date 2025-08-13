FROM python:3.12-slim

# Ustawiamy katalog roboczy na katalog, gdzie jest manage.py
WORKDIR /app

# Kopiujemy wymagania
COPY requirements.txt .

# Instalacja zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy cały projekt
COPY . .

# Eksponujemy port Django
EXPOSE 8000

# Uruchomienie serwera dev Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
