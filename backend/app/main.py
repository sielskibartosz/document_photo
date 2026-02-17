
#main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from app.config import config
from app.api.feedback import router as feedback_router
from app.api.background import router as background_router
from app.api.sheet import router as download_router
from app.services import cleanup_expired_files


@asynccontextmanager
async def lifespan(app: FastAPI):
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS or ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(download_router)
app.include_router(feedback_router)
app.include_router(background_router)


@app.get("/ping")
async def ping():
    """Health check endpoint."""
    return {"status": "ok", "message": "Server is running!"}


if __name__ == "__main__":
    import uvicorn
    port = config.PORT
    print(f"Starting server on 0.0.0.0:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info", reload=True)
