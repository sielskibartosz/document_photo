import os
from dotenv import load_dotenv
from typing import List
from pathlib import Path

load_dotenv()


class Config:
    # ---------------- ENV ----------------
    ALLOWED_ORIGIN: str = os.getenv("ALLOWED_ORIGIN", "")
    ADMIN_KEY: str = os.getenv("ADMIN_KEY", "")
    ADMIN_DOWNLOAD_KEY: str = os.getenv("ADMIN_DOWNLOAD_KEY", "")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
    PORT: int = int(os.getenv("PORT", "8080"))

    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET")

    GOOGLE_ADS_MEASUREMENT_ID = os.getenv("GOOGLE_ADS_MEASUREMENT_ID")
    GOOGLE_ADS_API_SECRET = os.getenv("GOOGLE_ADS_API_SECRET")

    MAX_DIMENSION: int = 5000
    MAX_FEEDBACK_LENGTH: int = 1000

    # ---------------- FEEDBACK ----------------
    FEEDBACK_FILE_ENV: str = os.getenv("FEEDBACK_FILE", "data/feedback.txt")

    @property
    def FEEDBACK_FILE(self) -> str:
        """Zwraca pełną ścieżkę do pliku feedback"""
        return self.FEEDBACK_FILE_ENV

    @property
    def FEEDBACK_DIR(self) -> Path:
        """Zwraca katalog, w którym przechowywany jest plik feedback"""
        return Path(self.FEEDBACK_FILE_ENV).parent

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Dynamicznie parsuje ALLOWED_ORIGIN lub fallback do *"""
        if self.ALLOWED_ORIGIN:
            return [o.strip() for o in self.ALLOWED_ORIGIN.split(",") if o.strip()]
        return ["*"]  # Development fallback

    # ---------------- DOWNLOAD ----------------
    DOWNLOAD_DIR: str = "downloads"
    TOKEN_EXPIRE_MINUTES: int = 10

    @property
    def DOWNLOAD_PATH(self) -> Path:
        """Folder do przechowywania wygenerowanych plików"""
        return Path(self.DOWNLOAD_DIR)


config = Config()

# ---------------- CREATE FOLDERS ----------------
# Tworzymy folder na feedback i pobrane pliki, jeśli nie istnieją
config.FEEDBACK_DIR.mkdir(parents=True, exist_ok=True)
config.DOWNLOAD_PATH.mkdir(parents=True, exist_ok=True)
