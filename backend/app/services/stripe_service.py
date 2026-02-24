import stripe
from app.config import config

stripe.api_key = config.STRIPE_SECRET_KEY

def create_payment_link(price_id: str, token: str, redirect_url: str, ga_client_id: str = None):
    link = stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        after_completion={"type": "redirect", "redirect": {"url": redirect_url}},
        session_metadata={  # 🔥 Ląduje w session.metadata!
            "token": token,
            "ga_client_id": ga_client_id or ""
        }
    )
    return link.url  # ✅ Koniec pliku tutaj
