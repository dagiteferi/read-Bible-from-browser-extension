import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re
import os
from dotenv import load_dotenv


load_dotenv()

BASE_URL =os.getenv("BASE_URL")
INDEX_URL = os.getenv("INDEX_URL")

FULL_INDEX_URL = urljoin(BASE_URL, INDEX_URL)
print(f"Scraping index: {FULL_INDEX_URL}")

response = requests.get(FULL_INDEX_URL, headers={
    'User-Agent': 'Mozilla/5.0 (compatible; bot/0.1; +https://example.org/bot)'
})
response.raise_for_status()
soup = BeautifulSoup(response.text, "html.parser")

topics_data = []

# Find all links
all_links = soup.find_all("a")
print(f"Found {len(all_links)} links on index page")

for link in all_links:
    title = link.get_text(strip=True)
    href = link.get("href")
    if not title or not href:
        continue

    if href.endswith(".htm") and re.search(r"\d", href):
        topic_url = urljoin(BASE_URL, href)
        print(f"Scraping topic: {title} -> {topic_url}")


        try:
            topic_resp = requests.get(topic_url, headers={'User-Agent': 'Mozilla/5.0'})
            topic_resp.raise_for_status()
        except Exception as e:
            print(f"Failed to fetch topic {title}: {e}")
            continue

        topic_soup = BeautifulSoup(topic_resp.text, "html.parser")

        container_tags = ['td', 'div', 'pre', 'p', 'article', 'section', 'table', 'tbody']
        best_text = ''
        best_score = 0
        for tag in container_tags:
            for c in topic_soup.find_all(tag):
                txt = c.get_text(separator='\n', strip=True)
                score = sum(1 for ch in txt if '\u1200' <= ch <= '\u137F')
                if score > best_score:
                    best_score = score
                    best_text = txt

        if best_score < 5:
            best_text = topic_soup.get_text(separator='\n', strip=True)

        lines = [l.strip() for l in best_text.splitlines() if l.strip()]
        verses = []
        buffer = []

        def extract_book_name(s):
            """Heuristic: find a short Amharic substring (1-4 words) before or after the ref that's likely a book name."""
            parts = s.split()
            
            for length in (3,2,1):
                for start in range(max(0, len(parts)-length), len(parts)):
                    cand = ' '.join(parts[start:start+length]).strip()
                    if cand and any('\u1200' <= ch <= '\u137F' for ch in cand):
                        return cand
            return ''

        for line in lines:
            line = re.sub(r'\s+', ' ', line)
            m = re.search(r'(\d+\s*:\s*\d+)', line)
            if m:
                ref = m.group(1).replace(' ', '')
                pre = line[:m.start()].strip()
                post = line[m.end():].strip()

                if pre and any('\u1200' <= ch <= '\u137F' for ch in pre):
                    buffer.append(pre)

                text = ' '.join(buffer).strip()
                if not text and post and any('\u1200' <= ch <= '\u137F' for ch in post):
                    text = post

                if text:
                    
                    book = extract_book_name(pre) or extract_book_name(post)
                    book_and_verse = f"{book} {ref}".strip() if book else ref

                   
                    if book:
                       
                        start_re = r'^(?:' + re.escape(book) + r')[\s:\-,፣።፤]*'
                        text = re.sub(start_re, '', text).strip()
                        
                        end_re = r'[\s:\-,፣።፤]*(?:' + re.escape(book) + r')$'
                        text = re.sub(end_re, '', text).strip()
                        
                        if book:
                           
                            pattern = r'(?:(?:\b)|^|\s|[\-:፣።፤,])*' + re.escape(book) + r'(?:(?:\b)|$|\s|[\-:፣።፤,])*'
                            text = re.sub(pattern, ' ', text).strip()
                            # Normalize spaces and remove leading/trailing punctuation
                            text = re.sub(r'\s+', ' ', text)
                            text = re.sub(r'^[\-:፣።፤,\s]+|[\-:፣።፤,\s]+$', '', text)

                    verses.append({
                        'text': text,
                        'book_and_verse': book_and_verse
                    })
                buffer = []
            else:
                if any('\u1200' <= ch <= '\u137F' for ch in line):
                    buffer.append(line)

        if buffer:
            verses.append({
                'text': ' '.join(buffer).strip(),
                'book_and_verse': ''
            })

        if verses:
            topics_data.append({
                "topic": title,
                "source_url": topic_url,
                "verses": verses
            })

final_data = {
    "language": "Amharic",
    "source": FULL_INDEX_URL,
    "topics": topics_data
}


out_fp = "data/amharic_bible_topics.json"
with open(out_fp, "w", encoding="utf-8") as f:
    json.dump(final_data, f, ensure_ascii=False, indent=2)

print(f"Saved {len(topics_data)} topics to {out_fp}")
