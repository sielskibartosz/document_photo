from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import os
import uuid
import base64
import stripe
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

# ---------------- ENV ----------------
load_dotenv()

ENV = os.getenv("ENV", "dev")
FRONTEND_URL = os.getenv("FRONTEND_URL")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGIN", "*").split(",")
ADMIN_KEY = os.getenv("ADMIN_KEY", "")
ADMIN_DOWNLOAD_KEY = os.getenv("ADMIN_DOWNLOAD_KEY", "")

if not FRONTEND_URL:
    raise Exception("FRONTEND_URL not set in environment variables")

# ---------------- STRIPE ----------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

if not stripe.api_key:
    raise Exception("STRIPE_SECRET_KEY not set")

if not STRIPE_WEBHOOK_SECRET:
    raise Exception("STRIPE_WEBHOOK_SECRET not set")

# ---------------- ROUTER ----------------
router = APIRouter(prefix="/api/download", tags=["download"])

DOWNLOAD_DIR = "downloads"
TOKEN_EXPIRE_MINUTES = 10
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# ⚠️ Produkcyjnie zamiast dict użyj bazy danych
download_tokens = {}  # token -> { path, expires, paid }

# ---------------- REQUEST MODEL ----------------
class DownloadRequest(BaseModel):
    image_base64: str
    price_id: str  # Stripe Price ID


# ---------------- CREATE DOWNLOAD + PAYMENT LINK ----------------
@router.post("/create-and-link")
async def create_download_and_link(body: DownloadRequest):
    try:
        # dekodowanie base64
        if "," in body.image_base64:
            _, encoded = body.image_base64.split(",", 1)
        else:
            encoded = body.image_base64

        file_bytes = base64.b64decode(encoded)

        # generujemy token
        token = str(uuid.uuid4())
        filename = f"{token}.jpg"
        path = os.path.join(DOWNLOAD_DIR, filename)

        # zapis pliku
        with open(path, "wb") as f:
            f.write(file_bytes)

        # zapis tokena
        download_tokens[token] = {
            "path": path,
            "expires": datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES),
            "paid": False
        }

        # redirect po płatności
        redirect_url = f"{FRONTEND_URL}/#/download-success?token={token}"

        # tworzymy Payment Link
        link = stripe.PaymentLink.create(
            line_items=[{"price": body.price_id, "quantity": 1}],
            payment_intent_data={
                "metadata": {"token": token}
            },
            after_completion={
                "type": "redirect",
                "redirect": {"url": redirect_url}
            }
        )

        return JSONResponse({
            "url": link.url,
            "token": token
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- DOWNLOAD FILE ----------------
@router.get("/{token}")
async def download_file(token: str, key: str = None):
    data = download_tokens.get(token)

    if not data:
        raise HTTPException(status_code=404, detail="Link nie istnieje")

    # Admin bypass
    if key and key in [ADMIN_KEY, ADMIN_DOWNLOAD_KEY]:
        data["paid"] = True

    if datetime.now(timezone.utc) > data["expires"]:
        raise HTTPException(status_code=403, detail="Link wygasł")

    if not data.get("paid", False):
        raise HTTPException(status_code=403, detail="Płatność nie została zakończona")

    path = data["path"]

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Plik nie istnieje")

    return FileResponse(
        path=path,
        media_type="image/jpeg",
        filename="photo_sheet.jpg"
    )


# ---------------- STRIPE WEBHOOK ----------------
@router.post("/webhook")
async def stripe_webhook(request: Request):
    print("=== WEBHOOK RECEIVED ===")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Webhook error: {str(e)}")

    print("Event type:", event["type"])

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        # metadata jest bezpośrednio w session!
        token = session.get("metadata", {}).get("token")

        # fallback jeśli metadata jest w payment_intent
        if not token:
            payment_intent_id = session.get("payment_intent")
            if payment_intent_id:
                payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                token = payment_intent.metadata.get("token")

        if token and token in download_tokens:
            download_tokens[token]["paid"] = True

    return {"status": "success"}
