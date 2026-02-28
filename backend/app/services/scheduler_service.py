from datetime import date, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.utils.time_helpers import calculate_active_minutes
from app.models import Plan, ReadingUnit
from app.utils.compensation import (
    calculate_missed_working_days,
    adjusted_verses_per_unit,
)
from app.utils.time_helpers import is_in_quiet_hours, next_valid_delivery_timestamp


class SchedulerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_plan_with_units(self, plan_id: UUID) -> Plan | None:
        r = await self.db.execute(
            select(Plan).where(Plan.id == plan_id)
        )
        return r.scalar_one_or_none()

    async def remaining_verses(self, plan_id: UUID) -> int:
        """Count verses in units that are still pending or delivered (not read)."""
        r = await self.db.execute(
            select(ReadingUnit)
            .where(
                ReadingUnit.plan_id == plan_id,
                ReadingUnit.state.in_(["pending", "delivered"]),
            )
            .order_by(ReadingUnit.unit_index)
        )
        units = r.scalars().all()
        return sum(u.verse_end - u.verse_start + 1 for u in units)

    async def calculate(
        self,
        plan_id: UUID,
        from_date: date | None = None,
    ) -> dict:
        """SRS: /plan/calculate/{id} - remaining verses, time, adjusted unit sizes."""
        plan = await self.get_plan_with_units(plan_id)
        if not plan:
            return {}
        from_date = from_date or date.today()
        target = plan.target_date or from_date
        remaining_verses = await self.remaining_verses(plan_id)
        remaining_days = max(0, (target - from_date).days) or 1
        frequency = plan.frequency or "daily"
      
        active_mins = calculate_active_minutes(plan.working_hours)
        deliveries_per_day = max(1, active_mins // plan.time_lap_minutes)

        missed = calculate_missed_working_days(
            target, from_date, frequency
        )
        new_vpu = adjusted_verses_per_unit(
            total_verses=0,  # not needed for this formula
            remaining_verses=remaining_verses,
            remaining_days=remaining_days,
            max_verses_per_unit=plan.max_verses_per_unit,
            frequency=frequency,
            missed_days=missed,
            deliveries_per_day=deliveries_per_day,
        )
        next_ts = next_valid_delivery_timestamp(
            plan.quiet_hours,
            None,
            datetime.now(),
        )
        return {
            "remaining_verses": remaining_verses,
            "remaining_days": remaining_days,
            "adjusted_verses_per_unit": new_vpu,
            "next_delivery_timestamp": next_ts.isoformat() if next_ts else None,
        }

    def offer_extension(self, plan: Plan, new_vpu: int) -> bool:
        """SRS FR-4.4.3: True if compensation would exceed max_verses_per_unit."""
        return new_vpu >= plan.max_verses_per_unit and new_vpu > 1
