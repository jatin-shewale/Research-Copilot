from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.paper import Paper, Author, Topic, paper_author, paper_topic
from app.db.schemas.paper import PaperCreate, AuthorCreate, TopicCreate
from typing import List, Optional

async def get_paper(db: AsyncSession, paper_id: int) -> Optional[Paper]:
    result = await db.execute(select(Paper).where(Paper.id == paper_id))
    return result.scalar_one_or_none()

async def get_paper_by_arxiv_id(db: AsyncSession, arxiv_id: str) -> Optional[Paper]:
    result = await db.execute(select(Paper).where(Paper.arxiv_id == arxiv_id))
    return result.scalar_one_or_none()

async def get_papers(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None
):
    query = select(Paper)
    if search:
        search_term = f"%{search}%"
        query = query.where(
            or_(
                Paper.title.ilike(search_term),
                Paper.abstract.ilike(search_term),
            )
        )
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def create_paper(db: AsyncSession, paper_in: PaperCreate) -> Paper:
    # Check if paper already exists by arxiv_id
    existing_paper = await get_paper_by_arxiv_id(db, paper_in.arxiv_id)
    if existing_paper:
        return existing_paper

    paper = Paper(
        arxiv_id=paper_in.arxiv_id,
        title=paper_in.title,
        abstract=paper_in.abstract,
        published_date=paper_in.published_date,
        updated_date=paper_in.updated_date,
        pdf_url=paper_in.pdf_url,
        doi=paper_in.doi,
        journal_ref=paper_in.journal_ref,
        categories=paper_in.categories,
        problem=paper_in.problem,
        motivation=paper_in.motivation,
        method=paper_in.method,
        datasets=paper_in.datasets,
        architecture=paper_in.architecture,
        training_strategy=paper_in.training_strategy,
        evaluation=paper_in.evaluation,
        results=paper_in.results,
        limitations=paper_in.limitations,
        future_work=paper_in.future_work,
        contribution=paper_in.contribution,
    )
    db.add(paper)
    await db.commit()
    await db.refresh(paper)
    return paper

async def update_paper(
    db: AsyncSession,
    paper_id: int,
    paper_in: PaperCreate
) -> Optional[Paper]:
    paper = await get_paper(db, paper_id)
    if paper:
        for field, value in paper_in.dict().items():
            if hasattr(paper, field):
                setattr(paper, field, value)
        await db.commit()
        await db.refresh(paper)
    return paper

async def delete_paper(db: AsyncSession, paper_id: int) -> Optional[Paper]:
    paper = await get_paper(db, paper_id)
    if paper:
        await db.delete(paper)
        await db.commit()
    return paper

# Author CRUD
async def get_author(db: AsyncSession, author_id: int) -> Optional[Author]:
    result = await db.execute(select(Author).where(Author.id == author_id))
    return result.scalar_one_or_none()

async def get_author_by_name(db: AsyncSession, name: str) -> Optional[Author]:
    result = await db.execute(select(Author).where(Author.name == name))
    return result.scalar_one_or_none()

async def create_author(db: AsyncSession, author_in: AuthorCreate) -> Author:
    existing_author = await get_author_by_name(db, author_in.name)
    if existing_author:
        return existing_author
    author = Author(name=author_in.name)
    db.add(author)
    await db.commit()
    await db.refresh(author)
    return author

# Topic CRUD
async def get_topic(db: AsyncSession, topic_id: int) -> Optional[Topic]:
    result = await db.execute(select(Topic).where(Topic.id == topic_id))
    return result.scalar_one_or_none()

async def get_topic_by_name(db: AsyncSession, name: str) -> Optional[Topic]:
    result = await db.execute(select(Topic).where(Topic.name == name))
    return result.scalar_one_or_none()

async def create_topic(db: AsyncSession, topic_in: TopicCreate) -> Topic:
    existing_topic = await get_topic_by_name(db, topic_in.name)
    if existing_topic:
        return existing_topic
    topic = Topic(name=topic_in.name, description=topic_in.description)
    db.add(topic)
    await db.commit()
    await db.refresh(topic)
    return topic

# Association functions
async def add_author_to_paper(db: AsyncSession, paper_id: int, author_id: int):
    # Check if association already exists
    query = select(paper_author).where(
        and_(paper_author.c.paper_id == paper_id, paper_author.c.author_id == author_id)
    )
    result = await db.execute(query)
    if not result.first():
        # Insert association
        stmt = paper_author.insert().values(paper_id=paper_id, author_id=author_id)
        await db.execute(stmt)
        await db.commit()

async def add_topic_to_paper(db: AsyncSession, paper_id: int, topic_id: int):
    query = select(paper_topic).where(
        and_(paper_topic.c.paper_id == paper_id, paper_topic.c.topic_id == topic_id)
    )
    result = await db.execute(query)
    if not result.first():
        stmt = paper_topic.insert().values(paper_id=paper_id, topic_id=topic_id)
        await db.execute(stmt)
        await db.commit()