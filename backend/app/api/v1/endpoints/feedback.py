from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Device, Feedback
from app.schemas.feedback import FeedbackSubmit

router = APIRouter()


@router.post("/submit", response_model=dict)
async def submit_feedback(payload: FeedbackSubmit, db: AsyncSession = Depends(get_db)):
    """Submit user feedback. SRS: Store anonymously."""
    device_id = None
    if payload.device_id:
        try:
            device_id = UUID(payload.device_id)
        except ValueError:
            pass
    if payload.rating is None and not payload.suggestion and not payload.issue:
        raise HTTPException(status_code=400, detail="At least one of rating, suggestion, or issue required")
    fb = Feedback(
        device_id=device_id,
        rating=payload.rating,
        suggestion=payload.suggestion,
        issue=payload.issue,
    )
    db.add(fb)
    await db.flush()
    return {"message": "Feedback submitted"}
