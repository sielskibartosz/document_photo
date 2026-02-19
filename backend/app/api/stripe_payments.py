import os

from fastapi import APIRouter, Request, HTTPException, Header
from app.services.stripe_service import create_payment_link
from app.services.download_service import mark_paid

import stripe
from app.config import config

from app.models import CreateLinkRequest

router = APIRouter(prefix="/api/payments", tags=["stripe"])


@router.post("/create-link")
async def create_link(body: CreateLinkRequest, x_admin_token: str | None = Header(None)):
    # ADMIN BYPASS
    if x_admin_token == os.getenv("ADMIN_SECRET"):
        try:
            mark_paid(body.token)
            print("ADMIN BYPASS OK")
        except Exception as e:
            print("MARK_PAID ERROR:", e)
            raise
        return {"url": "ADMIN_BYPASS"}

    try:
        url = create_payment_link(body.price_id, body.token, body.redirect_url)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
        token = session.get("metadata", {}).get("token")
        if not token:
            payment_intent_id = session.get("payment_intent")
            if payment_intent_id:
                pi = stripe.PaymentIntent.retrieve(payment_intent_id)
                token = pi.metadata.get("token")
        if token:
            mark_paid(token)

    return {"status": "success"}
