import hashlib
import requests
from app.config import config
from typing import Optional
import logging
import json

logger = logging.getLogger(__name__)


def hash_data(value: str) -> str:
    value = value.strip().lower()
    return hashlib.sha256(value.encode()).hexdigest()


def send_ga4_conversion(
    transaction_id: str,
    client_id: Optional[str] = None,
    email: Optional[str] = None,
    value: float = 7.0
):
    """
    Wysyła purchase event do GA4 (Measurement Protocol).
    Wymagane: transaction_id (token), opcjonalne: client_id, email, value
    """
    if not config.GOOGLE_ADS_MEASUREMENT_ID or not config.GOOGLE_ADS_API_SECRET:
        logger.warning("[GA4] Measurement ID lub API Secret nie skonfigurowane")
        return

    url = (
        f"https://www.google-analytics.com/mp/collect"
        f"?measurement_id={config.GOOGLE_ADS_MEASUREMENT_ID}"
        f"&api_secret={config.GOOGLE_ADS_API_SECRET}"
    )

    # Użyj client_id jeśli dostępny, inaczej transaction_id jako fallback
    ga_client_id = client_id or transaction_id

    payload = {
        "client_id": ga_client_id,
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
    }

    # Dodaj user_data jeśli email dostępny (dla lepszego matchingu)
    if email:
        payload["user_data"] = {
            "email_address": hash_data(email)
        }

    try:
        response = requests.post(url, json=payload, timeout=5)
        logger.info(
            f"[GA4] Purchase event sent - Status: {response.status_code}, "
            f"transaction_id: {transaction_id}, client_id: {ga_client_id}, "
            f"email: {email or 'N/A'}"
        )
        if response.status_code != 204:
            logger.warning(f"[GA4] Unexpected status code: {response.status_code}")
    except Exception as e:
        logger.error(f"[GA4] Error sending conversion: {str(e)}")


def send_google_ads_conversion(
    transaction_id: str,
    email: Optional[str] = None,
    value: float = 7.0,
    currency: str = 'PLN'
):
    """
    Wysyła konwersję do Google Ads (AW) za pomocą Conversion API.

    WAŻNE: Wymaga skonfigurowania:
    - GOOGLE_ADS_CONVERSION_ID (zwany też ConversionId)
    - GOOGLE_ADS_CONVERSION_LABEL (znany jako conversion label)
    - GOOGLE_ADS_API_KEY (dla backend API)

    Lub używa metody z gtag (frontend fallback)
    """
    # Dla metody backend, potrzebowałbyś dodatkowych zmiennych env
    # Na razie ta funkcja jest placeholder dla przyszłego API Google Ads

    logger.info(
        f"[Google Ads] Conversion tracked - "
        f"transaction_id: {transaction_id}, "
        f"value: {value} {currency}, "
        f"email: {email or 'N/A'}"
    )

def send_google_conversion(email: str, transaction_id: str, value: float, client_id: Optional[str] = None):
    """
    Wysyła purchase event do GA4 z poprawnym client_id (rozwiązuje "nie wykryto danych strumienia")
    """
    if not email:
        logger.warning("[GOOGLE ADS] Brak emaila — pomijam konwersję")
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
        logger.info(f"[GOOGLE ADS] Status: {response.status_code}, client_id: {client_id or 'transaction_id'}")
    except Exception as e:
        logger.error(f"[GOOGLE ADS ERROR] {e}")
