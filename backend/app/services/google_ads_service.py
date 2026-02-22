import hashlib
import requests
from app.config import config


def hash_data(value: str) -> str:
    value = value.strip().lower()
    return hashlib.sha256(value.encode()).hexdigest()


def send_google_conversion(email: str, transaction_id: str, value: float):
    if not email:
        print("[GOOGLE ADS] Brak emaila — pomijam konwersję")
        return

    hashed_email = hash_data(email)

    url = (
        f"https://www.google-analytics.com/mp/collect"
        f"?measurement_id={config.GOOGLE_ADS_MEASUREMENT_ID}"
        f"&api_secret={config.GOOGLE_ADS_API_SECRET}"
    )

    payload = {
        "client_id": transaction_id,
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
        print(f"[GOOGLE ADS] Status: {response.status_code}")
    except Exception as e:
        print(f"[GOOGLE ADS ERROR] {e}")