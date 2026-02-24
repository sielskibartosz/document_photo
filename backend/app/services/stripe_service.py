import stripe
from app.config import config

stripe.api_key = config.STRIPE_SECRET_KEY


def create_payment_link(price_id: str, token: str, redirect_url: str):
    metadata = {"token": token}  # ga_client_id usunięte

    link = stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        metadata=metadata,
        after_completion={
            "type": "redirect",
            "redirect": {"url": redirect_url}
        }
    )
    return link.url
