from fastapi import APIRouter, Request, HTTPException, Header
import stripe
from app.config import config
from app.models import CreateLinkRequest
from app.services.stripe_service import create_payment_link
from app.services.download_service import mark_paid

router = APIRouter(prefix="/api/payments", tags=["stripe"])
stripe.api_key = config.STRIPE_SECRET_KEY


@router.post("/create-link")
async def create_link(
        body: CreateLinkRequest,
        x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    print(f"[DEBUG] body: {body}")
    print(f"[DEBUG] x_admin_token: '{x_admin_token}'")

    if x_admin_token == config.ADMIN_DOWNLOAD_KEY:
        print(f"[ADMIN] BYPASS dla {body.token}")
        mark_paid(body.token)
        return {"url": "ADMIN_BYPASS"}

    print(f"[STRIPE] Tworzę link dla price_id: {body.price_id}")
    url = create_payment_link(body.price_id, body.token, body.redirect_url)
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

        # ✅ Poprawnie z session metadata
        token = session.metadata.get("token") if session.metadata else None

        # Fallback PaymentIntent
        if not token and session.get("payment_intent"):
            pi = stripe.PaymentIntent.retrieve(session["payment_intent"])
            token = pi.metadata.get("token")

        if token:
            mark_paid(token)
            print(f"[STRIPE] Marked paid: {token}")

    return {"status": "success"}
