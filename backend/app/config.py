import os
from dotenv import load_dotenv
from typing import List
from pathlib import Path

load_dotenv()

class Config:
    ALLOWED_ORIGIN: str = os.getenv("ALLOWED_ORIGIN", "")
    ALLOWED_ORIGINS: List[str] = [o.strip() for o in ALLOWED_ORIGIN.split(",") if o.strip()]
    ADMIN_KEY: str = os.getenv("ADMIN_KEY", "")
    FEEDBACK_FILE: str = "feedback.txt"
    MAX_DIMENSION: int = 5000
    MAX_FEEDBACK_LENGTH: int = 1000
    PORT: int = int(os.getenv("PORT", 8000))

    @property
    def FEEDBACK_FILE(self):
        return os.getenv("FEEDBACK_FILE", "data/feedback.txt")

    @property
    def FEEDBACK_DIR(self):
        return Path(self.FEEDBACK_FILE).parent

config = Config()
