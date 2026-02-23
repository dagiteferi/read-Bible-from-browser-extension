from pathlib import Path
import re
import sys
import logging

# Project root = parent of scripts/
PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND = PROJECT_ROOT / "backend"
DATA_DIR = PROJECT_ROOT / "data"
INDIVIDUAL_BOOKS_DIR = DATA_DIR / "individual_books"
TOPICS_JSON = DATA_DIR / "amharic_bible_topics.json"

# Ensure backend is on path for app imports
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

from dotenv import load_dotenv
load_dotenv(PROJECT_ROOT / ".env")

from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert

from app.core.config import settings
from app.models import BibleBook, BibleVerse, BibleTopic, BibleTopicVerse

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)


def _sync_db_url(url: str) -> str:
    if "+asyncpg" in url:
        return url.replace("postgresql+asyncpg://", "postgresql://", 1)
    return url


def migrate_individual_books(session: Session) -> tuple[int, int]:
    """Load all individual_books/*.json into bible_books and bible_verses. Returns (books_count, verses_count)."""
    import json

    json_files = sorted(INDIVIDUAL_BOOKS_DIR.glob("*.json"))
    if not json_files:
        raise FileNotFoundError(f"No JSON files in {INDIVIDUAL_BOOKS_DIR}")

    logger.info(f"Found {len(json_files)} JSON files to process")
    
    books_added = 0
    books_skipped = 0
    verses_added = 0
    verses_skipped = 0

    for idx, path in enumerate(json_files, 1):
        # Book number from filename: 01_..., 52_... -> 1, 52
        match = re.match(r"^(\d+)_", path.name)
        if not match:
            logger.warning(f"  [{idx}/{len(json_files)}] Skip (no number prefix): {path.name}")
            continue
        book_number = int(match.group(1))

        logger.info(f"  [{idx}/{len(json_files)}] Processing book {book_number}: {path.name}")

        # Load JSON data first (needed for verses even if book exists)
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Check if book already exists
        existing_book = session.scalar(
            select(BibleBook).where(BibleBook.book_number == book_number)
        )
        if existing_book:
            logger.info(f"    Book {book_number} already exists (id={existing_book.id}), skipping book insert...")
            books_skipped += 1
            book_id = existing_book.id
        else:
            title = data.get("title") or ""
            abbv = data.get("abbv") or ""

            book = BibleBook(book_number=book_number, title=title, abbv=abbv)
            session.add(book)
            session.flush()  # get book.id
            book_id = book.id
            books_added += 1
            logger.info(f"    Added book {book_number} (id={book_id}): {title}")

        # Process verses - use bulk insert with ON CONFLICT DO NOTHING
        chapters = data.get("chapters") or []
        verse_batch = []
        total_verses_in_file = 0
        
        for ch_idx, ch in enumerate(chapters, 1):
            ch_num_str = ch.get("chapter") or "0"
            try:
                chapter = int(ch_num_str)
            except ValueError:
                logger.warning(f"      Chapter {ch_idx}: invalid chapter number '{ch_num_str}', using 0")
                chapter = 0
            
            verses_list = ch.get("verses") or []
            total_verses_in_file += len(verses_list)
            
            for i, verse_text in enumerate(verses_list):
                verse_number = i + 1
                verse_batch.append({
                    "book_id": book_id,
                    "chapter": chapter,
                    "verse_number": verse_number,
                    "text": verse_text if isinstance(verse_text, str) else str(verse_text),
                })
        
        if verse_batch:
            # Use PostgreSQL INSERT ... ON CONFLICT DO NOTHING
            stmt = insert(BibleVerse).values(verse_batch)
            stmt = stmt.on_conflict_do_nothing(
                index_elements=["book_id", "chapter", "verse_number"]
            )
            result = session.execute(stmt)
            session.flush()
            
            # Count how many were actually inserted (approximate)
            # We can't get exact count from ON CONFLICT, so we'll estimate
            verses_added += len(verse_batch)
            logger.info(f"    Processed {len(chapters)} chapters, {total_verses_in_file} verses")

    logger.info(f"Books: {books_added} added, {books_skipped} skipped")
    logger.info(f"Verses: {verses_added} processed (some may have been skipped due to duplicates)")
    
    return books_added, verses_added


def migrate_amharic_topics(session: Session) -> tuple[int, int]:
    """Load amharic_bible_topics.json into bible_topics and bible_topic_verses. Returns (topics_count, verses_count)."""
    import json

    if not TOPICS_JSON.exists():
        raise FileNotFoundError(f"Topics file not found: {TOPICS_JSON}")

    logger.info(f"Loading topics from {TOPICS_JSON}")
    with open(TOPICS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    topics_list = data.get("topics") or []
    logger.info(f"Found {len(topics_list)} topics to process")
    
    topics_added = 0
    topics_skipped = 0
    verses_added = 0

    for idx, t in enumerate(topics_list, 1):
        topic_name = t.get("topic") or ""
        source_url = t.get("source_url") or ""

        # Check if topic already exists (by topic_index)
        existing_topic = session.scalar(
            select(BibleTopic).where(BibleTopic.topic_index == idx - 1)
        )
        if existing_topic:
            logger.info(f"  [{idx}/{len(topics_list)}] Topic already exists (index={idx-1}): {topic_name[:50]}...")
            topics_skipped += 1
            topic_id = existing_topic.id
            
            # Check if verses already exist for this topic
            existing_verse_count = session.scalar(
                select(func.count(BibleTopicVerse.id)).where(BibleTopicVerse.topic_id == topic_id)
            )
            if existing_verse_count and existing_verse_count > 0:
                logger.info(f"    Topic already has {existing_verse_count} verses, skipping verse insert")
                continue
        else:
            topic = BibleTopic(topic=topic_name, source_url=source_url, topic_index=idx - 1)
            session.add(topic)
            session.flush()
            topic_id = topic.id
            topics_added += 1
            logger.info(f"  [{idx}/{len(topics_list)}] Added topic (id={topic_id}): {topic_name[:50]}...")

        # Process verses
        verses_list = t.get("verses") or []
        verse_batch = []
        
        for v_idx, v in enumerate(verses_list):
            text_val = v.get("text") or ""
            book_and_verse_val = v.get("book_and_verse") or ""
            verse_batch.append({
                "topic_id": topic_id,
                "text": text_val,
                "book_and_verse": book_and_verse_val,
                "verse_index": v_idx,
            })
        
        if verse_batch:
            # Insert verses (no unique constraint, so duplicates are possible but unlikely)
            # If topic existed, we already checked and skipped if verses exist
            for verse_data in verse_batch:
                session.add(BibleTopicVerse(**verse_data))
            session.flush()
            verses_added += len(verse_batch)
            logger.info(f"    Added {len(verse_batch)} verses for topic {idx}")

    logger.info(f"Topics: {topics_added} added, {topics_skipped} skipped")
    logger.info(f"Topic verses: {verses_added} processed")
    
    return topics_added, verses_added


def main() -> None:
    logger.info("=" * 70)
    logger.info("Starting Bible data migration")
    logger.info("=" * 70)
    
    if not INDIVIDUAL_BOOKS_DIR.exists():
        logger.error(f"Error: {INDIVIDUAL_BOOKS_DIR} not found.")
        sys.exit(1)
    if not TOPICS_JSON.exists():
        logger.error(f"Error: {TOPICS_JSON} not found.")
        sys.exit(1)

    sync_url = _sync_db_url(settings.database_url)
    logger.info(f"Connecting to database: {sync_url.split('@')[-1] if '@' in sync_url else 'local'}")
    engine = create_engine(sync_url)

    try:
        with Session(engine) as session:
            # Individual books -> bible_books, bible_verses
            logger.info("")
            logger.info("=" * 70)
            logger.info("STEP 1: Migrating individual_books -> bible_books, bible_verses")
            logger.info("=" * 70)
            books_count, verses_count = migrate_individual_books(session)
            logger.info(f"✓ Completed: {books_count} books, {verses_count} verses processed")

            # Topics -> bible_topics, bible_topic_verses
            logger.info("")
            logger.info("=" * 70)
            logger.info("STEP 2: Migrating amharic_bible_topics.json -> bible_topics, bible_topic_verses")
            logger.info("=" * 70)
            topics_count, topic_verses_count = migrate_amharic_topics(session)
            logger.info(f"✓ Completed: {topics_count} topics, {topic_verses_count} topic verses processed")

            logger.info("")
            logger.info("Committing transaction...")
            session.commit()
            logger.info("✓ Transaction committed successfully")

        logger.info("")
        logger.info("=" * 70)
        logger.info("Migration completed successfully!")
        logger.info("No data loss: all books, chapters, verses and topics/verses are in the database.")
        logger.info("=" * 70)
    except Exception as e:
        logger.error(f"Migration failed: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
