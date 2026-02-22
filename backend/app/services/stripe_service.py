import stripe
from app.config import config

stripe.api_key = config.STRIPE_SECRET_KEY


def create_payment_link(price_id: str, token: str, redirect_url: str):
    link = stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        metadata={"token": token},  # 🔥 dodane
        payment_intent_data={
            "metadata": {"token": token}
        },
        after_completion={
            "type": "redirect",
            "redirect": {"url": redirect_url}
        }
    )
    return link.url