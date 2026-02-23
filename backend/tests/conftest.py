"""Pytest fixtures. Unit tests need no DB; integration tests use real get_db (set DATABASE_URL)."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    """Async HTTP client for app. Uses real get_db (requires DATABASE_URL for integration)."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
