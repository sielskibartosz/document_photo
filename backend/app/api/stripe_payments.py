from fastapi import APIRouter, Request, HTTPException, Header
import stripe
import logging
from app.config import config
from app.models import CreateLinkRequest
from app.services.stripe_service import create_payment_link
from app.services.download_service import mark_paid
from app.services.google_ads_service import send_ga4_conversion

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
        ga_client_id=body.ga_client_id  # Pobierz z obiektu request
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

        # ✅ Pobierz token i GA client_id z session metadata
        token = session.metadata.get("token") if session.metadata else None
        ga_client_id = session.metadata.get("ga_client_id") if session.metadata else None

        # Fallback PaymentIntent
        if not token and session.get("payment_intent"):
            pi = stripe.PaymentIntent.retrieve(session["payment_intent"])
            token = pi.metadata.get("token")
            ga_client_id = ga_client_id or pi.metadata.get("ga_client_id")

        if token:
            mark_paid(token)
            logger.info(f"[Stripe] ✅ Payment marked as completed for token: {token}")

            # Dane dla konwersji
            customer_email = session.get("customer_email")
            customer_id = session.get("customer")  # Stripe customer ID jako user_id

            # 🔥 Wysyłaj konwersję GA4 (Measurement Protocol) na backend
            # Frontend już wysyła event z gtag, ale backend ensures double-tracking na wypadek błędu
            # ✅ event_id zapobiega duplikatom
            # ✅ user_id dla GA Conversion Tracking (linking z Google Ads)
            if customer_email:
                try:
                    success = send_ga4_conversion(
                        transaction_id=token,
                        client_id=ga_client_id,
                        email=customer_email,
                        user_id=customer_id,  # User ID dla GA linking
                        value=7.0,
                        event_id=f"purchase_{token}"  # ✅ event_id dla deduplicacji
                    )
                    if success:
                        logger.info(
                            f"[Stripe → GA4] ✅ Backend conversion sent "
                            f"| token={token} "
                            f"| client_id={ga_client_id or 'none'} "
                            f"| user_id={customer_id or 'none'} "
                            f"| email={customer_email}"
                        )
                    else:
                        logger.warning(
                            f"[Stripe → GA4] ⚠️  Conversion returned False (non-204 response)"
                        )
                except Exception as e:
                    logger.error(f"[Stripe → GA4] ❌ Failed to send conversion: {str(e)}")
            else:
                logger.warning(f"[Stripe → GA4] ⚠️  No email in session, skipping backend conversion")
        else:
            logger.warning(f"[Stripe] ⚠️  Webhook received but no token found")

    return {"status": "success"}
