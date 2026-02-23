from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.bible_service import BibleService

router = APIRouter()
router_metadata = APIRouter()
router_verses = APIRouter()


@router.get("", response_model=list[str])
async def list_books(db: AsyncSession = Depends(get_db)):
    """List all book names from metadata. SRS: <100ms."""
    svc = BibleService(db)
    return await svc.list_books()


@router_metadata.get("/{book}", response_model=dict)
async def get_metadata(book: str, db: AsyncSession = Depends(get_db)):
    """Get chapter/verse counts and tags for a book. SRS: 404 if not found."""
    svc = BibleService(db)
    meta = await svc.get_metadata(book)
    if not meta:
        raise HTTPException(status_code=404, detail="Book not found")
    return meta.model_dump()


@router_verses.get("/{book}/{chapter}/{start}/{end}", response_model=list[dict])
async def get_verses(
    book: str, chapter: int, start: int, end: int, db: AsyncSession = Depends(get_db)
):
    """Fetch verse texts in range. SRS: contiguous range, no modification."""
    if start > end or start < 1 or end < 1:
        raise HTTPException(status_code=400, detail="Invalid verse range")
    svc = BibleService(db)
    verses = await svc.get_verse_range(book, chapter, start, end)
    return [v.model_dump() for v in verses]
