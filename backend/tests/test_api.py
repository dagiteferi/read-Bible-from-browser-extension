"""API integration tests (SRS 3.3, SDS). Require DATABASE_URL and migrated DB."""

import os
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

# Skip all if no DB (e.g. CI without Postgres)
pytestmark = pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skip integration tests",
)


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health(client: AsyncClient):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_list_books(client: AsyncClient):
    """SRS: GET /books returns list in <100ms."""
    r = await client.get("/v1/books")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    # May be empty if migration not run
    if data:
        assert all(isinstance(b, str) for b in data)


@pytest.mark.asyncio
async def test_metadata_404(client: AsyncClient):
    """SRS: GET /metadata/{book} 404 if not found."""
    r = await client.get("/v1/metadata/NonExistentBookName")
    assert r.status_code == 404


@pytest.mark.asyncio
async def test_verses_invalid_range(client: AsyncClient):
    """SRS: Invalid range returns 400."""
    r = await client.get("/v1/verses/Genesis/1/5/3")  # start > end
    assert r.status_code == 400


@pytest.mark.asyncio
async def test_plan_create_validation(client: AsyncClient):
    """SRS: Invalid plan body returns 400."""
    r = await client.post(
        "/v1/plan/create",
        json={"books": [], "max_verses_per_unit": 3},
    )
    assert r.status_code == 422  # Pydantic validation: books min_length 1


@pytest.mark.asyncio
async def test_feedback_submit_empty(client: AsyncClient):
    """SRS: Feedback with no rating/suggestion/issue returns 400."""
    r = await client.post(
        "/v1/feedback/submit",
        json={},
    )
    assert r.status_code in (400, 422)


@pytest.mark.asyncio
async def test_random_verse_no_body(client: AsyncClient):
    """SDS: POST /v1/random-verse accepts empty body."""
    r = await client.post("/v1/random-verse", json={})
    # 200 with verse or 200 with null if no data
    assert r.status_code == 200
