from datetime import datetime

from pydantic import BaseModel, Field


class AnalyticsEventCreate(BaseModel):
    user_id: int | None = None
    event_type: str = Field(min_length=1, max_length=128)
    page_url: str | None = Field(default=None, max_length=500)
    payload_json: str | None = None


class AnalyticsEventRead(BaseModel):
    id: int
    user_id: int | None = None
    event_type: str
    page_url: str | None = None
    payload_json: str | None = None
    created_at: datetime | None = None

    model_config = {"from_attributes": True}
