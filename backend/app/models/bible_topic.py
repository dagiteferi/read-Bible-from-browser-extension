from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class BibleTopic(Base):
    """Topic from amharic_bible_topics.json (topic name, source_url, order)."""

    __tablename__ = "bible_topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic: Mapped[str] = mapped_column(Text, nullable=False)
    source_url: Mapped[str] = mapped_column(Text, nullable=False, server_default="")
    topic_index: Mapped[int] = mapped_column(Integer, nullable=False)  # order in JSON

    verses = relationship("BibleTopicVerse", back_populates="topic", cascade="all, delete-orphan")


class BibleTopicVerse(Base):
    """One verse under a topic: text, book_and_verse. From amharic_bible_topics topics[].verses[]."""

    __tablename__ = "bible_topic_verses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("bible_topics.id", ondelete="CASCADE"),
        nullable=False,
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    book_and_verse: Mapped[str] = mapped_column(Text, nullable=False, server_default="")
    verse_index: Mapped[int] = mapped_column(Integer, nullable=False)  # order within topic

    topic = relationship("BibleTopic", back_populates="verses")
