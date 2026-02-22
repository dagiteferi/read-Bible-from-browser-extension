import uuid
from datetime import date, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Device, Plan, ReadingUnit
from app.schemas.plan import PlanCreate, PlanUpdate
from app.services.bible_service import BibleService


class PlanService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.bible = BibleService(db)

    async def get_or_create_device(self, device_id: uuid.UUID | None) -> uuid.UUID:
        """Return device_id (create device if needed)."""
        if device_id:
            r = await self.db.execute(select(Device).where(Device.id == device_id))
            if r.scalar_one_or_none():
                return device_id
        dev = Device(id=device_id or uuid.uuid4())
        self.db.add(dev)
        await self.db.flush()
        return dev.id

    async def create_plan(self, device_id: uuid.UUID | None, payload: PlanCreate) -> Plan:
        """SRS: Create plan; precompute units using metadata. SDS segmentation."""
        did = await self.get_or_create_device(device_id)
        # Validate books and get metadata for each
        total_verses = 0
        book_meta: list[tuple[str, list[int]]] = []  # (book, verse_counts per chapter)
        for book in payload.books:
            meta = await self.bible.get_metadata(book)
            if not meta:
                raise ValueError(f"Book not found: {book}")
            book_meta.append((book, meta.verse_counts))

        # Boundaries: optional {chapter_start, verse_start, chapter_end, verse_end}
        b = payload.boundaries or {}
        ch_start = b.get("chapter_start", 1)
        v_start = b.get("verse_start", 1)
        ch_end = b.get("chapter_end")
        v_end = b.get("verse_end")

        # Compute total verses in selected range (same logic as _segment)
        for i, (book, v_counts) in enumerate(book_meta):
            nch = len(v_counts)
            if len(payload.books) == 1:
                start_ch, start_v = ch_start, v_start
                end_ch = ch_end if ch_end is not None else nch
                end_v = v_end if v_end is not None else (v_counts[end_ch - 1] if end_ch <= nch else 1)
            else:
                if i == 0:
                    start_ch, start_v = ch_start, v_start
                    end_ch, end_v = nch, v_counts[nch - 1] if v_counts else 1
                elif i == len(payload.books) - 1:
                    start_ch, start_v = 1, 1
                    end_ch = ch_end if ch_end is not None else nch
                    end_v = v_end if v_end is not None else (v_counts[end_ch - 1] if end_ch <= nch else 1)
                else:
                    start_ch, start_v = 1, 1
                    end_ch, end_v = nch, v_counts[nch - 1] if v_counts else 1
            for c in range(start_ch, end_ch + 1):
                vc = v_counts[c - 1] if c <= nch else 0
                low = start_v if c == start_ch else 1
                high = end_v if c == end_ch else vc
                total_verses += max(0, high - low + 1)

        # SDS: target_units, base_verses_per_unit, verses_per_unit
        today = date.today()
        target_date = payload.target_date or today
        days_remaining = max(0, (target_date - today).days) or 1
        frequency = payload.frequency or "daily"
        target_units = days_remaining * (1 if frequency == "daily" else 7)
        target_units = max(1, target_units)
        base_verses_per_unit = max(1, total_verses // target_units)
        verses_per_unit = min(base_verses_per_unit, payload.max_verses_per_unit)

        plan = Plan(
            device_id=did,
            books=payload.books,
            boundaries=payload.boundaries,
            target_date=payload.target_date,
            frequency=payload.frequency,
            quiet_hours=payload.quiet_hours,
            max_verses_per_unit=payload.max_verses_per_unit,
            state="active",
        )
        self.db.add(plan)
        await self.db.flush()

        # Segment: produce reading_units (book, chapter, verse_start, verse_end)
        units = self._segment(book_meta, payload.books, payload.boundaries, verses_per_unit)
        for idx, (book, chapter, vs, ve) in enumerate(units):
            self.db.add(
                ReadingUnit(
                    plan_id=plan.id,
                    book=book,
                    chapter=chapter,
                    verse_start=vs,
                    verse_end=ve,
                    unit_index=idx,
                    state="pending",
                )
            )
        await self.db.flush()
        return plan

    def _segment(
        self,
        book_meta: list[tuple[str, list[int]]],
        books: list[str],
        boundaries: dict | None,
        verses_per_unit: int,
    ) -> list[tuple[str, int, int, int]]:
        """Produce list of (book, chapter, verse_start, verse_end) for each unit."""
        b = boundaries or {}
        ch_start = b.get("chapter_start", 1)
        v_start = b.get("verse_start", 1)
        ch_end = b.get("chapter_end")
        v_end = b.get("verse_end")
        out: list[tuple[str, int, int, int]] = []
        acc = 0
        unit_book, unit_ch, unit_vs, unit_ve = "", 0, 0, 0

        for bi, (book, v_counts) in enumerate(book_meta):
            nch = len(v_counts)
            if len(books) == 1:
                start_ch, start_v = ch_start, v_start
                end_ch = ch_end if ch_end is not None else nch
                end_v = v_end if v_end is not None else (v_counts[end_ch - 1] if end_ch <= nch else 1)
            else:
                if bi == 0:
                    start_ch, start_v = ch_start, v_start
                    end_ch, end_v = nch, v_counts[nch - 1] if v_counts else 1
                elif bi == len(books) - 1:
                    start_ch, start_v = 1, 1
                    end_ch = ch_end if ch_end is not None else nch
                    end_v = v_end if v_end is not None else (v_counts[end_ch - 1] if end_ch <= nch else 1)
                else:
                    start_ch, start_v = 1, 1
                    end_ch, end_v = nch, v_counts[nch - 1] if v_counts else 1

            for c in range(start_ch, end_ch + 1):
                vc = v_counts[c - 1] if c <= len(v_counts) else 0
                low = start_v if c == start_ch else 1
                high = end_v if c == end_ch else vc
                for v in range(low, high + 1):
                    if acc == 0:
                        unit_book, unit_ch, unit_vs, unit_ve = book, c, v, v
                        acc = 1
                    else:
                        if unit_book == book and unit_ch == c and unit_ve == v - 1 and acc < verses_per_unit:
                            unit_ve = v
                            acc += 1
                        else:
                            out.append((unit_book, unit_ch, unit_vs, unit_ve))
                            unit_book, unit_ch, unit_vs, unit_ve = book, c, v, v
                            acc = 1
                    if acc == verses_per_unit:
                        out.append((unit_book, unit_ch, unit_vs, unit_ve))
                        acc = 0
        if acc > 0:
            out.append((unit_book, unit_ch, unit_vs, unit_ve))
        return out

    async def get_plan(self, plan_id: uuid.UUID) -> Plan | None:
        r = await self.db.execute(select(Plan).where(Plan.id == plan_id))
        return r.scalar_one_or_none()

    async def update_plan(self, plan_id: uuid.UUID, payload: PlanUpdate) -> Plan | None:
        plan = await self.get_plan(plan_id)
        if not plan:
            return None
        if payload.books is not None:
            plan.books = payload.books
        if payload.boundaries is not None:
            plan.boundaries = payload.boundaries
        if payload.target_date is not None:
            plan.target_date = payload.target_date
        if payload.frequency is not None:
            plan.frequency = payload.frequency
        if payload.quiet_hours is not None:
            plan.quiet_hours = payload.quiet_hours
        if payload.max_verses_per_unit is not None:
            plan.max_verses_per_unit = payload.max_verses_per_unit
        if payload.state is not None:
            plan.state = payload.state
        plan.updated_at = datetime.utcnow()
        await self.db.flush()
        return plan
