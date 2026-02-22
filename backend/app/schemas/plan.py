from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field


class PlanCreate(BaseModel):
    """SRS: /plan/create body. Optional device_id for anonymous device."""

    device_id: UUID | None = None
    books: list[str] = Field(..., min_length=1, description="Array of book names")
    boundaries: dict | None = Field(
        None,
        description="chapter_start, verse_start, chapter_end, verse_end",
    )
    target_date: date | None = None
    frequency: str | None = Field(None, pattern="^(daily|weekly)$")
    quiet_hours: dict | None = Field(None, description='{"start":"22:00","end":"06:00"}')
    max_verses_per_unit: int = Field(3, ge=1, le=50)


class PlanUpdate(BaseModel):
    """SRS: /plan/{id}/update body."""

    books: list[str] | None = None
    boundaries: dict | None = None
    target_date: date | None = None
    frequency: str | None = None
    quiet_hours: dict | None = None
    max_verses_per_unit: int | None = None
    state: str | None = Field(None, pattern="^(active|paused|completed)$")


class ReadingUnitInPlan(BaseModel):
    """Reading unit as part of plan response (SRS Appendix B)."""

    id: UUID
    book: str
    chapter: int
    verse_start: int
    verse_end: int
    verse_range: dict  # {"start": int, "end": int}
    index: int
    state: str  # pending, delivered, read

    class Config:
        from_attributes = True


class PlanResponse(BaseModel):
    """SRS: Plan schema with units."""

    id: UUID
    device_id: UUID
    books: list[str]
    boundaries: dict | None
    target_date: date | None
    frequency: str | None
    quiet_hours: dict | None
    max_verses_per_unit: int
    state: str
    units: list[ReadingUnitInPlan] = []

    class Config:
        from_attributes = True


class PlanCalculateResponse(BaseModel):
    """SRS: /plan/calculate/{id} response."""

    remaining_verses: int
    remaining_days: int
    adjusted_verses_per_unit: int | None = None
    next_delivery_timestamp: str | None = None
