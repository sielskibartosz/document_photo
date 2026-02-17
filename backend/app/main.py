from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from app.config import config
from app.api.feedback import router as feedback_router
from app.api.background import router as background_router
from app.services.cleanup_service import cleanup_expired_files
from app.api.download import router as download_router  # pobieranie plików
from app.api.stripe_payments import router as stripe_router  # Stripe PaymentLink + webhook


@asynccontextmanager
async def lifespan(app: FastAPI):
    # uruchamiamy task czyszczący stare pliki
    task = asyncio.create_task(cleanup_expired_files(app))
    yield
    task.cancel()


app = FastAPI(
    title="Remove Background & Feedback API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ---------------- ROUTERY ----------------
app.include_router(download_router)  # dostęp do plików
app.include_router(stripe_router)    # Stripe payments & webhook
app.include_router(feedback_router)
app.include_router(background_router)


# ---------------- HEALTH CHECK ----------------
@app.get("/ping")
async def ping():
    return {"status": "ok", "message": "Server is running!"}


if __name__ == "__main__":
    import uvicorn
    port = config.PORT
    print(f"Starting server on 0.0.0.0:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info", reload=True)
