import stripe
from app.config import config

stripe.api_key = config.STRIPE_SECRET_KEY


def create_payment_link(price_id: str, token: str, redirect_url: str, ga_client_id: str = None):
    """
    Tworzy payment link ze wszystkimi potrzebnymi metadanymi do śledzenia konwersji.
    """
    metadata = {
        "token": token,
    }

    # Dodaj GA client_id jeśli dostępny
    if ga_client_id:
        metadata["ga_client_id"] = ga_client_id

    link = stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        metadata=metadata,
        after_completion={
            "type": "redirect",
            "redirect": {"url": redirect_url}
        }
    )
    return link.url
