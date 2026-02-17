from fastapi import APIRouter, Request, HTTPException
from app.models import FeedbackResponse
from app.config import config

from app.services.feedback_service import save_feedback, load_feedbacks

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("/", response_model=FeedbackResponse)
async def submit_feedback(request: Request):
    """Submit user feedback."""
    try:
        data = await request.json()
        message = data.get("message", "").strip()

        if not message:
            raise HTTPException(status_code=400, detail="Brak wiadomości")

        if len(message) > config.MAX_FEEDBACK_LENGTH:
            raise HTTPException(status_code=400, detail=f"Wiadomość za długa (max {config.MAX_FEEDBACK_LENGTH} znaków)")

        save_feedback(message)
        return FeedbackResponse(status="ok")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Błąd serwera")


@router.get("/view/{key}", response_model=FeedbackResponse)
async def view_feedback(key: str):
    """View feedback entries (admin only)."""
    if key != config.ADMIN_KEY:
        raise HTTPException(status_code=401, detail="Brak dostępu")

    feedbacks = load_feedbacks()
    return FeedbackResponse(status="ok", feedbacks=feedbacks)
