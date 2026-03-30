from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.site import AnalyticsEvent
from app.schemas.analytics import AnalyticsEventCreate, AnalyticsEventRead


router = APIRouter()


@router.post("", response_model=AnalyticsEventRead, status_code=status.HTTP_201_CREATED)
def create_analytics_event(payload: AnalyticsEventCreate, db: Session = Depends(get_db)) -> AnalyticsEventRead:
    item = AnalyticsEvent(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return AnalyticsEventRead.model_validate(item)


@router.get("", response_model=list[AnalyticsEventRead])
def list_analytics_events(db: Session = Depends(get_db)) -> list[AnalyticsEventRead]:
    items = db.execute(select(AnalyticsEvent).order_by(AnalyticsEvent.id.desc()).limit(200)).scalars().all()
    return [AnalyticsEventRead.model_validate(item) for item in items]
