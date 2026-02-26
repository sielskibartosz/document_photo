from fastapi import APIRouter, Request, HTTPException, Header
import stripe
import logging
from app.config import config
from app.models import CreateLinkRequest
from app.services.stripe_service import create_payment_link
from app.services.download_service import mark_paid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/payments", tags=["stripe"])
stripe.api_key = config.STRIPE_SECRET_KEY

if not config.STRIPE_WEBHOOK_SECRET:
    logger.warning("STRIPE_WEBHOOK_SECRET not configured")


@router.post("/create-link")
async def create_link(
        body: CreateLinkRequest,
        x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    if x_admin_token == config.ADMIN_DOWNLOAD_KEY:
        logger.info(f"Admin bypass for token")
        mark_paid(body.token)
        return {"url": "ADMIN_BYPASS"}

    logger.info(f"Creating payment link for price_id: {body.price_id}")
    url = create_payment_link(
        body.price_id,
        body.token,
        body.redirect_url,
        ga_client_id=body.ga_client_id,  # Pobierz z obiektu request
        gclid=body.gclid
    )
    return {"url": url}


@router.post("/webhook")
async def stripe_webhook(request: Request):
    if not config.STRIPE_WEBHOOK_SECRET:
        logger.error("Webhook secret not configured")
        raise HTTPException(status_code=500, detail="Webhook not configured")
    
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, config.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid webhook signature: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        # ✅ Pobierz token z session metadata
        token = session.metadata.get("token") if session.metadata else None

        # Fallback PaymentIntent
        if not token and session.get("payment_intent"):
            pi = stripe.PaymentIntent.retrieve(session["payment_intent"])
            token = pi.metadata.get("token")

        if token:
            mark_paid(token)
            logger.info(f"[Stripe] ✅ Payment marked as completed for token: {token}")
            logger.info(f"[Stripe] ℹ️  Conversion tracking handled by frontend gtag event")
        else:
            logger.warning(f"[Stripe] ⚠️  Webhook received but no token found")

    return {"status": "success"}
