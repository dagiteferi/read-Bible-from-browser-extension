from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "devices",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "last_seen",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )

    op.create_table(
        "plans",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("device_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("devices.id", ondelete="CASCADE"), nullable=False),
        sa.Column("books", postgresql.JSONB(), nullable=False),
        sa.Column("boundaries", postgresql.JSONB(), nullable=True),
        sa.Column("target_date", sa.Date(), nullable=True),
        sa.Column("frequency", sa.Text(), nullable=True),
        sa.Column("quiet_hours", postgresql.JSONB(), nullable=True),
        sa.Column("max_verses_per_unit", sa.Integer(), nullable=False, server_default="3"),
        sa.Column("state", sa.Text(), nullable=False, server_default="active"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("frequency IS NULL OR frequency IN ('daily','weekly')", name="plans_frequency_check"),
        sa.CheckConstraint("state IN ('active','paused','completed')", name="plans_state_check"),
    )
    op.create_index("idx_plans_device", "plans", ["device_id"], unique=False)

    op.create_table(
        "reading_units",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("plan_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("plans.id", ondelete="CASCADE"), nullable=False),
        sa.Column("book", sa.Text(), nullable=False),
        sa.Column("chapter", sa.Integer(), nullable=False),
        sa.Column("verse_start", sa.Integer(), nullable=False),
        sa.Column("verse_end", sa.Integer(), nullable=False),
        sa.Column("unit_index", sa.Integer(), nullable=False),
        sa.Column("state", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("delivered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("plan_id", "unit_index", name="unique_unit"),
        sa.CheckConstraint("state IN ('pending','delivered','read')", name="reading_units_state_check"),
    )
    op.create_index("idx_units_plan", "reading_units", ["plan_id"], unique=False)

    op.create_table(
        "feedback",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("device_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("devices.id", ondelete="SET NULL"), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("suggestion", sa.Text(), nullable=True),
        sa.Column("issue", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("rating IS NULL OR (rating BETWEEN 1 AND 5)", name="feedback_rating_check"),
    )


def downgrade() -> None:
    op.drop_table("feedback")
    op.drop_index("idx_units_plan", table_name="reading_units")
    op.drop_table("reading_units")
    op.drop_index("idx_plans_device", table_name="plans")
    op.drop_table("plans")
    op.drop_table("devices")
