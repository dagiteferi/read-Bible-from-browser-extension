import random
from collections import defaultdict

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import BibleBook, BibleVerse, BibleTopic, BibleTopicVerse
from app.schemas.bible import MetadataResponse, VerseResponse
from app.schemas.random_verse import RandomVerseResponse


class BibleService:
    """Read-only Bible data from PostgreSQL."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_books(self) -> list[str]:
        """SRS: GET /books - list all book names (titles)."""
        r = await self.db.execute(
            select(BibleBook.title).order_by(BibleBook.book_number)
        )
        return [row[0] for row in r.scalars().all()]

    async def get_metadata(self, book: str) -> MetadataResponse | None:
        """SRS: GET /metadata/{book} - chapter count, verse counts per chapter, tags."""
        book_row = await self.db.execute(
            select(BibleBook).where(BibleBook.title == book)
        )
        b = book_row.scalar_one_or_none()
        if not b:
            return None
        # Verse counts per chapter
        r = await self.db.execute(
            select(BibleVerse.chapter, func.count(BibleVerse.id))
            .where(BibleVerse.book_id == b.id)
            .group_by(BibleVerse.chapter)
            .order_by(BibleVerse.chapter)
        )
        rows = r.all()
        chapter_count = len(rows)
        verse_counts = [count for _, count in rows]
        return MetadataResponse(
            book=book,
            chapter_count=chapter_count,
            verse_counts=verse_counts,
            tags=[],  # SRS: optional thematic tags; we could derive from topics
        )

    async def get_verse_range(
        self, book: str, chapter: int, start: int, end: int
    ) -> list[VerseResponse]:
        """SRS: GET /verses/{book}/{chapter}/{start}/{end} - contiguous verse texts."""
        book_row = await self.db.execute(
            select(BibleBook).where(BibleBook.title == book)
        )
        b = book_row.scalar_one_or_none()
        if not b:
            return []
        r = await self.db.execute(
            select(BibleVerse)
            .where(
                BibleVerse.book_id == b.id,
                BibleVerse.chapter == chapter,
                BibleVerse.verse_number >= start,
                BibleVerse.verse_number <= end,
            )
            .order_by(BibleVerse.verse_number)
        )
        verses = r.scalars().all()
        return [
            VerseResponse(book=book, chapter=chapter, verse=v.verse_number, text=v.text)
            for v in verses
        ]

    async def count_verses_in_range(
        self,
        book: str,
        chapter_start: int,
        verse_start: int,
        chapter_end: int,
        verse_end: int,
    ) -> int:
        """SDS: For plan segmentation."""
        book_row = await self.db.execute(
            select(BibleBook).where(BibleBook.title == book)
        )
        b = book_row.scalar_one_or_none()
        if not b:
            return 0
        # Single book; range may span chapters
        total = 0
        for ch in range(chapter_start, chapter_end + 1):
            v_start = verse_start if ch == chapter_start else 1
            v_end = verse_end if ch == chapter_end else 9999
            r = await self.db.execute(
                select(func.count(BibleVerse.id)).where(
                    BibleVerse.book_id == b.id,
                    BibleVerse.chapter == ch,
                    BibleVerse.verse_number >= v_start,
                    BibleVerse.verse_number <= v_end,
                )
            )
            total += r.scalar_one() or 0
        return total

    async def get_random_verse(
        self,
        themes: list[str],
        time_of_day: str | None = None,
    ) -> RandomVerseResponse | None:
        """SDS: get_random_verse(themes, timeOfDay). FR-4.1.1: filter by themes; FR-4.1.2: time tone."""

        effective_themes = list(themes)

        if time_of_day:
            # Map time_of_day to additional themes for tone adaptation
            if time_of_day == "morning":
                effective_themes.extend(["hope", "new beginnings", "encouragement", "guidance"])
            elif time_of_day == "afternoon":
                effective_themes.extend(["wisdom", "perseverance", "strength", "guidance"])
            elif time_of_day == "evening":
                effective_themes.extend(["peace", "rest", "comfort", "reflection"])
            # Remove duplicates
            effective_themes = list(set(effective_themes))

        if effective_themes:
            r = await self.db.execute(
                select(BibleTopicVerse, BibleTopic)
                .join(BibleTopic, BibleTopicVerse.topic_id == BibleTopic.id)
                .where(BibleTopic.topic.in_(effective_themes))
            )
            rows = r.all()
            if not rows:
                # Fallback: unfiltered random from all verses if no themes match
                return await self._random_verse_from_db()
            tv, topic = random.choice(rows)
            return RandomVerseResponse(
                book="",  # topic verse has book_and_verse string
                chapter=0,
                verse=0,
                text=tv.text,
                book_and_verse=tv.book_and_verse or "",
            )
        return await self._random_verse_from_db(time_of_day=time_of_day) # Pass time_of_day to fallback

    async def _random_verse_from_db(self, time_of_day: str | None = None) -> RandomVerseResponse | None:
        # time_of_day is passed for potential future use, but currently not used for unfiltered random selection
        """Random verse from bible_verses."""
        r = await self.db.execute(
            select(func.count(BibleVerse.id))
        )
        n = r.scalar_one() or 0
        if n == 0:
            return None
        offset = random.randint(0, n - 1)
        r = await self.db.execute(
            select(BibleVerse, BibleBook)
            .join(BibleBook, BibleVerse.book_id == BibleBook.id)
            .offset(offset)
            .limit(1)
        )
        row = r.one_or_none()
        if not row:
            return None
        v, book = row
        return RandomVerseResponse(
            book=book.title,
            chapter=v.chapter,
            verse=v.verse_number,
            text=v.text,
            book_and_verse=f"{book.title} {v.chapter}:{v.verse_number}",
        )
