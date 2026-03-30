from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.site import CrmSyncLog


router = APIRouter()


@router.get("/sync-log")
def list_crm_sync_log(db: Session = Depends(get_db)) -> list[dict[str, str | int | None]]:
    items = db.execute(select(CrmSyncLog).order_by(CrmSyncLog.id.desc()).limit(200)).scalars().all()
    return [
        {
            "id": item.id,
            "entity_type": item.entity_type,
            "entity_id": item.entity_id,
            "status": item.status,
            "request_url": item.request_url,
            "payload_json": item.payload_json,
            "response_body": item.response_body,
            "error_message": item.error_message,
            "created_at": item.created_at.isoformat() if item.created_at else None,
        }
        for item in items
    ]
