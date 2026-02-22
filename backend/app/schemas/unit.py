from uuid import UUID

from pydantic import BaseModel


class ReadingUnitResponse(BaseModel):
    """Reading unit with optional text (SRS Appendix B)."""

    id: UUID
    book: str
    chapter: int
    verse_start: int
    verse_end: int
    verse_range: dict  # {"start": int, "end": int}
    text: str = ""
    index: int
    state: str  # pending, delivered, read

    class Config:
        from_attributes = True


class UnitReadResponse(BaseModel):
    """SRS: PUT /unit/{id}/read response."""

    message: str = "Unit marked as read"
    unit_id: UUID


class NextUnitResponse(BaseModel):
    """SDS: GET /v1/plan/{id}/next-unit - unit with text for notification."""

    unit: ReadingUnitResponse | None = None
    message: str | None = None  # e.g. "No pending unit"
