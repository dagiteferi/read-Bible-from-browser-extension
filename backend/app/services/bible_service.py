import random

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
        """
        SDS: get_random_verse(themes, timeOfDay).
        FR-4.1.1: filter by themes.
        FR-4.1.2: adapt selection based on time_of_day bucket using topic_index.
        """
        # Load all topics once for filtering
        r_topics = await self.db.execute(select(BibleTopic))
        topics = list(r_topics.scalars().all())
        if not topics:
            # No topic-based data; fallback to plain random verse
            return await self._random_verse_from_db()

        # 1) Filter by explicit themes (substring match, case-insensitive)
        candidate_topics = topics
        if themes:
            lowered = [t.lower() for t in themes]
            candidate_topics = [
                t for t in topics if any(key in t.topic.lower() for key in lowered)
            ]

        # 2) If time_of_day is provided, narrow candidates into buckets by topic_index
        if time_of_day:
            bucketed = self._filter_topics_by_time_of_day(
                candidate_topics if candidate_topics else topics,
                time_of_day,
            )
            if bucketed:
                candidate_topics = bucketed

        # If still no candidates, fallback to full DB random
        if not candidate_topics:
            return await self._random_verse_from_db()

        topic = random.choice(candidate_topics)
        r_verses = await self.db.execute(
            select(BibleTopicVerse).where(BibleTopicVerse.topic_id == topic.id)
        )
        verses = list(r_verses.scalars().all())
        if not verses:
            # Topic has no verses; fallback
            return await self._random_verse_from_db()
        tv = random.choice(verses)
        return RandomVerseResponse(
            book="",
            chapter=0,
            verse=0,
            text=tv.text,
            book_and_verse=tv.book_and_verse or "",
        )

    def _filter_topics_by_time_of_day(
        self,
        topics: list[BibleTopic],
        time_of_day: str,
    ) -> list[BibleTopic]:
        """Bucket topics by topic_index to roughly adapt tone by time of day."""
        if not topics:
            return []
        sorted_topics = sorted(topics, key=lambda t: t.topic_index)
        n = len(sorted_topics)
        if n == 1:
            return sorted_topics
        # Split into three buckets: morning (first third), afternoon (middle), evening (last)
        one_third = max(1, n // 3)
        if time_of_day == "morning":
            return sorted_topics[:one_third]
        if time_of_day == "afternoon":
            return sorted_topics[one_third : 2 * one_third]
        # evening or anything else -> last third
        return sorted_topics[2 * one_third :]

    async def _random_verse_from_db(self) -> RandomVerseResponse | None:
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
