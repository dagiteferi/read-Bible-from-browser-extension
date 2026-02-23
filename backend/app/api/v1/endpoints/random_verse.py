from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.random_verse import RandomVerseRequest, RandomVerseResponse
from app.services.bible_service import BibleService

router = APIRouter()


@router.post("", response_model=RandomVerseResponse | None)
async def random_verse(
    payload: RandomVerseRequest | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Return single random verse. FR-4.1.1: filter by themes; FR-4.1.2: time of day."""
    payload = payload or RandomVerseRequest()
    svc = BibleService(db)
    verse = await svc.get_random_verse(
        themes=payload.themes,
        time_of_day=payload.time_of_day,
    )
    return verse
