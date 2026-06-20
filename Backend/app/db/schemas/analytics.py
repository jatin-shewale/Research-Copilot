from pydantic import BaseModel, ConfigDict

class Analytics(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    papers_processed: int
    topics_explored: int
    clusters_created: int
    research_maps_generated: int
    user_activity: int
