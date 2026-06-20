from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.api.deps import get_db_session, get_current_active_user
from app.db.crud.paper import get_papers, get_paper_by_arxiv_id, get_paper
from app.db.schemas.paper import Paper, PaperSearchResult
from app.db.models.paper import Paper as PaperModel

router = APIRouter()

@router.get("/", response_model=PaperSearchResult)
async def read_papers(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = Query(None, description="Search term for title or abstract"),
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_active_user)
):
    papers = await get_papers(db, skip=skip, limit=limit, search=search)
    # Get total count for pagination
    # For simplicity, we'll calculate total by getting all papers without limit (not efficient for large datasets)
    # In production, we would use a separate count query
    total_papers = await get_papers(db, skip=0, limit=10000, search=search)  # Arbitrary large limit
    total = len(total_papers)
    pages = (total + limit - 1) // limit if limit > 0 else 0
    return PaperSearchResult(
        papers=papers,
        total=total,
        page=(skip // limit) + 1,
        size=limit,
        pages=pages
    )

@router.get("/{paper_id}", response_model=Paper)
async def read_paper(
    paper_id: int,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_active_user)
):
    paper = await get_paper(db, paper_id=paper_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@router.get("/arxiv/{arxiv_id}", response_model=Paper)
async def read_paper_by_arxiv_id(
    arxiv_id: str,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_active_user)
):
    paper = await get_paper_by_arxiv_id(db, arxiv_id=arxiv_id)
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

# We'll add endpoints for creating/updating papers later (usually done by agents)