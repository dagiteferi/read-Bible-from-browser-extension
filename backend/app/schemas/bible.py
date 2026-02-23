from pydantic import BaseModel


class MetadataResponse(BaseModel):
    """SRS: GET /metadata/{book} - chapter/verse counts and tags."""

    book: str
    chapter_count: int
    verse_counts: list[int]  # Per-chapter verse counts
    tags: list[str] = []  # Thematic tags (from topics if applicable)


class VerseResponse(BaseModel):
    """SRS: Verse schema from dataset."""

    book: str
    chapter: int
    verse: int
    text: str
