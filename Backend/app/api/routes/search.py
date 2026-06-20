import logging
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.api.deps import get_db_session, get_current_active_user
from app.db.models.user import User as UserModel
from app.db.crud.search_history import create_search_history, update_search_history, get_user_search_history
from app.db.schemas.search_history import SearchHistoryCreate
from app.core.config import settings
import uuid

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory store for search tasks (in production, use Redis or a database)
search_tasks = {}

@router.post("/", response_model=dict)
async def start_research(
    search_in: SearchHistoryCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db_session),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Start a research pipeline for the given query.
    Returns a search ID that can be used to retrieve results.
    """
    # Generate a unique search ID
    search_id = str(uuid.uuid4())

    # Create search history record when the database is available.
    db_search_history = None
    try:
        search_history = SearchHistoryCreate(
            user_id=current_user.id,
            query=search_in.query,
            status="processing"
        )
        db_search_history = await create_search_history(db, search_history)
    except Exception as exc:
        logger.warning("Search history could not be persisted; continuing without DB record: %s", exc)

    # Store the task (in production, use a proper task queue like Celery)
    search_tasks[search_id] = {
        "status": "processing",
        "result": None,
        "query": search_in.query,
        "db_id": db_search_history.id if db_search_history else None
    }

    # Run the pipeline in the background
    background_tasks.add_task(run_research_pipeline, search_id, search_in.query, current_user.id)

    return {"search_id": search_id, "status": "started"}

@router.get("/history", response_model=list)
async def get_history(
    db: AsyncSession = Depends(get_db_session),
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get search history list for current user.
    """
    history = await get_user_search_history(db, user_id=current_user.id)
    return [
        {
            "id": h.id,
            "query": h.query,
            "status": h.status,
            "result_summary": h.result_summary,
            "created_at": h.created_at.isoformat() if h.created_at else None,
            "completed_at": h.completed_at.isoformat() if h.completed_at else None
        }
        for h in history
    ]

@router.get("/{search_id}", response_model=dict)
async def get_search_results(
    search_id: str,
    current_user: UserModel = Depends(get_current_active_user)
):
    """
    Get the results of a research search by its ID.
    """
    if search_id not in search_tasks:
        raise HTTPException(status_code=404, detail="Search not found")

    task = search_tasks[search_id]
    if task["status"] == "processing":
        return {"status": "processing", "message": "Research is still in progress"}
    elif task["status"] == "completed":
        return {"status": "completed", "results": task["result"]}
    elif task["status"] == "failed":
        return {"status": "failed", "error": task.get("error", "Unknown error")}
    else:
        return {"status": "unknown"}

async def run_research_pipeline(search_id: str, query: str, user_id: int):
    """
    Background task to run the research pipeline.
    """
    from app.pipelines.research_pipeline import ResearchPipeline

    # Create a new database session for this background task
    engine = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI))
    AsyncSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with AsyncSessionLocal() as db:
        db_id = search_tasks[search_id].get("db_id")
        try:
            pipeline = ResearchPipeline()
            results = await pipeline.run(query)

            # Update the task with results
            search_tasks[search_id] = {
                "status": "completed",
                "result": results,
                "query": query,
                "db_id": db_id
            }

            # Update search history in database
            if db_id is not None:
                await update_search_history(
                    db,
                    search_id=db_id,
                    status="completed",
                    result_summary=str(results)[:500]  # Store a summary
                )

        except Exception as e:
            logger.error(f"Error in research pipeline for search {search_id}: {e}")
            search_tasks[search_id] = {
                "status": "failed",
                "error": str(e),
                "query": query,
                "db_id": db_id
            }
            # Update search history as failed
            if db_id is not None:
                await update_search_history(
                    db,
                    search_id=db_id,
                    status="failed",
                    result_summary=str(e)[:500]
                )
        finally:
            await engine.dispose()
