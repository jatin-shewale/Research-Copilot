from sqlalchemy.ext.asyncio import AsyncSession, AsyncEngine, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Optional
from app.core.config import settings

engine: Optional[AsyncEngine] = None
AsyncSessionLocal = None


def get_async_session_local():
    global engine, AsyncSessionLocal

    if AsyncSessionLocal is None:
        connect_args = {}
        if str(settings.SQLALCHEMY_DATABASE_URI).startswith("sqlite"):
            connect_args = {"check_same_thread": False}

        engine = create_async_engine(
            str(settings.SQLALCHEMY_DATABASE_URI),
            echo=settings.DEBUG,
            future=True,
            pool_pre_ping=True,
            connect_args=connect_args,
        )
        AsyncSessionLocal = sessionmaker(
            engine, class_=AsyncSession, expire_on_commit=False
        )

    return AsyncSessionLocal


def get_engine() -> AsyncEngine:
    get_async_session_local()
    return engine

# Base class for models
Base = declarative_base()

# Dependency to get DB session
async def get_db() -> AsyncSession:
    session_local = get_async_session_local()
    async with session_local() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    from app.db.models import paper, search_history, user  # noqa: F401

    async with get_engine().begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
