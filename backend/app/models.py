from pydantic import BaseModel
from typing import List, Dict, Any

class FeedbackRequest(BaseModel):
    message: str

class FeedbackResponse(BaseModel):
    status: str
    detail: str | None = None
    feedbacks: List[Dict[str, Any]] | None = None
