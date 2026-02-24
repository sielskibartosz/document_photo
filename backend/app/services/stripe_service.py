import stripe
from app.config import config

stripe.api_key = config.STRIPE_SECRET_KEY


def create_payment_link(price_id: str, token: str, redirect_url: str, ga_client_id: str = None):
    """
    Tworzy Stripe Payment Link z GA4 client_id w metadata
    """
    metadata = {
        "token": token
    }
    if ga_client_id:
        metadata["ga_client_id"] = ga_client_id  # 🔥 Tylko jeśli dostępne

    link = stripe.PaymentLink.create(
        line_items=[{
            "price": price_id,
            "quantity": 1
        }],
        metadata=metadata,  # 🔥 Backend param + frontend client_id
        after_completion={
            "type": "redirect",
            "redirect": {"url": redirect_url}
        }
    )
    return link.url
