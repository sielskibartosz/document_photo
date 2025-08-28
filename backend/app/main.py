import os
import stripe
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from transparent_background import Remover
import io, base64
import json
from dotenv import load_dotenv

app = FastAPI(title="Remove Background API")

load_dotenv()
allowed_origin = os.getenv("ALLOWED_ORIGIN").split(",")
stripe_key = os.getenv("STRIPE")
# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origin,  # lub podaj frontend np. ["http://localhost:3000"]
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- model ---
remover = Remover()  # domyślnie U2Net


@app.post("/remove-background/")
async def remove_background(
        image: UploadFile = File(...),
        bg_color: str = Form("[255,255,255]")  # domyślnie białe tło
):
    print("bg_color raw:", bg_color)

    try:
        # 1. Wczytaj obraz
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")

        # 2. Usuń tło
        result = remover.process(img, type="rgba").convert("RGBA")

        # 4. Sparsuj kolor tła
        try:
            if bg_color.startswith("[") and bg_color.endswith("]"):
                bg_list = json.loads(bg_color)
            else:
                bg_list = [int(x) for x in bg_color.split(",")]
            if len(bg_list) == 3:
                bg_list.append(255)
            bg_tuple = tuple(bg_list)
            print("bg_color raw:", bg_color)

        except Exception as e:
            print("bg_color parse error:", e)
            bg_tuple = (255, 255, 255, 255)

        # 5. Stwórz tło i nałóż wycięty obraz
        background = Image.new("RGBA", result.size, bg_tuple)
        background.paste(result, mask=result.getchannel("A"))

        # 6. Konwersja do base64
        buf = io.BytesIO()
        background.save(buf, format="PNG")
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")

        return JSONResponse(content={"image": b64})


    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/create-checkout-session")
async def create_checkout_session():
    stripe.api_key = stripe_key
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": "Donation",
                },
                "unit_amount": 500,  # kwota w centach (np. 500 = $5)
            },
            "quantity": 1,
        }],
        mode="payment",
        success_url="http://localhost:3000/success",
        cancel_url="http://localhost:3000/cancel",
    )
    return JSONResponse({"id": session.id})


@app.get("/ping")
def ping():
    return {"message": "Server is running!"}