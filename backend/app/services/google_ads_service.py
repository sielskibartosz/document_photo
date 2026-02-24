import hashlib
import requests
from app.config import config
from typing import Optional


def hash_data(value: str) -> str:
    value = value.strip().lower()
    return hashlib.sha256(value.encode()).hexdigest()


def send_google_conversion(email: str, transaction_id: str, value: float, client_id: Optional[str] = None):
    """
    Wysyła purchase event do GA4 z poprawnym client_id (rozwiązuje "nie wykryto danych strumienia")
    """
    if not email:
        print("[GOOGLE ADS] Brak emaila — pomijam konwersję")
        return

    hashed_email = hash_data(email)

    url = (
        f"https://www.google-analytics.com/mp/collect"
        f"?measurement_id={config.GOOGLE_ADS_MEASUREMENT_ID}"
        f"&api_secret={config.GOOGLE_ADS_API_SECRET}"
    )

    # 🔥 Użyj prawdziwego GA4 client_id z frontend zamiast transaction_id!
    payload = {
        "client_id": client_id or transaction_id,  # Priorytet: frontend client_id
        "events": [
            {
                "name": "purchase",
                "params": {
                    "value": value,
                    "currency": "PLN",
                    "transaction_id": transaction_id,
                },
            }
        ],
        "user_data": {
            "email_address": hashed_email
        },
    }

    try:
        response = requests.post(url, json=payload, timeout=5)
        print(f"[GOOGLE ADS] Status: {response.status_code}, client_id: {client_id or 'transaction_id'}")
    except Exception as e:
        print(f"[GOOGLE ADS ERROR] {e}")
