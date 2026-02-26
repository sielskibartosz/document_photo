import hashlib
import requests
from app.config import config
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def hash_data(value: str) -> str:
    """Hash email SHA256 dla Google Ads"""
    value = value.strip().lower()
    return hashlib.sha256(value.encode()).hexdigest()


def send_ga4_conversion(
    transaction_id: str,
    client_id: Optional[str] = None,
    email: Optional[str] = None,
    value: float = 7.0,
    event_id: Optional[str] = None
):
    """
    🔥 Wysyła purchase event do GA4 (Measurement Protocol).

    Args:
        transaction_id: Unikalny ID transakcji (token płatności)
        client_id: GA4 client_id z frontendu (KRYTYCZNE dla prawidłowego liczenia konwersji!)
        email: Email użytkownika (zostanie zahashowany SHA256)
        value: Wartość transakcji w PLN
        event_id: Event ID dla deduplicacji (funkcja: purchase_<transaction_id>)

    ⚠️ WAŻNE:
    - GA4 requires:
      * Measurement ID (GOOGLE_ADS_MEASUREMENT_ID)
      * API Secret (GOOGLE_ADS_API_SECRET)
      * client_id (z gtag na froncie)
    - Bez client_id konwersja nie będzie policzona w GA4!
    - event_id zapobiega duplikatom jeśli frontend już wysłał event
    """
    # Walidacja konfiguracji
    if not config.GOOGLE_ADS_MEASUREMENT_ID:
        logger.error("[GA4] ❌ GOOGLE_ADS_MEASUREMENT_ID nie skonfigurowany!")
        return

    if not config.GOOGLE_ADS_API_SECRET:
        logger.error("[GA4] ❌ GOOGLE_ADS_API_SECRET nie skonfigurowany!")
        return

    # Walidacja transaction_id
    if not transaction_id:
        logger.warning("[GA4] ❌ Brak transaction_id - pomijam wysyłkę")
        return

    # client_id - KRYTYCZNE!
    ga_client_id = client_id or transaction_id
    if not client_id:
        logger.warning(
            f"[GA4] ⚠️  Brak client_id z frontendu, używam transaction_id jako fallback. "
            f"⚠️  Konwersja może NIE być policzona w GA4!"
        )

    url = (
        f"https://www.google-analytics.com/mp/collect"
        f"?measurement_id={config.GOOGLE_ADS_MEASUREMENT_ID}"
        f"&api_secret={config.GOOGLE_ADS_API_SECRET}"
    )

    # ✅ event_id do deduplicacji (jeśli frontend wysłał, backend nie wyśle duplikat)
    event_params = {
        "value": value,
        "currency": "PLN",
        "transaction_id": transaction_id,
    }
    
    event_obj = {
        "name": "purchase",
        "params": event_params,
    }
    
    if event_id:
        event_obj["event_id"] = event_id
    
    payload = {
        "client_id": ga_client_id,
        "events": [event_obj],
    }

    # Dodaj user_data jeśli email dostępny (dla lepszego matchingu w GA4)
    if email:
        payload["user_data"] = {
            "email_address": hash_data(email)
        }

    try:
        response = requests.post(url, json=payload, timeout=5)

        if response.status_code == 204:
            logger.info(
                f"[GA4] ✅ Purchase event wysłany poprawnie "
                f"| transaction_id={transaction_id} "
                f"| client_id={ga_client_id} "
                f"| email={email or 'N/A'} "
                f"| value={value}PLN"
            )
        else:
            logger.warning(
                f"[GA4] ⚠️  Unexpected status code: {response.status_code} "
                f"| Response: {response.text}"
            )
    except Exception as e:
        logger.error(f"[GA4] ❌ Błąd przy wysyłaniu: {str(e)}")
