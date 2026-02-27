from datetime import date
from uuid import UUID

from pydantic import BaseModel, Field


class BoundarySchema(BaseModel):
    chapter_start: int = Field(1, ge=1)
    verse_start: int = Field(1, ge=1)
    chapter_end: int | None = Field(None, ge=1)
    verse_end: int | None = Field(None, ge=1)

class QuietHoursSchema(BaseModel):
    start: str = Field(..., pattern="^[0-2][0-9]:[0-5][0-9]$", description="Start time in HH:MM format")
    end: str = Field(..., pattern="^[0-2][0-9]:[0-5][0-9]$", description="End time in HH:MM format")

class PlanCreate(BaseModel):
    """SRS: /plan/create body. Optional device_id for anonymous device."""

    device_id: UUID | None = Field(None, description="Optional unique identifier for the device")
    books: list[str] = Field(
        ..., 
        min_length=1, 
        description="Array of book names (e.g., ['ኦሪት ዘፍጥረት'])",
        examples=[["ኦሪት ዘፍጥረት"]]
    )
    boundaries: BoundarySchema | None = Field(
        None,
        description="Optional range of chapters/verses to include",
    )
    target_date: date | None = Field(
        None, 
        description="Date by which you want to finish reading",
        examples=["2026-12-31"]
    )
    frequency: str | None = Field(
        "daily", 
        pattern="^(daily|weekly)$",
        description="Reading frequency"
    )
    quiet_hours: QuietHoursSchema | None = Field(
        None, 
        description="Time periods when notifications should be paused"
    )
    max_verses_per_unit: int = Field(3, ge=1, le=50, description="Maximum verses delivered in a single notification")
    deliveries_per_day: int = Field(1, ge=1, le=24, description="Number of notifications to send per working day")

    model_config = {
        "json_schema_extra": {
            "example": {
                "device_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "books": ["ኦሪት ዘፍጥረት"],
                "target_date": "2026-06-30",
                "frequency": "daily",
                "max_verses_per_unit": 5,
                "quiet_hours": {
                    "start": "22:00",
                    "end": "06:00"
                }
            }
        }
    }


class PlanUpdate(BaseModel):
    """SRS: /plan/{id}/update body."""

    books: list[str] | None = None
    boundaries: BoundarySchema | None = None
    target_date: date | None = None
    frequency: str | None = None
    quiet_hours: QuietHoursSchema | None = None
    max_verses_per_unit: int | None = None
    deliveries_per_day: int | None = None
    state: str | None = Field(None, pattern="^(active|paused|completed)$")


class VerseRangeSchema(BaseModel):
    start: int
    end: int

class ReadingUnitInPlan(BaseModel):
    """Reading unit as part of plan response (SRS Appendix B)."""

    id: UUID
    book: str
    chapter: int
    verse_start: int
    verse_end: int
    unit_index: int
    state: str  # pending, delivered, read

    class Config:
        from_attributes = True


class PlanResponse(BaseModel):
    """SRS: Plan schema with units."""

    id: UUID
    device_id: UUID
    books: list[str]
    boundaries: BoundarySchema | None
    target_date: date | None
    frequency: str | None
    quiet_hours: QuietHoursSchema | None
    max_verses_per_unit: int
    deliveries_per_day: int
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


class DailyHistoryItem(BaseModel):
    date: date
    verses_read: int

class PlanProgress(BaseModel):
    """Used for /v1/plan/{id}/progress."""
    completed_units: int
    total_units: int
    completed_verses: int
    total_verses: int
    daily_history: list[DailyHistoryItem] = []
