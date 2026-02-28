from datetime import date, datetime
import uuid

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    device_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("devices.id", ondelete="CASCADE"),
        nullable=False,
    )
    books: Mapped[list] = mapped_column(JSONB, nullable=False)  # ["Luke"]
    boundaries: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # chapter_start, verse_start, ...
    target_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    frequency: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )  # CHECK in migration
    quiet_hours: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # {"start":"22:00","end":"06:00"}
    working_hours: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # {"start":"08:00","end":"17:00"}
    max_verses_per_unit: Mapped[int] = mapped_column(Integer, nullable=False, default=3)
    time_lap_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=60)
    state: Mapped[str] = mapped_column(Text, nullable=False, default="active")  # active, paused, completed
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    device = relationship("Device", back_populates="plans")
    reading_units = relationship("ReadingUnit", back_populates="plan", cascade="all, delete-orphan")
