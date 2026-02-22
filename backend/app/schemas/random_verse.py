from pydantic import BaseModel, Field


class RandomVerseRequest(BaseModel):
    """SDS: POST /v1/random-verse. Themes = topic names from metadata tags."""

    themes: list[str] = Field(default_factory=list, description="Filter by theme/topic names")
    time_of_day: str | None = Field(
        None,
        pattern="^(morning|afternoon|evening)$",
        description="Optional tone adaptation",
    )


class RandomVerseResponse(BaseModel):
    """Single verse for random mode (SRS FR-4.1.1)."""

    book: str
    chapter: int
    verse: int
    text: str
    book_and_verse: str | None = None  # Human-readable reference
