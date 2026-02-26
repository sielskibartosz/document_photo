import stripe
import logging
from app.config import config

stripe.api_key = config.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)


def create_payment_link(price_id: str, token: str, redirect_url: str, ga_client_id: str = None, gclid: str = None):
    """
    Tworzy payment link ze wszystkimi potrzebnymi metadanymi do śledzenia konwersji.

    Args:
        price_id: Stripe price ID
        token: Token pobierania (ID transakcji dla GA4)
        redirect_url: URL do przekierowania po płatności
        ga_client_id: GA4 client_id z frontendu (KRYTYCZNE!)
        gclid: parametr gclid automatycznie dopisywany przez Google Ads (opcjonalny)
    """
    metadata = {
        "token": token,
    }

    # Dodaj GA client_id jeśli dostępny
    if ga_client_id:
        metadata["ga_client_id"] = ga_client_id
        logger.info(f"[Stripe] ✅ GA client_id dodany do metadanych: {ga_client_id}")
    else:
        logger.warning(f"[Stripe] ⚠️  Brak GA client_id! Konwersja może NIE być policzona w GA4")

    # Dodaj gclid jeżeli przekazano (przyda się do atrybucji Google Ads)
    if gclid:
        metadata["gclid"] = gclid
        logger.info(f"[Stripe] ✅ gclid dodany do metadanych: {gclid}")

    link = stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        metadata=metadata,
        customer_creation="always",  # ✅ Enable email collection for GA4 tracking
        after_completion={
            "type": "redirect",
            "redirect": {"url": redirect_url}
        }
    )

    logger.info(f"[Stripe] ✅ Payment link created | token={token} | metadata={metadata}")
    return link.url
