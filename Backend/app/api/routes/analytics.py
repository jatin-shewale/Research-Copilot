from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db_session, get_current_active_user
from app.db.crud.analytics import get_analytics as get_platform_analytics
from app.db.schemas.analytics import Analytics

router = APIRouter()

@router.get("/", response_model=Analytics)
async def read_analytics(
    db: AsyncSession = Depends(get_db_session),
    current_user = Depends(get_current_active_user)
):
    """
    Get analytics data for the platform.
    """
    analytics = await get_platform_analytics(db)
    return analytics
