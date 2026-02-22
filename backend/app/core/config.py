from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _env_path() -> Path:
    # backend/app/core/config.py -> project root
    return Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_env_path(),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Database
    database_url: str = "postgresql+asyncpg://bible_user:bible_pass@localhost:5432/bible_db"

    # Security (SDS: 100 req/min per IP)
    rate_limit_per_minute: int = 100

    debug: bool = False


settings = Settings()
