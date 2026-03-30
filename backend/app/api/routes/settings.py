from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.settings import SiteSettingsRead, SiteSettingsUpdate
from app.services.site_settings import get_site_settings, update_site_settings


router = APIRouter()


@router.get("/site", response_model=SiteSettingsRead)
def read_site_settings(db: Session = Depends(get_db)) -> SiteSettingsRead:
    return get_site_settings(db)


@router.put("/site", response_model=SiteSettingsRead)
def save_site_settings(payload: SiteSettingsUpdate, db: Session = Depends(get_db)) -> SiteSettingsRead:
    return update_site_settings(db, payload)
