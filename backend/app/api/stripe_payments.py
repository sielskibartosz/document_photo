from fastapi import APIRouter, Request, HTTPException, Header
import stripe
import logging
from app.config import config
from app.models import CreateLinkRequest
from app.services.stripe_service import create_payment_link
from app.services.download_service import mark_paid, get_file
from starlette.concurrency import run_in_threadpool

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/payments", tags=["stripe"])
stripe.api_key = config.STRIPE_SECRET_KEY

if not config.STRIPE_WEBHOOK_SECRET:
    logger.warning("STRIPE_WEBHOOK_SECRET not configured")


def _is_allowed_redirect(url: str) -> bool:
    """Przekierowanie po platnosci tylko na nasz frontend (bez open redirect)."""
    return any(url == origin or url.startswith(origin.rstrip("/") + "/") for origin in config.ALLOWED_ORIGINS)


@router.post("/create-link")
async def create_link(
        body: CreateLinkRequest,
        x_admin_token: str | None = Header(None, alias="X-Admin-Token")
):
    if not get_file(body.token):
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    if config.is_admin(x_admin_token):
        logger.info("Admin bypass for token")
        mark_paid(body.token)
        return {"url": "ADMIN_BYPASS"}

    if body.price_id not in config.ALLOWED_PRICE_IDS:
        raise HTTPException(status_code=400, detail="Nieprawidłowa cena")
    if not _is_allowed_redirect(body.redirect_url):
        raise HTTPException(status_code=400, detail="Nieprawidłowy adres przekierowania")

    logger.info(f"Creating payment link for price_id: {body.price_id}")
    try:
        url = await run_in_threadpool(
            create_payment_link,
            body.price_id,
            body.token,
            body.redirect_url,
            ga_client_id=body.ga_client_id,
            gclid=body.gclid,
        )
    except stripe.error.StripeError:
        logger.exception("Stripe error while creating payment link")
        raise HTTPException(status_code=502, detail="Błąd płatności")
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

    # checkout.session.completed przychodzi tez dla platnosci asynchronicznych,
    # ktore jeszcze nie sa oplacone - wtedy czekamy na async_payment_succeeded
    if event["type"] in ("checkout.session.completed", "checkout.session.async_payment_succeeded"):
        session = event["data"]["object"]

        if session.get("payment_status") not in ("paid", "no_payment_required"):
            logger.info(f"[Stripe] Session {session.get('id')} not paid yet ({session.get('payment_status')})")
            return {"status": "pending"}

        # ✅ Pobierz token z session metadata
        token = session.metadata.get("token") if session.metadata else None

        # Fallback PaymentIntent
        if not token and session.get("payment_intent"):
            pi = await run_in_threadpool(stripe.PaymentIntent.retrieve, session["payment_intent"])
            token = pi.metadata.get("token")

        if not token:
            logger.warning("[Stripe] ⚠️  Webhook received but no token found")
        elif await run_in_threadpool(mark_paid, token):
            logger.info(f"[Stripe] ✅ Payment marked as completed for token: {token}")
        else:
            logger.error(f"[Stripe] ❌ Paid, but token/file not found (expired?): {token}")

    return {"status": "success"}
