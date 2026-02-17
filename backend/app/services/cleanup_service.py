# -------------------------
# CLEANUP SERVICE
# -------------------------
import asyncio
import os
from datetime import datetime, timezone
from fastapi import FastAPI

from app.services.download_service import download_tokens


async def cleanup_expired_files(app: FastAPI):
    while True:
        now = datetime.now(timezone.utc)
        expired_tokens = []
        for token, data in list(download_tokens.items()):
            if now > data["expires"]:
                path = data["path"]
                if os.path.exists(path):
                    try:
                        os.remove(path)
                    except Exception as e:
                        print(f"[cleanup] Failed to remove {path}: {e}")
                expired_tokens.append(token)

        for token in expired_tokens:
            download_tokens.pop(token, None)

        await asyncio.sleep(60)
