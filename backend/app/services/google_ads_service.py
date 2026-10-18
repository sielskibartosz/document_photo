import hashlib
import requests
from app.config import config
from typing import Optional


def hash_data(value: str) -> str:
    """Hash email SHA256 dla Google Ads"""
    value = value.strip().lower()
    return hashlib.sha256(value.encode()).hexdigest()


def send_ga4_conversion(
    transaction_id: str,
    client_id: Optional[str] = None,
    email: Optional[str] = None,
    value: float = 7.0,
    event_id: Optional[str] = None,
    user_id: Optional[str] = None,
    gclid: Optional[str] = None
):
    """
    🔥 Wysyła purchase event do GA4 (Measurement Protocol v1).

    Obsługuje konwersje z Google Ads poprzez GA4 Conversion Tracking.
    Data flow: Frontend (gtag) → Stripe Webhook → Backend (Measurement Protocol) → GA4 → Google Ads

    Args:
        transaction_id: Unikalny ID transakcji (token płatności)
        client_id: GA4 client_id z frontendu (KRYTYCZNE dla prawidłowego liczenia konwersji!)
        email: Email użytkownika (zostanie zahashowany SHA256)
        value: Wartość transakcji w PLN
        event_id: Event ID dla deduplicacji (np. purchase_<transaction_id>)
        user_id: User ID z backendu (hash lub UUID użytkownika)
    """
    # Walidacja konfiguracji
    if not config.GOOGLE_ADS_MEASUREMENT_ID:
        print("[GA4] ❌ GOOGLE_ADS_MEASUREMENT_ID nie skonfigurowany!")
        return

    if not config.GOOGLE_ADS_API_SECRET:
        print("[GA4] ❌ GOOGLE_ADS_API_SECRET nie skonfigurowany!")
        return

    # Walidacja transaction_id
    if not transaction_id:
        print("[GA4] ❌ Brak transaction_id - pomijam wysyłkę")
        return

    # client_id - KRYTYCZNE!
    ga_client_id = client_id or transaction_id
    if not client_id:
        print(
            f"[GA4] ⚠️ Brak client_id z frontendu, używam transaction_id jako fallback. "
            f"⚠️ Konwersja może NIE być policzona poprawnie w GA4!"
        )

    url = (
        f"https://www.google-analytics.com/mp/collect"
        f"?measurement_id={config.GOOGLE_ADS_MEASUREMENT_ID}"
        f"&api_secret={config.GOOGLE_ADS_API_SECRET}"
    )

    # ✅ Event ID do deduplicacji (WAŻNE dla Stripe webhook retry)
    if not event_id:
        event_id = f"purchase_{transaction_id}"

    # ✅ Structured params dla purchase event
    event_params = {
        "value": value,
        "currency": "PLN",
        "transaction_id": transaction_id,
        "items": [
            {
                "item_id": "photo-sheet",
                "item_name": "Photo Sheet",
                "price": value,
                "quantity": 1,
                "item_category": "document_photo"
            }
        ]
    }

    # Budowanie payload
    payload = {
        "client_id": ga_client_id,
        "events": [
            {
                "name": "purchase",
                "params": event_params,
                "event_id": event_id
            }
        ],
    }

    # jeżeli mamy gclid, dodajemy go do traffic_source by GA4 przekazało do Google Ads
    if gclid:
        payload["traffic_source"] = {"gclid": gclid}

    # ✅ User Data (PII hashed dla matching w GA4 → Google Ads)
    if email or user_id:
        payload["user_data"] = {}
        if email:
            payload["user_data"]["email_address"] = hash_data(email)
        if user_id:
            # user_id powinien być hashed (SHA256) w production
            payload["user_data"]["user_id"] = user_id

    # ✅ User Properties (śledzenie konwersji)
    if email or user_id:
        payload["user_properties"] = {}
        if user_id:
            payload["user_properties"]["user_id"] = {
                "value": user_id
            }

    try:
        response = requests.post(url, json=payload, timeout=5)

        if response.status_code == 204:
            print(
                f"[GA4] ✅ Purchase event wysłany poprawnie "
                f"| transaction_id={transaction_id} "
                f"| client_id={ga_client_id} "
                f"| event_id={event_id} "
                f"| email={email or 'N/A'} "
                f"| value={value}PLN "
                f"| gclid={gclid or 'none'}"
            )
            return True
        else:
            print(
                f"[GA4] ⚠️ Unexpected status code: {response.status_code} "
                f"| Response: {response.text}"
            )
            return False
    except Exception as e:
        print(f"[GA4] ❌ Błąd przy wysyłaniu: {str(e)}")
        return False
