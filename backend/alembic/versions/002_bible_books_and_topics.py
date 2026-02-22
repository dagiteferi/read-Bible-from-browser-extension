from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "bible_books",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("book_number", sa.Integer(), nullable=False),
        sa.Column("title", sa.Text(), nullable=False),
        sa.Column("abbv", sa.Text(), nullable=False, server_default=""),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("book_number", name="uq_bible_books_book_number"),
    )
    op.create_index("idx_bible_books_book_number", "bible_books", ["book_number"], unique=True)

    op.create_table(
        "bible_verses",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("book_id", sa.Integer(), sa.ForeignKey("bible_books.id", ondelete="CASCADE"), nullable=False),
        sa.Column("chapter", sa.Integer(), nullable=False),
        sa.Column("verse_number", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("book_id", "chapter", "verse_number", name="uq_bible_verses_book_chapter_verse"),
    )
    op.create_index("idx_bible_verses_book_id", "bible_verses", ["book_id"], unique=False)

    op.create_table(
        "bible_topics",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("topic", sa.Text(), nullable=False),
        sa.Column("source_url", sa.Text(), nullable=False, server_default=""),
        sa.Column("topic_index", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_bible_topics_topic_index", "bible_topics", ["topic_index"], unique=False)

    op.create_table(
        "bible_topic_verses",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("topic_id", sa.Integer(), sa.ForeignKey("bible_topics.id", ondelete="CASCADE"), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("book_and_verse", sa.Text(), nullable=False, server_default=""),
        sa.Column("verse_index", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("idx_bible_topic_verses_topic_id", "bible_topic_verses", ["topic_id"], unique=False)


def downgrade() -> None:
    op.drop_index("idx_bible_topic_verses_topic_id", table_name="bible_topic_verses")
    op.drop_table("bible_topic_verses")
    op.drop_index("idx_bible_topics_topic_index", table_name="bible_topics")
    op.drop_table("bible_topics")
    op.drop_index("idx_bible_verses_book_id", table_name="bible_verses")
    op.drop_table("bible_verses")
    op.drop_index("idx_bible_books_book_number", table_name="bible_books")
    op.drop_table("bible_books")
