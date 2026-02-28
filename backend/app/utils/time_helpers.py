from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

# Default to UTC if no TZ; extension can pass user TZ later
DEFAULT_TZ = ZoneInfo("UTC")


def _parse_time(s: str) -> time:
    """Parse 'HH:MM' or 'HH:MM:SS' to time."""
    parts = s.strip().split(":")
    h = int(parts[0]) if len(parts) > 0 else 0
    m = int(parts[1]) if len(parts) > 1 else 0
    return time(h, m)


def is_in_quiet_hours(quiet_hours: dict | None, now: datetime | None = None) -> bool:
    """SRS 4.7.1: Check if current time falls within quiet hours."""
    if not quiet_hours or not isinstance(quiet_hours, dict):
        return False
    start_s = quiet_hours.get("start")
    end_s = quiet_hours.get("end")
    if not start_s or not end_s:
        return False
    now = now or datetime.now(DEFAULT_TZ).time()
    if isinstance(now, datetime):
        now = now.time()
    start_t = _parse_time(start_s)
    end_t = _parse_time(end_s)
    if start_t <= end_t:  # e.g. 09:00 - 17:00
        return start_t <= now <= end_t
    # e.g. 22:00 - 06:00 (overnight)
    return now >= start_t or now <= end_t


def get_time_of_day(now: datetime | None = None) -> str:
    """SRS FR-4.1.2: morning / afternoon / evening."""
    now = now or datetime.now(DEFAULT_TZ)
    if isinstance(now, datetime) and now.tzinfo is None:
        now = now.replace(tzinfo=DEFAULT_TZ)
    hour = now.hour
    if 5 <= hour < 12:
        return "morning"
    if 12 <= hour < 17:
        return "afternoon"
    return "evening"


def next_valid_delivery_timestamp(
    quiet_hours: dict | None,
    working_hours: dict | None,
    from_dt: datetime | None = None,
) -> datetime | None:
    """Next moment when delivery is allowed (outside quiet hours)."""
    from_dt = from_dt or datetime.now(DEFAULT_TZ)
    if isinstance(from_dt, datetime) and from_dt.tzinfo is None:
        from_dt = from_dt.replace(tzinfo=DEFAULT_TZ)
    # Simple: if in quiet hours, return next end of quiet period
    if not quiet_hours:
        return from_dt
    end_s = quiet_hours.get("end")
    if not end_s:
        return from_dt
    end_t = _parse_time(end_s)
    candidate = from_dt.replace(
        hour=end_t.hour,
        minute=end_t.minute,
        second=0,
        microsecond=0,
    )
    if from_dt.time() >= end_t and end_t.hour < 12:
        candidate += timedelta(days=1)
    if candidate <= from_dt:
        candidate += timedelta(days=1)
    return candidate
def calculate_active_minutes(working_hours: dict | None) -> int:
    """Calculate duration of working hours in minutes."""
    if not working_hours:
        return 1440  # Default to 24 hours if not set
    start_s = working_hours.get("start")
    end_s = working_hours.get("end")
    if not start_s or not end_s:
        return 1440
    start_t = _parse_time(start_s)
    end_t = _parse_time(end_s)
    
    start_mins = start_t.hour * 60 + start_t.minute
    end_mins = end_t.hour * 60 + end_t.minute
    
    if start_mins <= end_mins:
        return end_mins - start_mins
    else:
        # Overnight: (midnight - start) + end
        return (1440 - start_mins) + end_mins
