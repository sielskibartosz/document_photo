import stripe
from fastapi import APIRouter, Request, HTTPException, Header

from app.config import config
from app.models import CreateLinkRequest
from app.services.stripe_service import create_payment_link
from app.services.download_service import mark_paid
from app.services.google_ads_service import send_google_conversion

router = APIRouter(prefix="/api/payments", tags=["stripe"])

stripe.api_key = config.STRIPE_SECRET_KEY


@router.post("/create-link")
async def create_link(
    body: CreateLinkRequest,
    x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    print(f"[DEBUG] body: {body}")
    print(f"[DEBUG] x_admin_token: '{x_admin_token}'")

    # ADMIN BYPASS
    if x_admin_token == config.ADMIN_DOWNLOAD_KEY:
        print(f"[ADMIN] BYPASS dla {body.token}")
        mark_paid(body.token)
        return {"url": "ADMIN_BYPASS"}

    print(f"[STRIPE] Tworzę link dla price_id: {body.price_id}")
    # 🔥 Przekazanie ga_client_id do stripe_service
    url = create_payment_link(
        body.price_id,
        body.token,
        body.redirect_url,
        body.ga_client_id
    )
    return {"url": url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, config.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        payment_intent_id = session.get("payment_intent")
        token = None
        ga_client_id = None  # 🔥 Nowy!

        if payment_intent_id:
            pi = stripe.PaymentIntent.retrieve(payment_intent_id)
            token = pi.metadata.get("token")
            ga_client_id = pi.metadata.get("ga_client_id")  # 🔥 Pobranie z metadata!

        email = session.get("customer_details", {}).get("email")
        amount = session.get("amount_total", 0) / 100
        transaction_id = session.get("id")

        print(f"[STRIPE] email={email} amount={amount} token={token} ga_client_id={ga_client_id}")

        if token:
            mark_paid(token)

        if email and transaction_id:
            # 🔥 Przekazanie GA client_id do konwersji!
            send_google_conversion(email, transaction_id, amount, ga_client_id)

    return {"status": "success"}
