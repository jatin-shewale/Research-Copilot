from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class SearchHistoryBase(BaseModel):
    user_id: int
    query: str
    status: str

class SearchHistoryCreate(SearchHistoryBase):
    pass

class SearchHistory(SearchHistoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    result_summary: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
