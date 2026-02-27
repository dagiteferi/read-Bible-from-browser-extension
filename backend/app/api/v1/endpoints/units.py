from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import ReadingUnit
from app.schemas.unit import UnitReadResponse, ReadingUnitResponse

router = APIRouter()


@router.get("/{id}", response_model=ReadingUnitResponse)
async def get_unit(id: UUID, db: AsyncSession = Depends(get_db)):
    """Fetch unit text and metadata for display."""
    r = await db.execute(select(ReadingUnit).where(ReadingUnit.id == id))
    unit = r.scalar_one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    from app.services.bible_service import BibleService
    svc = BibleService(db)
    verses = await svc.get_verse_range(unit.book, unit.chapter, unit.verse_start, unit.verse_end)
    text = " ".join([v.text for v in verses])
    
    return {
        "id": unit.id,
        "book": unit.book,
        "chapter": unit.chapter,
        "verse_start": unit.verse_start,
        "verse_end": unit.verse_end,
        "unit_index": unit.unit_index,
        "state": unit.state,
        "text": text
    }


@router.put("/{id}/read", response_model=UnitReadResponse)
async def mark_unit_read(id: UUID, db: AsyncSession = Depends(get_db)):
    """Mark unit as read. SRS: Advances plan; sync backend/local."""
    r = await db.execute(select(ReadingUnit).where(ReadingUnit.id == id))
    unit = r.scalar_one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    if unit.state == "read":
        return UnitReadResponse(message="Already read", unit_id=id)
    unit.state = "read"
    unit.read_at = datetime.utcnow()
    await db.flush()
    return UnitReadResponse(unit_id=id)
