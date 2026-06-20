from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.paper import Paper
from app.db.models.user import User
from app.db.models.search_history import SearchHistory
from app.db.models.paper import Topic
from app.db.schemas.analytics import Analytics

async def get_analytics(db: AsyncSession) -> Analytics:
    """
    Get analytics data for the platform.
    """
    # Count papers
    paper_count_query = select(func.count(Paper.id))
    paper_count_result = await db.execute(paper_count_query)
    paper_count = paper_count_result.scalar() or 0

    # Count users
    user_count_query = select(func.count(User.id))
    user_count_result = await db.execute(user_count_query)
    user_count = user_count_result.scalar() or 0

    # Count completed searches
    completed_searches_query = select(func.count(SearchHistory.id)).where(
        SearchHistory.status == "completed"
    )
    completed_searches_result = await db.execute(completed_searches_query)
    completed_searches = completed_searches_result.scalar() or 0

    # Count topics
    topic_count_query = select(func.count(Topic.id))
    topic_count_result = await db.execute(topic_count_query)
    topic_count = topic_count_result.scalar() or 0

    # Count clusters (we don't have a cluster model, so we'll skip or use a placeholder)
    # For now, we'll set to 0
    cluster_count = 0

    return Analytics(
        papers_processed=paper_count,
        topics_explored=topic_count,
        clusters_created=cluster_count,
        research_maps_generated=completed_searches,
        user_activity=user_count  # Simplified
    )
