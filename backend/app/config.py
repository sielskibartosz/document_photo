import os
from dotenv import load_dotenv
from typing import List
from pathlib import Path

load_dotenv()

class Config:
    ALLOWED_ORIGIN: str = os.getenv("ALLOWED_ORIGIN", "")
    ADMIN_KEY: str = os.getenv("ADMIN_KEY", "")
    FEEDBACK_FILE: str = "feedback.txt"
    MAX_DIMENSION: int = 5000
    MAX_FEEDBACK_LENGTH: int = 1000
    PORT: int = int(os.getenv("PORT", "8080"))

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Dynamicznie parsuje ALLOWED_ORIGIN lub fallback do *"""
        if self.ALLOWED_ORIGIN:
            return [o.strip() for o in self.ALLOWED_ORIGIN.split(",") if o.strip()]
        return ["*"]  # Development fallback

    @property
    def FEEDBACK_FILE(self):
        return os.getenv("FEEDBACK_FILE", "data/feedback.txt")

    @property
    def FEEDBACK_DIR(self):
        return Path(self.FEEDBACK_FILE).parent

config = Config()
