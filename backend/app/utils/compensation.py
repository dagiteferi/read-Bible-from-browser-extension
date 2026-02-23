from datetime import date


def calculate_missed_working_days(
    target_date: date,
    start_date: date,
    frequency: str,  # 'daily' | 'weekly'
) -> int:
    """Approximate missed delivery opportunities (days or weeks)."""
    if target_date <= start_date:
        return 0
    delta = (target_date - start_date).days
    if frequency == "weekly":
        return max(0, delta // 7)
    return max(0, delta)


def adjusted_verses_per_unit(
    total_verses: int,
    remaining_verses: int,
    remaining_days: int,
    max_verses_per_unit: int,
    frequency: str,
    missed_days: int = 0,
) -> int:
    """SDS: new_verses_per_unit = min(max_verses_per_unit, (remaining + buffer) / remaining_days)."""
    if remaining_days <= 0:
        return max_verses_per_unit
    # Target: fit remaining_verses into remaining_days (daily) or remaining_weeks (weekly)
    if frequency == "weekly":
        remaining_units = max(1, remaining_days // 7)
    else:
        remaining_units = max(1, remaining_days)
    base = max(1, (remaining_verses + missed_days) // remaining_units)
    return min(base, max_verses_per_unit)
