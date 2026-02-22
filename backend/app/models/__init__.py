from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from app.models.device import Device
from app.models.feedback import Feedback
from app.models.plan import Plan
from app.models.reading_unit import ReadingUnit

__all__ = ["Base", "Device", "Plan", "ReadingUnit", "Feedback"]
