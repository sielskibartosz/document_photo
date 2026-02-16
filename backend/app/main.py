from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import config
from app.api.feedback import router as feedback_router
from app.api.background import router as background_router
from app.api.sheet import router as download_router

app = FastAPI(
    title="Remove Background & Feedback API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
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
    import os
    port = config.PORT
    print(f"Starting server on 0.0.0.0:{port}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info", reload=True)
