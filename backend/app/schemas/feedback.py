from pydantic import BaseModel, Field


class FeedbackSubmit(BaseModel):
    """SRS: POST /feedback/submit body."""

    device_id: str | None = None
    rating: int | None = Field(None, ge=1, le=5)
    suggestion: str | None = None
    issue: str | None = None
