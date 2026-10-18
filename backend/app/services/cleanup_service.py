# -------------------------
# CLEANUP SERVICE
# -------------------------
import asyncio
import logging

from fastapi import FastAPI
from starlette.concurrency import run_in_threadpool

from app.services.download_service import remove_expired

logger = logging.getLogger(__name__)


async def cleanup_expired_files(app: FastAPI):
    while True:
        try:
            await run_in_threadpool(remove_expired)
        except Exception:
            logger.exception("[cleanup] Unexpected error")
        await asyncio.sleep(60)
