from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models import Plan, ReadingUnit
from app.schemas.plan import PlanCreate, PlanUpdate, PlanResponse, PlanCalculateResponse, ReadingUnitInPlan, PlanProgress
from app.schemas.unit import NextUnitResponse, ReadingUnitResponse
from app.services.bible_service import BibleService
from app.services.plan_service import PlanService
from app.services.scheduler_service import SchedulerService

router = APIRouter()


@router.get("/{id}/progress", response_model=PlanProgress)
async def get_plan_progress(id: UUID, db: AsyncSession = Depends(get_db)):
    """Return progress stats for the plan."""
    svc = PlanService(db)
    progress = await svc.get_plan_progress(id)
    if not progress:
        raise HTTPException(status_code=404, detail="Plan not found")
    return progress


@router.post("/create", response_model=dict)
async def create_plan(payload: PlanCreate, db: AsyncSession = Depends(get_db)):
    """Create new plan. SRS: Precompute units; return plan ID."""
    svc = PlanService(db)
    try:
        plan = await svc.create_plan(payload.device_id, payload)
        return {"plan_id": str(plan.id), "message": "Plan created"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/calculate/{id}", response_model=PlanCalculateResponse)
async def plan_calculate(id: UUID, db: AsyncSession = Depends(get_db)):
    """Recalculate remaining verses, time, adjusted unit sizes. SRS."""
    svc = SchedulerService(db)
    data = await svc.calculate(id)
    if not data:
        raise HTTPException(status_code=404, detail="Plan not found")
    return PlanCalculateResponse(**data)


@router.get("/{id}", response_model=PlanResponse)
async def get_plan(id: UUID, db: AsyncSession = Depends(get_db)):
    """Get plan state including units and read statuses. SRS."""
    r = await db.execute(select(Plan).where(Plan.id == id))
    plan = r.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    r2 = await db.execute(
        select(ReadingUnit).where(ReadingUnit.plan_id == id).order_by(ReadingUnit.unit_index)
    )
    units = r2.scalars().all()
    unit_list = [
        ReadingUnitInPlan(
            id=u.id,
            book=u.book,
            chapter=u.chapter,
            verse_start=u.verse_start,
            verse_end=u.verse_end,
            unit_index=u.unit_index,
            state=u.state,
        )
        for u in units
    ]
    return PlanResponse(
        id=plan.id,
        device_id=plan.device_id,
        books=plan.books,
        boundaries=plan.boundaries,
        target_date=plan.target_date,
        frequency=plan.frequency,
        quiet_hours=plan.quiet_hours,
        max_verses_per_unit=plan.max_verses_per_unit,
        deliveries_per_day=plan.deliveries_per_day,
        state=plan.state,
        units=unit_list,
    )


@router.put("/{id}/update", response_model=dict)
async def update_plan(id: UUID, payload: PlanUpdate, db: AsyncSession = Depends(get_db)):
    """Modify plan (pause/extend/modify). SRS: Recalculate; preserve read states."""
    svc = PlanService(db)
    plan = await svc.update_plan(id, payload)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"message": "Plan updated", "id": str(id)}


@router.get("/{id}/next-unit", response_model=NextUnitResponse)
async def get_next_unit(id: UUID, db: AsyncSession = Depends(get_db)):
    """SDS: Used by service worker. First pending unit with text."""
    r = await db.execute(
        select(ReadingUnit).where(
            ReadingUnit.plan_id == id,
            ReadingUnit.state == "pending",
        ).order_by(ReadingUnit.unit_index).limit(1)
    )
    unit = r.scalar_one_or_none()
    if not unit:
        return NextUnitResponse(unit=None, message="No pending unit")
    bible = BibleService(db)
    verses = await bible.get_verse_range(
        unit.book, unit.chapter, unit.verse_start, unit.verse_end
    )
    text = " ".join(v.text for v in verses)
    return NextUnitResponse(
        unit=ReadingUnitResponse(
            id=unit.id,
            book=unit.book,
            chapter=unit.chapter,
            verse_start=unit.verse_start,
            verse_end=unit.verse_end,
            text=text,
            unit_index=unit.unit_index,
            state=unit.state,
        )
    )


@router.put("/{id}/extend", response_model=dict)
async def extend_plan(
    id: UUID,
    additional_days: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Extend plan (e.g. push target_date). FR-4.4.3: Recalculate units dynamically; preserve read states."""
    svc = PlanService(db)
    plan = await svc.extend_plan(id, additional_days=additional_days)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {
        "message": "Plan extended",
        "id": str(id),
        "new_target_date": str(plan.target_date) if plan.target_date else None,
    }
