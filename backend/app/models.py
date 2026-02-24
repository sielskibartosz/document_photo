from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class FeedbackRequest(BaseModel):
    message: str

class FeedbackResponse(BaseModel):
    status: str
    detail: str | None = None
    feedbacks: List[Dict[str, Any]] | None = None

class CreateLinkRequest(BaseModel):
    price_id: str
    token: str
    redirect_url: str
    ga_client_id: Optional[str] = None

class CreateDownloadRequest(BaseModel):
    image_base64: str