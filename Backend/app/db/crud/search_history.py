from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.search_history import SearchHistory
from app.db.schemas.search_history import SearchHistoryCreate

async def create_search_history(db: AsyncSession, search_in: SearchHistoryCreate) -> SearchHistory:
    """
    Create a new search history record.
    """
    search_history = SearchHistory(
        user_id=search_in.user_id,
        query=search_in.query,
        status=search_in.status
    )
    db.add(search_history)
    await db.commit()
    await db.refresh(search_history)
    return search_history

async def get_search_history(db: AsyncSession, search_id: int) -> SearchHistory:
    """
    Get a search history record by ID.
    """
    result = await db.execute(select(SearchHistory).where(SearchHistory.id == search_id))
    return result.scalar_one_or_none()

async def get_user_search_history(db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100):
    """
    Get search history for a specific user.
    """
    result = await db.execute(
        select(SearchHistory)
        .where(SearchHistory.user_id == user_id)
        .order_by(SearchHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def update_search_history(
    db: AsyncSession,
    search_id: int,
    status: Optional[str] = None,
    result_summary: Optional[str] = None
) -> SearchHistory:
    """
    Update a search history record.
    """
    search_history = await get_search_history(db, search_id)
    if search_history:
        if status is not None:
            search_history.status = status
        if result_summary is not None:
            search_history.result_summary = result_summary
        if status == "completed" or status == "failed":
            from sqlalchemy.sql import func
            search_history.completed_at = func.now()
        db.add(search_history)
        await db.commit()
        await db.refresh(search_history)
    return search_history