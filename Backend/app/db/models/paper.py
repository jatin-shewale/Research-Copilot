from sqlalchemy import Column, DateTime, Integer, String, Text, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

# Association tables
paper_author = Table(
    "paper_author",
    Base.metadata,
    Column("paper_id", Integer, ForeignKey("papers.id"), primary_key=True),
    Column("author_id", Integer, ForeignKey("authors.id"), primary_key=True),
)

paper_topic = Table(
    "paper_topic",
    Base.metadata,
    Column("paper_id", Integer, ForeignKey("papers.id"), primary_key=True),
    Column("topic_id", Integer, ForeignKey("topics.id"), primary_key=True),
)

class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    arxiv_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    abstract = Column(Text, nullable=False)
    published_date = Column(DateTime(timezone=True), nullable=False)
    updated_date = Column(DateTime(timezone=True), nullable=True)
    pdf_url = Column(String, nullable=True)
    doi = Column(String, nullable=True)
    journal_ref = Column(String, nullable=True)
    categories = Column(String, nullable=True)  # Comma-separated categories from arXiv
    # We'll store the extracted information as JSON or separate tables
    # For simplicity, we'll add some fields for extracted data
    problem = Column(Text, nullable=True)
    motivation = Column(Text, nullable=True)
    method = Column(Text, nullable=True)
    datasets = Column(Text, nullable=True)
    architecture = Column(Text, nullable=True)
    training_strategy = Column(Text, nullable=True)
    evaluation = Column(Text, nullable=True)
    results = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    future_work = Column(Text, nullable=True)
    contribution = Column(Text, nullable=True)
    # Embedding vector will be stored in ChromaDB, not in PostgreSQL
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    authors = relationship("Author", secondary=paper_author, back_populates="papers")
    topics = relationship("Topic", secondary=paper_topic, back_populates="papers")

class Author(Base):
    __tablename__ = "authors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    # We could add more fields like affiliation, homepage, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    papers = relationship("Paper", secondary=paper_author, back_populates="authors")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    papers = relationship("Paper", secondary=paper_topic, back_populates="topics")