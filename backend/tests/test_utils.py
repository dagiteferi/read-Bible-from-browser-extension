"""Unit tests for utils (SRS/SDS traceability). No DB required."""

from datetime import datetime, time
from zoneinfo import ZoneInfo

import pytest

from app.utils.time_helpers import (
    is_in_quiet_hours,
    get_time_of_day,
    next_valid_delivery_timestamp,
)
from app.utils.compensation import (
    calculate_missed_working_days,
    adjusted_verses_per_unit,
)


class TestTimeHelpers:
    """FR-4.7.1, SDS: quiet hours."""

    def test_quiet_hours_none(self):
        assert is_in_quiet_hours(None) is False
        assert is_in_quiet_hours({}) is False

    def test_quiet_hours_within(self):
        # 22:00 - 06:00: at 23:00 we're in
        q = {"start": "22:00", "end": "06:00"}
        t = datetime(2026, 2, 22, 23, 0, 0).time()
        assert is_in_quiet_hours(q, t) is True
        t2 = datetime(2026, 2, 22, 2, 0, 0).time()
        assert is_in_quiet_hours(q, t2) is True

    def test_quiet_hours_outside(self):
        q = {"start": "22:00", "end": "06:00"}
        t = datetime(2026, 2, 22, 12, 0, 0).time()
        assert is_in_quiet_hours(q, t) is False

    def test_get_time_of_day_morning(self):
        dt = datetime(2026, 2, 22, 8, 0, 0)
        assert get_time_of_day(dt) == "morning"

    def test_get_time_of_day_afternoon(self):
        dt = datetime(2026, 2, 22, 14, 0, 0)
        assert get_time_of_day(dt) == "afternoon"

    def test_get_time_of_day_evening(self):
        dt = datetime(2026, 2, 22, 20, 0, 0)
        assert get_time_of_day(dt) == "evening"


class TestCompensation:
    """SDS: compensation logic - increase verses per unit, never frequency."""

    def test_calculate_missed_working_days_daily(self):
        from datetime import date
        target = date(2026, 3, 1)
        start = date(2026, 2, 22)
        assert calculate_missed_working_days(target, start, "daily") == 7

    def test_adjusted_verses_per_unit_respects_max(self):
        vpu = adjusted_verses_per_unit(
            total_verses=100,
            remaining_verses=50,
            remaining_days=5,
            max_verses_per_unit=3,
            frequency="daily",
            missed_days=0,
        )
        assert vpu <= 3
        assert vpu >= 1

    def test_adjusted_verses_per_unit_weekly(self):
        vpu = adjusted_verses_per_unit(
            total_verses=0,
            remaining_verses=21,
            remaining_days=14,
            max_verses_per_unit=5,
            frequency="weekly",
            missed_days=0,
        )
        assert vpu >= 1
        assert vpu <= 5
