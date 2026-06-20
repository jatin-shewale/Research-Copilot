from typing import Any, List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "Research Copilot"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True

    SECRET_KEY: str = "your-secret-key-here"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "researchcopilot"
    POSTGRES_PORT: str = "5432"

    SQLALCHEMY_DATABASE_URI: Union[str, None] = None

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v: Any) -> bool:
        if isinstance(v, bool):
            return v
        if isinstance(v, str):
            normalized = v.strip().lower()
            if normalized in {"1", "true", "t", "yes", "y", "on", "dev", "development"}:
                return True
            if normalized in {"0", "false", "f", "no", "n", "off", "release", "prod", "production"}:
                return False
        return bool(v)

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Any, info):
        if isinstance(v, str):
            return v

        data = info.data

        return (
            f"postgresql+asyncpg://"
            f"{data.get('POSTGRES_USER')}:"
            f"{data.get('POSTGRES_PASSWORD')}@"
            f"{data.get('POSTGRES_SERVER')}:"
            f"{data.get('POSTGRES_PORT')}/"
            f"{data.get('POSTGRES_DB')}"
        )

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        if isinstance(v, str):
            raw = v.strip()
            if raw.startswith("[") and raw.endswith("]"):
                raw = raw[1:-1]
            return [
                item.strip().strip('"').strip("'")
                for item in raw.split(",")
                if item.strip().strip('"').strip("'")
            ]
        return list(v) if v else []

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Union[str, None] = None

    # ChromaDB
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000

    # AI
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen3:14b"

    # arXiv
    ARXIV_API_URL: str = "http://export.arxiv.org/api/query"
    ARXIV_MAX_RESULTS: int = 100

    # Embeddings
    EMBEDDING_MODEL_NAME: str = "BAAI/bge-large-en-v1.5"

    # HDBSCAN
    HDBSCAN_MIN_CLUSTER_SIZE: int = 5
    HDBSCAN_MIN_SAMPLES: int = 1


settings = Settings()
