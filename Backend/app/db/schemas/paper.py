from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime

class AuthorBase(BaseModel):
    name: str

class AuthorCreate(AuthorBase):
    pass

class Author(AuthorBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class TopicBase(BaseModel):
    name: str
    description: Optional[str] = None

class TopicCreate(TopicBase):
    pass

class Topic(TopicBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class PaperBase(BaseModel):
    arxiv_id: str
    title: str
    abstract: str
    published_date: datetime
    updated_date: Optional[datetime] = None
    pdf_url: Optional[str] = None
    doi: Optional[str] = None
    journal_ref: Optional[str] = None
    categories: Optional[str] = None
    # Extracted fields
    problem: Optional[str] = None
    motivation: Optional[str] = None
    method: Optional[str] = None
    datasets: Optional[str] = None
    architecture: Optional[str] = None
    training_strategy: Optional[str] = None
    evaluation: Optional[str] = None
    results: Optional[str] = None
    limitations: Optional[str] = None
    future_work: Optional[str] = None
    contribution: Optional[str] = None

class PaperCreate(PaperBase):
    pass

class Paper(PaperBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    authors: List[Author] = []
    topics: List[Topic] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

class PaperSearchResult(BaseModel):
    papers: List[Paper]
    total: int
    page: int
    size: int
    pages: int
