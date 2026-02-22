from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base


class BibleBook(Base):
    """Book metadata from data/individual_books/*.json (title, abbv, order)."""

    __tablename__ = "bible_books"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    book_number: Mapped[int] = mapped_column(Integer, nullable=False, unique=True)  # from filename 01_, 02_, ...
    title: Mapped[str] = mapped_column(Text, nullable=False)
    abbv: Mapped[str] = mapped_column(Text, nullable=False, server_default="")

    verses = relationship("BibleVerse", back_populates="book", cascade="all, delete-orphan")


class BibleVerse(Base):
    """One verse from a book: book_id, chapter, verse_number, text. From individual_books chapters[].verses[]."""

    __tablename__ = "bible_verses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    book_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("bible_books.id", ondelete="CASCADE"),
        nullable=False,
    )
    chapter: Mapped[int] = mapped_column(Integer, nullable=False)
    verse_number: Mapped[int] = mapped_column(Integer, nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)

    book = relationship("BibleBook", back_populates="verses")
