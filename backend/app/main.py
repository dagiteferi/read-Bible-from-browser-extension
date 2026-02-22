from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.database import init_db
from app.core.security import RateLimitMiddleware
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Bible Notification API",
    version="0.1.0",
    lifespan=lifespan,
)
app.add_middleware(RateLimitMiddleware)


@app.get("/health")
async def health():
    return {"status": "ok"}
