from sqlalchemy import Column, DateTime, Integer, String, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query = Column(Text, nullable=False)
    status = Column(String, default="processing")  # processing, completed, failed
    result_summary = Column(Text, nullable=True)  # Optional summary of results
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationship
    # user = relationship("User", back_populates="search_history")